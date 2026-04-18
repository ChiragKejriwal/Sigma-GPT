const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

const getApiResponse = async (message) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing in backend environment');
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
        });

        const data = response?.text;

        if (!data || typeof data !== 'string') {
            throw new Error('Empty response from Gemini API');
        }

        return data;
    } catch (error) {
        const apiMessage = error?.message || 'Unknown Gemini API error';
        throw new Error(`Gemini generation failed: ${apiMessage}`);
    }
};

module.exports = getApiResponse;