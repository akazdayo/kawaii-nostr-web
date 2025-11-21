import type React from "react";
import type { Post } from "../types";

interface PostCardProps {
	post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
	// Helper to linkify URLs
	const formatContent = (text: string) => {
		const urlRegex = /(https?:\/\/[^\s]+)/g;
		const parts = text.split(urlRegex);
		return parts.map((part, index) => {
			if (part.match(urlRegex)) {
				return (
					<a
						key={index}
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
			return <span key={index}>{part}</span>;
		});
	};

	const dateStr = new Intl.DateTimeFormat("ja-JP", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(post.date);

	return (
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
	);
};

export default PostCard;
