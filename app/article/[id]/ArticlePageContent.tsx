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
  likes?: number;
  liked?: boolean;
  readingTimeMinutes?: number;
  wordCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName?: string | null;
  userEmail: string;
  content: string;
  likes?: number;
  liked?: boolean;
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
    // optimistic toggle
    setArticle((prev) =>
      prev
        ? {
            ...prev,
            liked: !prev.liked,
            likes: prev.liked
              ? Math.max(0, (prev.likes || 0) - 1)
              : (prev.likes || 0) + 1,
          }
        : prev
    );
    try {
      const res = await fetch("/api/article/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: article.id }),
      });
      if (!res.ok) throw new Error("Failed to like article");
      const data = await res.json();
      if (data?.id && typeof data?.likes === "number") {
        setArticle((prev) =>
          prev ? { ...prev, likes: data.likes, liked: !!data.liked } : prev
        );
      }
    } catch (err) {
      console.error("Error liking article:", err);
    }
  }

  async function handleLikeComment(commentId: string) {
    // optimistic toggle update
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              liked: !c.liked,
              likes: c.liked
                ? Math.max(0, (c.likes || 0) - 1)
                : (c.likes || 0) + 1,
            }
          : c
      )
    );
    try {
      const res = await fetch("/api/comment/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: commentId }),
      });
      if (!res.ok) throw new Error("Failed to like comment");
      const data = await res.json();
      if (data?.id && typeof data?.likes === "number") {
        setComments((prev) =>
          prev.map((c) =>
            c.id === data.id
              ? { ...c, likes: data.likes, liked: !!data.liked }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Error liking comment:", err);
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

  if (loading) {
    return (
      <div className="center-screen">
        <div className="loading-text">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="error-screen">
        <div className="error-message">{error || "Article not found"}</div>
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="article-page">
      <div className="article-container">
        {/* Back Button */}
        <Link
          href="/"
          className="back-link"
          style={{ marginBottom: 20, display: "inline-block" }}
        >
          ← Back to Articles
        </Link>

        {/* Article Content */}
        <div className="article-card">
          {article.coverImageUrl && (
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              width={800}
              height={400}
              className="article-cover"
            />
          )}
          <h1 className="article-title">{article.title}</h1>

          <div className="article-meta">
            <span className="meta-author">
              By{" "}
              <strong>
                {article.authorName || article.authorEmail.split("@")[0]}
              </strong>
            </span>
            <span className="meta-date">•</span>
            <span className="meta-date">
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {article.readingTimeMinutes ? (
                <span className="meta-date">
                  {" "}
                  • {article.readingTimeMinutes} min read
                </span>
              ) : null}
            </span>
            <div className="ml-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikeArticle();
                }}
                aria-label={"Like article"}
                className={`like-button ${article?.liked ? "liked" : ""}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18.01 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>{article.likes ?? 0}</span>
              </button>
            </div>
          </div>
          <div className="article-content">{article.content}</div>
        </div>

        {/* Comments Section */}
        <div className="comments-card">
          <h2 className="comments-title">Comments ({comments.length})</h2>

          {/* Comment Form */}
          {session ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                disabled={submitting}
                className="comment-textarea"
              />
              <Button type="submit" disabled={submitting || !newComment.trim()}>
                {submitting ? "Posting..." : "Post Comment"}
              </Button>
            </form>
          ) : (
            <div className="comment-info">
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
          <div className="comments-list">
            {comments.length === 0 ? (
              <p style={{ color: "#999", textAlign: "center", padding: 32 }}>
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-meta">
                    <div>
                      <strong className="comment-author">
                        {comment.userName || comment.userEmail.split("@")[0]}
                      </strong>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeComment(comment.id);
                        }}
                        aria-label={"Like comment"}
                        className={`like-button ${
                          comment.liked ? "liked" : ""
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-3.5 h-3.5"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 3.99 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18.01 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span>{comment.likes ?? 0}</span>
                      </button>

                      {session?.user?.email === comment.userEmail && (
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="btn-small"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="comment-body">{comment.content}</p>
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
