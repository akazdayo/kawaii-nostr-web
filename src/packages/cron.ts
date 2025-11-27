import { generateProfileSummary } from "@/utils/gemini";
import { fetchKind1Posts } from "@/utils/nostr";
import { updateVRChatProfile } from "@/utils/updateVRChat";

const npub = "npub1r0hvae2ld84u9zgyqdsx7294ar4m4v3ayfnnpcftf0mk955ay93qejel3w";
const relays = ["wss://yabu.me", "wss://relay.damus.io"];

const posts = await fetchKind1Posts(npub, relays);
const summary = await generateProfileSummary(posts);
await updateVRChatProfile(
	`${summary.bio}\nCurrent feel: ${summary.vibe}\nTags: ${summary.tags.map((x) => `#${x}`).join(" ")}`,
);
