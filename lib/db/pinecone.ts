import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { downloadFromS3 } from '../s3-server';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter';
import { getEmbeddingsFromGemini } from '../embeddings-gemini';
import { Md5 } from 'ts-md5';
import { Vector } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data';
import { sanitizeNamespace } from '../utils';

// create pincone client
let pineconeClient: Pinecone | null = null;

export const getPineconeClient = async () => {
    pineconeClient = await new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!
    });
    return pineconeClient;
}

// type of PDF page
type PDFDocument = {
    pageContent: string,
    metadata: {
        loc: { pageNumber: number }
    }
}

export async function loadS3IntoPinecone (fileKey: string) {
    // 1. Obtain the PDF from S3, store and read
    const filePath = await downloadFromS3(fileKey);
    if(!filePath) {
        throw new Error('Error downloading file.')
    }
    const loader = new PDFLoader(filePath);
    const rawDocs = (await loader.load()) as PDFDocument[]; // doc refers to individual PDF pages here

    /* 2. Pre-process and chunk the documents
     * [[p1_chunk1, p1_chunk2], [p2_chunk1], [p3_chunk1, p3_chunk2]] */
    const chunkedDocs = (await Promise.all(rawDocs.map(prepareDocument)));

    /* Flatten the nested array into a single, flat list of all chunks
     * [p1_chunk1, p1_chunk2, p2_chunk1, p3_chunk1, p3_chunk2] */
    const chunks = chunkedDocs.flat();
    
    // 3. Vectorise and embed each chunk individually
    const vectors = await Promise.all(chunks.map(embedDocument)) as PineconeRecord[];

    // 4. Upload the vectors to the Pinecone Index
    const client = await getPineconeClient();
    const pineconeIndex = client.Index('askthepdf-dev', process.env.PINECONE_HOST);
    const sanitizedNamespace = sanitizeNamespace(fileKey);

    // Batch the upsert requests to avoid exceeding Pinecone's payload size limits
    const batchSize = 100;
    for(let i=0; i<vectors.length; i+=batchSize){
        const currentBatch = vectors.slice(i, i+batchSize);
        await pineconeIndex.namespace(sanitizedNamespace).upsert(currentBatch);
    }

    return {
        success: true
    }
}

export async function embedDocument (doc: Document) {
    try {
        const embeddings = await getEmbeddingsFromGemini(doc.pageContent);
        const hash: string = Md5.hashStr(doc.pageContent);

        if(!embeddings || embeddings.length === 0) {
            throw new Error("Failed to generate embedding for chunk starting with: " + doc.pageContent.substring(0, 50) + "...");
        }

        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            }
        } as Vector
    } catch (error) {
        console.error('Error embedding document: ', error);
        throw error;
    }
}

// Truncates a string to a specified number of bytes
export function truncateStringByBytes (str: string, bytes: number) {
    const enc = new TextEncoder();
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes));
}

/*
 * Takes a single document (representing a PDF page), cleans its content, 
 * and splits it into smaller, manageable chunks.
 */
export async function prepareDocument (doc: PDFDocument) {
    let { pageContent, metadata } = doc;
    pageContent = pageContent.replace(/\n/g, ' ');

    const splitter = new RecursiveCharacterTextSplitter();
    // Split the documents into an array of smaller documents (chunks)
    const chunks = await splitter.splitDocuments([
        new Document({
            pageContent, // The actual text content to be split
            metadata: { 
                // Metadata is attached to each new chunk created by the splitter
                pageNumber: metadata.loc.pageNumber,
                // Store a truncated version of the original pageContent as context for each chunk
                text: truncateStringByBytes(pageContent, 36000)
            }
        })
    ]);
    return chunks;
}