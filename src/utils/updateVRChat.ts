import axios from "axios";

const URL = `https://vrchat.com/api/1/users/${process.env.VRCHAT_USER_ID}`;

const client = axios.create({
	headers: {
		"User-Agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
		"Content-Type": "application/json",
		Cookie: `auth=${process.env.VRCHAT_AUTH}; twoFactorAuth=${process.env.VRCHAT_TWO_FACTOR_AUTH}`,
	},
});

export const updateVRChatProfile = async (bio: string) => {
	const rawProfile = (await client.get(URL)).data;

	const data = {
		status: rawProfile.status,
		statusDescription: rawProfile.statusDescription,
		bio: `2024/2/28に始めました！\n\n# Todays Gemini Analysis\n${bio}`,
		bioLinks: rawProfile.bioLinks,
		pronouns: rawProfile.pronouns,
	};

	const response = await client.put(URL, data);
	console.log(`response status: ${response.status}`);
};
