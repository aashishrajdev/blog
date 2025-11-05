"use client";
import React, { useState } from "react";
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
  categoryIds,
  showActions = false,
  onDelete,
  isDeleting = false,
  likes = 0,
}: ArticleCardProps) {
  const [likeCount, setLikeCount] = useState<number>(Number(likes || 0));
  const [liking, setLiking] = useState(false);

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (liking) return;
    setLiking(true);
    try {
      const res = await fetch("/api/article/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const data = await res.json();
        setLikeCount(Number(data?.likes ?? likeCount + 1));
      } else {
        // optimistic fallback
        setLikeCount((c) => c + 1);
      }
    } catch (err) {
      console.error("Like failed", err);
      setLikeCount((c) => c + 1);
    } finally {
      setLiking(false);
    }
  }
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
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button
                onClick={handleLike}
                className="inline-flex items-center gap-2 text-red-500 hover:opacity-80"
                aria-label="Like article"
              >
                <span className="text-lg">❤️</span>
                <span>{likeCount}</span>
              </button>
            </div>

            {showActions && (
              <div className="flex gap-2">
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
      </div>
    </a>
  );
}
