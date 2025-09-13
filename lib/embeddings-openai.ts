import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.OPENAI_SECRET_KEY
});

export async function getEmbeddingsFromOpenAI (text: string) {
    try {
        const response = await client.embeddings.create({
            model: 'text-embedding-ada-002',
            input: text.replace(/\n/g, ' ')
        });
        return response.data[0].embedding as number[];
    } catch (error) {
        console.log('❌ OpenAI Embeddings Creation Error: ', error);
        throw error;
    }
}