import { nip19 } from "nostr-tools";
import { createRxBackwardReq, createRxNostr, uniq } from "rx-nostr";
import { verifier } from "rx-nostr-crypto";
import { firstValueFrom, toArray } from "rxjs";
import type { Post } from "../types";

// Use ws package only in Node.js environment
const getWebSocketImpl = async () => {
	if (typeof globalThis.WebSocket !== "undefined") {
		return globalThis.WebSocket;
	}
	const ws = await import("ws");
	return ws.default;
};

export async function fetchKind1Posts(
	npub: string,
	relays: string[],
): Promise<Post[]> {
	const WebSocketImpl = await getWebSocketImpl();
	const rxNostr = createRxNostr({
		verifier,
		websocketCtor: WebSocketImpl as unknown as typeof WebSocket,
	});

	const { type, data: pubkey } = nip19.decode(npub);
	if (type !== "npub") {
		throw new Error("Invalid npub format");
	}

	rxNostr.setDefaultRelays(relays);

	const rxReq = createRxBackwardReq();

	try {
		const eventsPromise = firstValueFrom(
			rxNostr.use(rxReq).pipe(uniq(), toArray()),
		);

		rxReq.emit({
			kinds: [1],
			authors: [pubkey],
			since: Math.floor(Date.now() / 1000) - 86400 * 7,
			until: Math.floor(Date.now() / 1000),
		});
		rxReq.over();

		const packets = await eventsPromise;
		const events = packets.map((packet) => packet.event);

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
		rxNostr.dispose();
	}
}

export async function fetchProfilePicture(
	npub: string,
	relays: string[],
): Promise<string | null> {
	const WebSocketImpl = await getWebSocketImpl();
	const rxNostr = createRxNostr({
		verifier,
		websocketCtor: WebSocketImpl as unknown as typeof WebSocket,
	});

	const { type, data: pubkey } = nip19.decode(npub);
	if (type !== "npub") {
		throw new Error("Invalid npub format");
	}

	rxNostr.setDefaultRelays(relays);

	const rxReq = createRxBackwardReq();

	try {
		const eventsPromise = firstValueFrom(
			rxNostr.use(rxReq).pipe(uniq(), toArray()),
		);

		rxReq.emit({
			kinds: [0],
			authors: [pubkey],
			limit: 1,
		});
		rxReq.over();

		const packets = await eventsPromise;
		const events = packets.map((packet) => packet.event);

		console.log(`\nFetched ${events.length} profile pictures`);

		const rawProfile = events[0]?.content;
		if (!rawProfile) return null;
		const profile = JSON.parse(rawProfile);
		const profilePicture = profile.picture;

		return profilePicture;
	} finally {
		rxNostr.dispose();
	}
}
