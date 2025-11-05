"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../../components/Button";
import Footer from "../../components/Footer";

interface Article {
  id: string;
  title: string;
  content: string;
  description: string;
  coverImageUrl?: string | null;
  authorId: string;
  authorName?: string | null;
  authorEmail: string;
  createdAt: Date;
  updatedAt: Date;
  likes?: number;
}

interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName?: string | null;
  userEmail: string;
  content: string;
  createdAt: Date;
}

export default function ArticlePageContent({ id }: { id: string }) {
  const { data: session } = useSession();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchArticle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/article");
      if (!res.ok) throw new Error("Failed to fetch article");

      const data = await res.json();
      const foundArticle = Array.isArray(data)
        ? data.find((a: Article) => a.id === id)
        : null;

      if (!foundArticle) {
        setError("Article not found");
      } else {
        setArticle(foundArticle);
      }
    } catch (err) {
      console.error("Error fetching article:", err);
      setError("Failed to load article");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comment?articleId=${id}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchArticle();
      fetchComments();
    }
  }, [id, fetchArticle, fetchComments]);

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !session) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: id,
          content: newComment.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      setNewComment("");
      await fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLikeArticle() {
    if (!article) return;
    try {
      const res = await fetch("/api/article/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: article.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setArticle((a) =>
          a ? { ...a, likes: Number(data?.likes ?? (a.likes || 0) + 1) } : a
        );
      } else {
        setArticle((a) => (a ? { ...a, likes: (a.likes || 0) + 1 } : a));
      }
    } catch (err) {
      console.error("Failed to like article", err);
      setArticle((a) => (a ? { ...a, likes: (a.likes || 0) + 1 } : a));
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(`/api/comment?id=${commentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete comment");

      await fetchComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment. Please try again.");
    }
  }

  async function handleLikeComment(commentId: string) {
    try {
      const res = await fetch("/api/comment/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: commentId }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? { ...c, likes: Number(data?.likes ?? (c.likes || 0) + 1) }
              : c
          )
        );
      } else {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
          )
        );
      }
    } catch (err) {
      console.error("Error liking comment:", err);
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
        )
      );
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <div style={{ color: "#666", fontSize: 18 }}>Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          padding: "20px",
        }}
      >
        <div style={{ color: "#e74c3c", fontSize: 18, marginBottom: 20 }}>
          {error || "Article not found"}
        </div>
        <Link
          href="/"
          style={{
            color: "#0070f3",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Back Button */}
        <Link
          href="/"
          style={{
            color: "#555",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 20,
            display: "inline-block",
          }}
        >
          ← Back to Articles
        </Link>

        {/* Article Content */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderRadius: 16,
            padding: "40px",
            marginTop: 20,
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          {article.coverImageUrl && (
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              width={800}
              height={400}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: 400,
                objectFit: "cover",
                borderRadius: 12,
                marginBottom: 32,
                border: "1px solid rgba(0, 0, 0, 0.05)",
              }}
            />
          )}

          <h1
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "#000",
              marginBottom: 16,
              lineHeight: 1.2,
            }}
          >
            {article.title}
          </h1>

          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              marginBottom: 32,
              paddingBottom: 24,
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            }}
          >
            <span style={{ color: "#666", fontSize: 14 }}>
              By{" "}
              <strong>
                {article.authorName || article.authorEmail.split("@")[0]}
              </strong>
            </span>
            <span style={{ color: "#999" }}>•</span>
            <span style={{ color: "#666", fontSize: 14 }}>
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div
            style={{
              fontSize: 18,
              lineHeight: 1.8,
              color: "#333",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {article.content}
          </div>
        </div>

        {/* Comments Section */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderRadius: 16,
            padding: "32px",
            marginTop: 32,
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#000",
              marginBottom: 24,
            }}
          >
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          {session ? (
            <form onSubmit={handleSubmitComment} style={{ marginBottom: 32 }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                disabled={submitting}
                style={{
                  width: "100%",
                  minHeight: 100,
                  padding: "16px",
                  borderRadius: 12,
                  border: "1px solid rgba(0, 112, 243, 0.2)",
                  fontSize: 16,
                  fontFamily: "inherit",
                  resize: "vertical",
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                  marginBottom: 12,
                }}
              />
              <Button type="submit" disabled={submitting || !newComment.trim()}>
                {submitting ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          ) : (
            <div
              style={{
                padding: "20px",
                background: "rgba(0, 112, 243, 0.05)",
                borderRadius: 12,
                marginBottom: 32,
                textAlign: "center",
              }}
            >
              <p style={{ color: "#666", margin: 0 }}>
                <Link
                  href="/login"
                  style={{
                    color: "#0070f3",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Login
                </Link>{" "}
                to leave a comment
              </p>
            </div>
          )}

          {/* Comments List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {comments.length === 0 ? (
              <p style={{ color: "#999", textAlign: "center", padding: 32 }}>
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 12,
                    padding: "16px",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <div>
                      <strong style={{ color: "#000", fontSize: 14 }}>
                        {comment.userName || comment.userEmail.split("@")[0]}
                      </strong>
                      <span
                        style={{
                          color: "#999",
                          fontSize: 13,
                          marginLeft: 8,
                        }}
                      >
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {session?.user?.email === comment.userEmail && (
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{ fontSize: 13, padding: "4px 12px" }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                  <p
                    style={{
                      color: "#333",
                      margin: 0,
                      fontSize: 15,
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
