import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFromS3 } from '../s3-server';

// create pincone client
let pc: Pinecone | null = null;

export const getPineconeClient = async () => {
    pc = await new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!
    });
    return pc
}

export async function loadS3IntoPinecone (fileKey: string) {
    // 1. Obtain the PDF from S3
    const file = await downloadFromS3(fileKey);
    
}