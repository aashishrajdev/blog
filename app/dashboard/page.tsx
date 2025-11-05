"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import FileUpload from "../components/fileUpload";
import Button from "../components/Button";
import Footer from "../components/Footer";
import ArticleCard from "../components/ArticleCard";

interface FileUploadResponse {
  url?: string;
  fileId?: string;
  name?: string;
  size?: number;
  filePath?: string;
  thumbnailUrl?: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
  description: string;
  coverImageUrl?: string | null;
  categoryIds?: string | null;
  authorId: string;
  authorName?: string | null;
  authorEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  color: string;
  isPredefined: string;
  createdById?: string | null;
  createdAt: Date;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [deletingArticle, setDeletingArticle] = useState<string | null>(null);

  // Category creation state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#0070f3");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const fetchUserArticles = useCallback(async () => {
    if (!session?.user?.email) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/article");
      if (!res.ok) {
        throw new Error("Failed to fetch articles");
      }
      const data = await res.json();
      // Filter to show only user's articles
      const userArticles = Array.isArray(data)
        ? data.filter(
            (article: Article) => article.authorEmail === session.user?.email
          )
        : [];
      setArticles(userArticles);
    } catch (err: unknown) {
      let message = "Could not load your articles.";
      if (err instanceof Error) message = err.message;
      setError(message);
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/category");
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCategory(true);
    setError(null);
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName,
          color: newCategoryColor,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create category");
      }

      setSuccess("Category created successfully!");
      setNewCategoryName("");
      setNewCategoryColor("#0070f3");
      setShowCategoryForm(false);
      fetchCategories();
    } catch (err: unknown) {
      let message = "Failed to create category";
      if (err instanceof Error) message = err.message;
      setError(message);
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this article? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingArticle(articleId);
    try {
      const res = await fetch(`/api/article?id=${articleId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete article");
      }

      setSuccess("Article deleted successfully!");
      fetchUserArticles(); // Refresh the article list
    } catch (err: unknown) {
      let message = "Failed to delete article";
      if (err instanceof Error) message = err.message;
      setError(message);
    } finally {
      setDeletingArticle(null);
    }
  };

  useEffect(() => {
    fetchUserArticles();
    fetchCategories();
  }, [fetchUserArticles, fetchCategories]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session)
    return (
      <div>
        Access denied. Please <Link href="/login">login</Link> to create
        articles.
      </div>
    );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.email) {
      setError("You must be logged in to create articles");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          content,
          coverImageUrl: coverImageUrl || null,
          categoryIds:
            selectedCategoryIds.length > 0
              ? JSON.stringify(selectedCategoryIds)
              : null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create article");
      }

      setSuccess("Article created successfully!");
      setTitle("");
      setDescription("");
      setContent("");
      setCoverImageUrl("");
      setSelectedCategoryIds([]);
      setShowUploadForm(false);
      fetchUserArticles(); // Refresh the article list
    } catch (err: unknown) {
      let message = "Failed to create article";
      if (err instanceof Error) message = err.message;
      setError(message);
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          textAlign: "center",
          marginTop: 20,
          paddingBottom: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 40px",
            marginBottom: 20,
          }}
        >
          <h1>
            <span style={{ color: "#0070f3", fontWeight: 800 }}>Blog</span>{" "}
            Dashboard
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span>
              Welcome, {session.user?.name || session.user?.email || "User"}!
            </span>
            <Link
              href="/"
              style={{ color: "#0070f3", textDecoration: "underline" }}
            >
              View All Articles
            </Link>
            <Link
              href="/profile"
              style={{ color: "#0070f3", textDecoration: "underline" }}
            >
              Profile
            </Link>
            <Button
              variant="danger"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </Button>
          </div>
        </div>

        <div style={{ margin: "32px 0" }}>
          <Button onClick={() => setShowUploadForm((prev) => !prev)}>
            {showUploadForm ? "Cancel" : "Create New Article"}
          </Button>
        </div>

        {showUploadForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              margin: "32px auto",
              maxWidth: 500,
              background: "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              padding: 32,
              borderRadius: 16,
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              textAlign: "left",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                color: "#000",
                marginBottom: 24,
                fontWeight: 700,
              }}
            >
              Create Article
            </h2>
            <label
              style={{ color: "#000", display: "block", marginBottom: 16 }}
            >
              Title:
              <br />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter article title"
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid rgba(0, 112, 243, 0.2)",
                  color: "#000",
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                  fontSize: 14,
                }}
              />
            </label>
            <label
              style={{ color: "#000", display: "block", marginBottom: 16 }}
            >
              Description (short summary):
              <br />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Brief description of the article"
                rows={2}
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid rgba(0, 112, 243, 0.2)",
                  color: "#000",
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                  fontSize: 14,
                  resize: "vertical",
                }}
              />
            </label>
            <label
              style={{ color: "#000", display: "block", marginBottom: 16 }}
            >
              Content:
              <br />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Write your article content here..."
                rows={10}
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid rgba(0, 112, 243, 0.2)",
                  color: "#000",
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                  fontSize: 14,
                  resize: "vertical",
                }}
              />
            </label>
            <label
              style={{ color: "#000", display: "block", marginBottom: 16 }}
            >
              Categories (optional - select multiple):
              <br />
              <div
                className="glass-effect"
                style={{
                  marginTop: 8,
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid rgba(0, 112, 243, 0.2)",
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {categories.length === 0 ? (
                  <div style={{ color: "#666", fontSize: 14 }}>
                    No categories available. Create one below.
                  </div>
                ) : (
                  categories.map((cat) => {
                    const isSelected = selectedCategoryIds.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "6px 0",
                          cursor: "pointer",
                          color: "#000",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCategoryIds([
                                ...selectedCategoryIds,
                                cat.id,
                              ]);
                            } else {
                              setSelectedCategoryIds(
                                selectedCategoryIds.filter(
                                  (id) => id !== cat.id
                                )
                              );
                            }
                          }}
                          style={{
                            marginRight: 8,
                            accentColor: cat.color,
                          }}
                        />
                        <span
                          style={{
                            backgroundColor: cat.color,
                            color: "#fff",
                            padding: "2px 8px",
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 600,
                            marginRight: 8,
                          }}
                        >
                          {cat.name}
                        </span>
                        <span style={{ fontSize: 12, color: "#666" }}>
                          {cat.isPredefined === "true"
                            ? "Predefined"
                            : "Custom"}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                style={{ marginTop: 8, fontSize: 12 }}
              >
                {showCategoryForm ? "Cancel" : "+ Create New Category"}
              </Button>
            </label>

            {showCategoryForm && (
              <div
                className="glass-effect"
                style={{
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 16,
                  border: "1px solid rgba(123, 40, 202, 0.3)",
                }}
              >
                <h3
                  style={{
                    color: "#000",
                    marginBottom: 12,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  Create New Category
                </h3>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: "#000", fontSize: 14 }}>
                    Category Name:
                    <br />
                    <input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g., Photography"
                      style={{
                        width: "100%",
                        marginTop: 4,
                        padding: 10,
                        borderRadius: 6,
                        border: "1px solid rgba(0, 112, 243, 0.2)",
                        color: "#000",
                        background: "rgba(255, 255, 255, 0.5)",
                        backdropFilter: "blur(10px)",
                        fontSize: 14,
                      }}
                    />
                  </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ color: "#000", fontSize: 14 }}>
                    Color:
                    <br />
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <input
                        type="color"
                        value={newCategoryColor}
                        onChange={(e) => setNewCategoryColor(e.target.value)}
                        style={{
                          width: 60,
                          height: 40,
                          border: "1px solid rgba(0, 112, 243, 0.2)",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      />
                      <input
                        type="text"
                        value={newCategoryColor}
                        onChange={(e) => setNewCategoryColor(e.target.value)}
                        placeholder="#0070f3"
                        style={{
                          flex: 1,
                          padding: 10,
                          borderRadius: 6,
                          border: "1px solid rgba(0, 112, 243, 0.2)",
                          color: "#000",
                          background: "rgba(255, 255, 255, 0.5)",
                          backdropFilter: "blur(10px)",
                          fontSize: 14,
                        }}
                      />
                    </div>
                  </label>
                </div>
                <Button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory || !newCategoryName}
                  style={{ width: "100%" }}
                >
                  {creatingCategory ? "Creating..." : "Create Category"}
                </Button>
              </div>
            )}

            <label
              style={{ color: "#000", display: "block", marginBottom: 16 }}
            >
              Cover Image:
              <br />
              <FileUpload
                fileType="image"
                onSuccess={(res: FileUploadResponse) =>
                  res.url && setCoverImageUrl(res.url)
                }
              />
            </label>
            <Button
              type="submit"
              disabled={uploading || !title || !content}
              style={{ marginTop: 16, width: "100%" }}
            >
              {uploading ? "Publishing..." : "Publish Article"}
            </Button>
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
            {success && (
              <div style={{ color: "green", marginTop: 8 }}>
                {success}{" "}
                <Link href="/" style={{ color: "#0070f3" }}>
                  View all articles
                </Link>
              </div>
            )}
          </form>
        )}

        <div style={{ marginTop: 48 }}>
          <h2 style={{ color: "#000" }}>Your Articles</h2>
          {loading && <div>Loading your articles...</div>}
          {error && <div style={{ color: "red" }}>{error}</div>}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
              marginTop: 24,
            }}
          >
            {articles.length === 0 && !loading && (
              <div
                style={{
                  color: "#666",
                  padding: "20px",
                  background: "#f5f5f5",
                  borderRadius: 8,
                  maxWidth: 400,
                  gridColumn: "1 / -1",
                  justifySelf: "center",
                }}
              >
                You haven&apos;t created any articles yet. Click the
                &quot;Create New Article&quot; button to get started!
              </div>
            )}
            {articles.map((article) => (
              <div
                key={article.id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow:
                    "0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  height: "fit-content",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)";
                }}
              >
                <ArticleCard
                  id={article.id}
                  title={article.title}
                  description={article.description}
                  coverImageUrl={article.coverImageUrl}
                  categoryIds={article.categoryIds}
                  categories={categories}
                  authorName={article.authorName}
                  authorEmail={article.authorEmail}
                  createdAt={article.createdAt}
                  showActions={true}
                  onDelete={() => handleDeleteArticle(article.id)}
                  isDeleting={deletingArticle === article.id}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
