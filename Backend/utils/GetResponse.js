import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const getApiResponse = async (message) => {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: message,
        });
        const data = response.text;
        console.log('Generated content:', data);
        return data;

    } catch (error) {
        console.error('Error generating content:', error);
    }
}

export default getApiResponse;