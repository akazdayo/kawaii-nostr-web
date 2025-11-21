import { useEffect, useState } from "react";
import { fetchKind1Posts } from "@/utils/nostr";
import type { Post } from "../types";
import Stats from "./Stats";

const DynamicContent: React.FC = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const posts = await fetchKind1Posts(
					"npub1r0hvae2ld84u9zgyqdsx7294ar4m4v3ayfnnpcftf0mk955ay93qejel3w",
					["wss://yabu.me", "wss://relay.damus.io"],
				);
				setPosts(posts);
			} catch (error) {
				console.error("Failed to fetch CSV:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Helper to linkify URLs
	const formatContent = (text: string) => {
		const urlRegex = /(https?:\/\/[^\s]+)/g;
		const parts = text.split(urlRegex);
		return parts.map((part, index) => {
			const key = `${index}-${part.slice(0, 20)}`;
			if (part.match(urlRegex)) {
				return (
					<a
						key={key}
						href={part}
						target="_blank"
						rel="noopener noreferrer"
						className="text-kawaii-rose hover:text-pink-600 font-bold underline decoration-wavy decoration-1 underline-offset-2 break-all transition-colors"
						onClick={(e) => e.stopPropagation()}
					>
						link ↗
					</a>
				);
			}
			return <span key={key}>{part}</span>;
		});
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-16 space-x-3">
				<div className="w-3 h-3 bg-kawaii-pink rounded-full animate-bounce"></div>
				<div className="w-3 h-3 bg-kawaii-purple rounded-full animate-bounce delay-100"></div>
				<div className="w-3 h-3 bg-kawaii-blue rounded-full animate-bounce delay-200"></div>
				<span className="text-gray-400 font-bold">Loading posts...</span>
			</div>
		);
	}

	return (
		<>
			{/* Dashboard Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
				{/* Stat Card */}
				<div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform">
					<span className="text-4xl mb-2">📝</span>
					<span className="text-5xl font-black text-gray-700 mb-1">
						{posts.length}
					</span>
					<span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
						Last 7 Days Posts
					</span>
				</div>

				{/* Stats Chart */}
				<div className="md:col-span-2">
					<Stats posts={posts} />
				</div>
			</div>

			{/* Timeline */}
			<section>
				<div className="flex items-center gap-4 mb-8">
					<h2 className="text-3xl font-bold text-gray-700">Timeline</h2>
					<div className="h-1 flex-grow bg-gradient-to-r from-kawaii-pink to-transparent rounded-full"></div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{posts.map((post) => {
						const dateStr = new Intl.DateTimeFormat("ja-JP", {
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						}).format(post.date);

						return (
							<div key={`${post.timestamp}-${post.content.slice(0, 50)}`}>
								<div className="glass-panel p-5 rounded-3xl hover:scale-[1.02] transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
									<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-kawaii-blue via-kawaii-purple to-kawaii-pink opacity-0 group-hover:opacity-100 transition-opacity"></div>

									{/* Content */}
									<div className="flex-grow mb-3">
										<p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">
											{formatContent(post.content.replace(/^"|"$/g, ""))}
										</p>
									</div>

									{/* Footer */}
									<div className="flex justify-between items-end pt-2 border-t border-white/50">
										<span className="text-xs text-gray-400 font-bold bg-white/50 px-2 py-1 rounded-full">
											{dateStr}
										</span>
										<div className="flex space-x-1">
											<span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
												✨
											</span>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</section>
		</>
	);
};

export default DynamicContent;
