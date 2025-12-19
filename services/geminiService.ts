import { GoogleGenAI, Type } from "@google/genai";
import { AspectRatio, ImageSize, NotificationData, ChatMessage } from "../types";

// Helper: Convert URL or Base64 to a format Gemini accepts (inlineData)
async function imageToPart(urlOrBase64: string) {
    try {
        let base64Data = "";
        let mimeType = "image/png";

        if (urlOrBase64.startsWith("data:")) {
            const matches = urlOrBase64.match(/^data:(.+);base64,(.+)$/);
            if (matches) {
                mimeType = matches[1];
                base64Data = matches[2];
            }
        } else {
            const response = await fetch(urlOrBase64);
            const blob = await response.blob();
            mimeType = blob.type;
            const buffer = await blob.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            base64Data = btoa(binary);
        }

        return {
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        };
    } catch (e) {
        console.warn("Failed to process image for analysis:", e);
        return null;
    }
}

// Standard Generation
export const generateWallpaper = async (
  prompt: string,
  aspectRatio: AspectRatio,
  imageSize: ImageSize
): Promise<string> => {
  // Always create new instance right before use to catch the latest injected API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
  
  const fullPrompt = `
    Create a realistic, candid smartphone photo. 
    Aesthetic: Flash photography, lo-fi, slightly grainy, authentic, aesthetic vibe.
    Subject: ${prompt || "A candid aesthetic photo, messy room or street scene"}.
    Style: Visible texture, natural lighting or harsh flash, unpolished authentic vibe.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from Gemini");
  } catch (error) {
    console.error("Error generating wallpaper:", error);
    throw error;
  }
};

export const generateProfileIcon = async (name: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { 
                parts: [{ text: `A candid profile picture icon of ${name}, aesthetic, flash photography, lo-fi, highly detailed.` }] 
            },
            config: {
                imageConfig: { aspectRatio: "1:1" }
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image data returned");
    } catch (error) {
        console.error("Error generating icon:", error);
        throw error;
    }
}

export const sendChatMessage = async (
    previousHistory: ChatMessage[], 
    newMessage: string, 
    newImage?: string
) => {
    // Using Gemini 3 Flash for the best free-tier performance
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
    
    const historyParts = await Promise.all(previousHistory.map(async (msg) => {
        const parts: any[] = [{ text: msg.text }];
        if (msg.image) {
            const imgPart = await imageToPart(msg.image);
            if (imgPart) parts.push(imgPart);
        }
        return {
            role: msg.role,
            parts: parts
        };
    }));

    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        history: historyParts,
        config: {
            systemInstruction: "You are a helpful aesthetic assistant. Help the user come up with ideas for their lock screen. If the user sends an image, analyze it for aesthetic details. Keep responses concise and inspiring."
        }
    });

    const msgParts: any[] = [{ text: newMessage }];
    if (newImage) {
        const imgPart = await imageToPart(newImage);
        if (imgPart) msgParts.push(imgPart);
    }

    const result = await chat.sendMessage({ message: msgParts });
    return result.text;
};