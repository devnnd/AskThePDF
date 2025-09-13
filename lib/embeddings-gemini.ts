import {GoogleGenAI} from '@google/genai';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if(!GEMINI_API_KEY){
    console.error("Environment variable for Gemini API Key is not defined.")
}

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export async function getEmbeddingsFromGemini (text: string) {
    try {
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: text.replace(/\n/g, ' '),
            config: {
                outputDimensionality: 768
            }
        });
        return response.embeddings[0].values;
    } catch (error) {
        console.error('❌ Gemini Embeddings Creation Error: ', error);
        throw error;
    }
}