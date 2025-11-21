import { nip19, SimplePool } from "nostr-tools";
import type { Post } from "../types";

export async function fetchKind1Posts(
	npub: string,
	relays: string[],
): Promise<Post[]> {
	const pool = new SimplePool();

	const { type, data: pubkey } = nip19.decode(npub);
	if (type !== "npub") {
		throw new Error("Invalid npub format");
	}

	try {
		const events = await pool.querySync(relays, {
			kinds: [1],
			authors: [pubkey],
			since: Math.floor(Date.now() / 1000) - 86400 * 7,
			until: Math.floor(Date.now() / 1000),
		});

		console.log(`\nFetched ${events.length} posts`);
		if (events.length === 0) {
			console.log("No posts found");
			throw new Error("No posts found");
		}

		const posts: Post[] = events.map((event) => {
			const date = new Date(event.created_at * 1000);
			return {
				content: event.content,
				timestamp: date.toISOString(),
				date: date,
			};
		});

		posts.sort((a, b) => b.date.getTime() - a.date.getTime());

		return posts;
	} finally {
		pool.close(relays);
	}
}

export async function fetchProfilePicture(
	npub: string,
	relays: string[],
): Promise<string | null> {
	const pool = new SimplePool();

	const { type, data: pubkey } = nip19.decode(npub);
	if (type !== "npub") {
		throw new Error("Invalid npub format");
	}

	try {
		const events = await pool.querySync(relays, {
			kinds: [0],
			authors: [pubkey],
			limit: 1,
		});

		console.log(`\nFetched ${events.length} profile pictures`);

		const rawProfile = events[0]?.content;
		if (!rawProfile) return null;
		const profile = JSON.parse(rawProfile);
		const profilePicture = profile.picture;

		return profilePicture;
	} finally {
		pool.close(relays);
	}
}
