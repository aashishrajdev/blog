import React from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "./Button";

interface ArticleCardProps {
  id: string;
  title: string;
  description: string;
  coverImageUrl?: string | null;
  categoryIds?: string | null;
  categories?: Array<{ id: string; name: string; color: string }>;
  authorName?: string | null;
  authorEmail: string;
  createdAt: Date;
  showActions?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
  likes?: number;
  liked?: boolean;
  onLike?: (id: string) => void;
}

export default function ArticleCard({
  id,
  title,
  description,
  coverImageUrl,
  categories = [],
  authorName,
  authorEmail,
  createdAt,
  // categoryIds (not used here)
  showActions = false,
  onDelete,
  isDeleting = false,
  likes,
  liked,
  onLike,
}: ArticleCardProps) {
  return (
    <a href={`/article/${id}`} className="block no-underline text-current">
      <div className="w-full h-full flex flex-col overflow-hidden cursor-pointer bg-white/75 backdrop-blur-md rounded-xl border border-white/40 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl">
        <div
          className={`relative w-full ${
            showActions ? "pb-[60%]" : "pb-[75%]"
          } flex items-center justify-center overflow-hidden`}
          style={{
            background: coverImageUrl
              ? undefined
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 text-5xl font-light">
              📝
            </div>
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.slice(0, 3).map((category) => (
                <div
                  key={category.id}
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{
                    background: category.color,
                    boxShadow: `0 2px 8px ${category.color}40`,
                  }}
                >
                  {category.name}
                </div>
              ))}
              {categories.length > 3 && (
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-gray-600 bg-black/10">
                  +{categories.length - 3}
                </div>
              )}
            </div>
          )}

          <h2 className="text-lg font-extrabold text-black mb-2 leading-tight">
            {title}
          </h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-1">
            {description}
          </p>

          <div className="flex justify-between items-center text-sm text-gray-400 mt-auto">
            <span>By {authorName || authorEmail.split("@")[0]}</span>
            <div className="flex items-center gap-3">
              <span>{new Date(createdAt).toLocaleDateString()}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onLike?.(id);
                }}
                className={`inline-flex items-center gap-2 hover:text-red-600 ${
                  liked ? "text-[#e0245e]" : "text-gray-500"
                }`}
                aria-label={`Like ${title}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18.01 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>{likes ?? 0}</span>
              </button>
            </div>
          </div>

          {showActions && (
            <div className="flex gap-2 mt-3 justify-center">
              <Link
                href={`/article/${id}`}
                className="text-blue-600 underline text-sm"
              >
                Read Article
              </Link>
              <Button
                variant="danger"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete?.();
                }}
                disabled={isDeleting}
                className="text-sm px-2 py-1"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
