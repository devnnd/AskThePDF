import { getEmbeddingsFromGemini } from "./embeddings-gemini";
import { getPineconeClient } from "./pinecone";
import { sanitizeNamespace } from "./utils";

export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string){
    try {
        const pc = await getPineconeClient();
        const index = pc.Index('askthepdf-dev');
        const sanitizedNamespace = sanitizeNamespace(fileKey);
        const queryResponse = await index.namespace(sanitizedNamespace).query({
            topK: 5,
            vector: embeddings,
            includeMetadata: true
        });
    return queryResponse.matches;
    } catch(error) {
        console.error(error);
        throw error;
    }
}

export async function getContext(query: string, fileKey: string){
    try {
        const queryEmbeddings = await getEmbeddingsFromGemini(query);
        if(!queryEmbeddings || queryEmbeddings.length === 0) {
            throw new Error("Failed to generate embedding for query: " + query.substring(0, 50) + "...");
        }
        const matches = await getMatchesFromEmbeddings((queryEmbeddings as number[]), fileKey);
        const qualifyingDocs = matches.filter(match => match.score && match.score > 0.5);

        type Metadata = {
            text: string,
            pageNumber: number
        }

        let docs = qualifyingDocs.map(doc => (doc.metadata as Metadata).text);
        return docs.join('\n').substring(0, 3000);
    } catch(error) {
        console.error(error);
        throw error;
    }
}