import React from "react";
import Link from "next/link";
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
}: ArticleCardProps) {
  return (
    <a
      href={`/article/${id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "block",
      }}
    >
      <div
        className="glass-card"
        style={{
          overflow: "hidden",
          cursor: "pointer",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            paddingBottom: showActions ? "60%" : "75%", // Smaller for dashboard cards, larger for home page
            position: "relative",
            overflow: "hidden",
            background: coverImageUrl
              ? "#f0f0f0"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={title}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "48px",
                fontWeight: "300",
              }}
            >
              📝
            </div>
          )}
        </div>
        <div
          style={{
            padding: 20,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {categories && categories.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 12,
              }}
            >
              {categories.slice(0, 3).map((category) => (
                <div
                  key={category.id}
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#fff",
                    background: category.color,
                    boxShadow: `0 2px 8px ${category.color}40`,
                  }}
                >
                  {category.name}
                </div>
              ))}
              {categories.length > 3 && (
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#666",
                    background: "rgba(0, 0, 0, 0.1)",
                  }}
                >
                  +{categories.length - 3}
                </div>
              )}
            </div>
          )}
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#000",
              marginBottom: 8,
              lineHeight: 1.3,
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#666",
              marginBottom: 16,
              lineHeight: 1.6,
              flex: 1,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 13,
              color: "#999",
              marginTop: "auto",
            }}
          >
            <span>By {authorName || authorEmail.split("@")[0]}</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
          {showActions && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
                justifyContent: "center",
              }}
            >
              <Link
                href={`/article/${id}`}
                style={{
                  color: "#0070f3",
                  textDecoration: "underline",
                  fontSize: 14,
                }}
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
                style={{ fontSize: 12, padding: "4px 8px" }}
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
