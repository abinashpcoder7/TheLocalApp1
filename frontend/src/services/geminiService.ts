const BACKEND_URL = "http://localhost:8000";

const mockResponses = [
    "I understand you're asking about that. As your local AI assistant running on Cortex, I can help you explore this topic while keeping all our conversation private on your device.",
    "That's a great question! Since I'm running locally through Cortex, I can provide detailed assistance without any privacy concerns. Let me break this down for you...",
    "I'm happy to help with that. One of the benefits of using Cortex is that I can process your requests completely offline while maintaining your privacy. Here's what I think...",
];

const getMockResponse = (prompt: string): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            let responseContent = mockResponses[Math.floor(Math.random() * mockResponses.length)];
             if (prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('programming')) {
                responseContent = "I'd be happy to help with your coding question! What specific programming challenge are you working on?";
            }
            resolve(responseContent);
        }, 1000);
    });
};

export const getAiResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response;

  } catch (error) {
    console.error("Could not fetch AI response from backend:", error);
    console.warn("This might be because the backend server is not running. Please run 'cd backend && uvicorn main:app --reload'. Falling back to mock response.");
    return getMockResponse(prompt);
  }
};

export const getChatTitle = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/generate-title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
        return prompt.slice(0, 40);
    }
    const data = await response.json();
    return data.title || prompt.slice(0, 40);
  } catch (error) {
    console.error("Could not generate title from backend:", error);
    return prompt.slice(0, 40);
  }
};