
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found in process.env.API_KEY. Using mock responses.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = 'gemini-2.5-flash';

const mockResponses = [
    "I understand you're asking about that. As your local AI assistant running on Jan, I can help you explore this topic while keeping all our conversation private on your device.",
    "That's a great question! Since I'm running locally through Jan, I can provide detailed assistance without any privacy concerns. Let me break this down for you...",
    "I'm happy to help with that. One of the benefits of using Jan is that I can process your requests completely offline while maintaining your privacy. Here's what I think...",
    "Thanks for asking! As a local AI model running through Jan, I have access to my training knowledge while ensuring your data stays on your device. Let me provide some insights...",
    "I can definitely assist you with this. Running locally on Jan means we can have detailed discussions without worrying about data privacy. Here's my analysis...",
];

const getMockResponse = (prompt: string): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            let responseContent = mockResponses[Math.floor(Math.random() * mockResponses.length)];
             if (prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('programming')) {
                responseContent = "I'd be happy to help with your coding question! Since I'm running locally through Jan, I can review code, suggest improvements, and help debug without any privacy concerns about your proprietary code. What specific programming challenge are you working on?";
            }
            resolve(responseContent);
        }, 1000 + Math.random() * 500);
    });
};

export const getAiResponse = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    return getMockResponse(prompt);
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: prompt,
    });
    
    return response.text;

  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    if (error instanceof Error) {
        return `Error from AI: ${error.message}. Falling back to mock response.`;
    }
    return "An unknown error occurred. Falling back to mock response.";
  }
};
