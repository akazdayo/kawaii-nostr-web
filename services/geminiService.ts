import { GoogleGenAI, Type } from "@google/genai";
import { Post, AiSummary } from "../types";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateProfileSummary = async (posts: Post[]): Promise<AiSummary | null> => {
  if (!ai) return null;

  // Use a reasonable sample size to get the vibe without overloading context needlessly, 
  // though 2.5 Flash handles large context well.
  // Let's send the last 100 posts for a good "recent" vibe check.
  const samplePosts = posts.slice(0, 150).map(p => `${p.date.toISOString().split('T')[0]}: ${p.content}`).join("\n");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a creative social media analyst specializing in "Kawaii" (cute) and stylish web aesthetics.
      
      Analyze the following social media posts from a user named "akazdayo".
      
      Generate a profile summary in JSON format with the following fields:
      - bio: A creative, cute, and slightly tech-savvy biography (2-3 sentences) in Japanese.
      - tags: A list of 5-7 short hashtags or keywords representing their interests (e.g., "Rust", "VRChat", "Nostr", "Cats").
      - vibe: A short, catchy phrase describing their overall "vibe" (e.g., "Cyber Kawaii Hacker 🐱💻").
      - themeColor: A hex color code that matches their vibe (pastel or vibrant).

      Posts:
      ${samplePosts}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bio: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            vibe: { type: Type.STRING },
            themeColor: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AiSummary;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
