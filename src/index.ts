export interface Env {
	ACCOUNT_ID: string;
	PROJECT_NAME: string;
	CF_API_TOKEN: string;
}

export default {
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
		const { ACCOUNT_ID, PROJECT_NAME, CF_API_TOKEN } = env;

		const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}/deployments`;

		const res = await fetch(apiUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${CF_API_TOKEN}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		});

		if (!res.ok) {
			const errText = await res.text();
			console.error("Failed to trigger Pages build:", res.status, errText);
			return;
		}

		const data = await res.json();
		console.log("Pages build triggered successfully:", data);
	},
};
