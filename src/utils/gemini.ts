import { GoogleGenAI, Type } from "@google/genai";
import type { AiSummary, Post } from "../types";

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateProfileSummary = async (
	posts: Post[],
): Promise<AiSummary | null> => {
	if (!ai) return null;

	const samplePosts = posts
		.slice(0, 150)
		.map((p) => `${p.date.toISOString().split("T")[0]}: ${p.content}`)
		.join("\n");
	console.log(samplePosts);

	console.log("Generating profile summary...");
	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: `You are a creative social media analyst specializing in stylish web aesthetics.

      Analyze the following social media posts from a user named "akazdayo".

      Generate a profile summary in JSON format with the following fields:
      - bio: A creative, slightly tech-savvy biography (2-3 sentences) in Japanese.
      - tags: A list of 5-7 short hashtags or keywords (without "#") representing their interests.
      - feel: A short, catchy phrase describing their overall "feel" in japanese.  (2-3 words and emojis)
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
					themeColor: { type: Type.STRING },
				},
			},
			temperature: 2.0,
		},
	});
	console.log("Successfully generated");

	if (response.text) {
		console.log("Successfully parsed response");
		const result = JSON.parse(response.text) as AiSummary;

		return result;
	}
	console.error("Failed to parse response");
	return null;
};
