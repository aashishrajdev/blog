"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Footer from "./components/Footer";

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

export default function Home() {
  const { data: session } = useSession();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/category");
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }

  async function fetchArticles() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/article");
      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error(
          `Server returned HTML instead of JSON. Status: ${res.status}`
        );
      }
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch articles");
      }
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }

  function getCategoriesByIds(categoryIds: string | null) {
    if (!categoryIds) return [];
    try {
      const ids = JSON.parse(categoryIds);
      if (!Array.isArray(ids)) return [];
      return categories.filter((cat) => ids.includes(cat.id));
    } catch {
      return [];
    }
  }

  const filteredArticles = articles.filter((article) => {
    if (selectedCategory === "all") return true;
    if (!article.categoryIds) return false;
    try {
      const categoryIds = JSON.parse(article.categoryIds);
      return (
        Array.isArray(categoryIds) && categoryIds.includes(selectedCategory)
      );
    } catch {
      return false;
    }
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#fafafa",
      }}
    >
      <div className="main-container">
        {/* Recent Blog Posts Section */}
        <div className="recent-section">
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#1a1a1a",
              marginBottom: 32,
              letterSpacing: "-0.5px",
            }}
          >
            Recent blog posts
          </h2>

          {/* Featured Articles - Show first 3 */}
          <div className="recent-posts-grid">
            {filteredArticles.slice(0, 3).map((article) => {
              const articleCategories = getCategoriesByIds(
                article.categoryIds || null
              );
              return (
                <div
                  key={article.id}
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow:
                      "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    (window.location.href = `/article/${article.id}`)
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: "100%",
                      height: 200,
                      position: "relative",
                      overflow: "hidden",
                      background: article.coverImageUrl
                        ? "#f0f0f0"
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {article.coverImageUrl ? (
                      <img
                        src={article.coverImageUrl}
                        alt={article.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontSize: "48px",
                          fontWeight: "300",
                        }}
                      >
                        📝
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: 24 }}>
                    {/* Author and Date */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                        fontSize: 14,
                        color: "#6b7280",
                      }}
                    >
                      <span>
                        {article.authorName ||
                          article.authorEmail.split("@")[0]}
                      </span>
                      <span>
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: "#1a1a1a",
                        marginBottom: 12,
                        lineHeight: 1.3,
                        letterSpacing: "-0.3px",
                      }}
                    >
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: 16,
                        color: "#6b7280",
                        lineHeight: 1.5,
                        marginBottom: 16,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {article.description}
                    </p>

                    {/* Categories */}
                    {articleCategories && articleCategories.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        {articleCategories.slice(0, 3).map((category) => (
                          <span
                            key={category.id}
                            style={{
                              display: "inline-block",
                              padding: "4px 12px",
                              borderRadius: 16,
                              fontSize: 12,
                              fontWeight: 500,
                              color: "#fff",
                              background: category.color,
                            }}
                          >
                            {category.name}
                          </span>
                        ))}
                        {articleCategories.length > 3 && (
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 12px",
                              borderRadius: 16,
                              fontSize: 12,
                              fontWeight: 500,
                              color: "#6b7280",
                              background: "#f3f4f6",
                            }}
                          >
                            +{articleCategories.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All Blog Posts Section */}
        <div className="all-posts-section">
          <div className="section-header">
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#1a1a1a",
                letterSpacing: "-0.5px",
                margin: 0,
              }}
            >
              All blog posts
            </h2>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 500,
                border: "1px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.2s",
                background: showFilters ? "#0070f3" : "#fff",
                color: showFilters ? "#fff" : "#6b7280",
              }}
              onMouseEnter={(e) => {
                if (!showFilters) {
                  e.currentTarget.style.borderColor = "#0070f3";
                  e.currentTarget.style.color = "#0070f3";
                }
              }}
              onMouseLeave={(e) => {
                if (!showFilters) {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.color = "#6b7280";
                }
              }}
            >
              {showFilters ? "Hide Filters" : "Filter"}
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            {showFilters && (
              <div className="filter-buttons">
                <button
                  onClick={() => setSelectedCategory("all")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 500,
                    border: "1px solid #e5e7eb",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: selectedCategory === "all" ? "#0070f3" : "#fff",
                    color: selectedCategory === "all" ? "#fff" : "#6b7280",
                  }}
                >
                  All ({articles.length})
                </button>
                {categories.map((category) => {
                  const count = articles.filter((article) => {
                    if (!article.categoryIds) return false;
                    try {
                      const categoryIds = JSON.parse(article.categoryIds);
                      return (
                        Array.isArray(categoryIds) &&
                        categoryIds.includes(category.id)
                      );
                    } catch {
                      return false;
                    }
                  }).length;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 20,
                        fontSize: 14,
                        fontWeight: 500,
                        border: "1px solid #e5e7eb",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        background:
                          selectedCategory === category.id
                            ? category.color
                            : "#fff",
                        color:
                          selectedCategory === category.id ? "#fff" : "#6b7280",
                      }}
                    >
                      {category.name} ({count})
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div
              style={{
                color: "#6b7280",
                fontSize: 16,
                textAlign: "center",
                padding: "40px 0",
              }}
            >
              Loading articles...
            </div>
          )}
          {error && (
            <div
              style={{
                color: "#dc2626",
                textAlign: "center",
                padding: "40px 0",
              }}
            >
              {error}
            </div>
          )}

          {/* All Articles Grid */}
          {!loading && !error && (
            <div className="all-posts-grid">
              {filteredArticles.slice(3).length === 0 ? (
                <div
                  style={{
                    color: "#6b7280",
                    textAlign: "center",
                    gridColumn: "1 / -1",
                    padding: "40px 0",
                  }}
                >
                  {selectedCategory === "all"
                    ? "No more articles to show."
                    : "No articles in this category."}
                </div>
              ) : (
                filteredArticles.slice(3).map((article) => {
                  const articleCategories = getCategoriesByIds(
                    article.categoryIds || null
                  );
                  return (
                    <div
                      key={article.id}
                      style={{
                        background: "#fff",
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow:
                          "0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        (window.location.href = `/article/${article.id}`)
                      }
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
                      {/* Image */}
                      <div
                        style={{
                          width: "100%",
                          height: 160,
                          position: "relative",
                          overflow: "hidden",
                          background: article.coverImageUrl
                            ? "#f0f0f0"
                            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {article.coverImageUrl ? (
                          <img
                            src={article.coverImageUrl}
                            alt={article.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              color: "rgba(255, 255, 255, 0.8)",
                              fontSize: "32px",
                              fontWeight: "300",
                            }}
                          >
                            📝
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ padding: 20 }}>
                        {/* Author and Date */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 8,
                            fontSize: 13,
                            color: "#6b7280",
                          }}
                        >
                          <span>
                            {article.authorName ||
                              article.authorEmail.split("@")[0]}
                          </span>
                          <span>
                            {new Date(article.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: "#1a1a1a",
                            marginBottom: 8,
                            lineHeight: 1.3,
                            letterSpacing: "-0.3px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {article.title}
                        </h3>

                        {/* Description */}
                        <p
                          style={{
                            fontSize: 14,
                            color: "#6b7280",
                            lineHeight: 1.5,
                            marginBottom: 12,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {article.description}
                        </p>

                        {/* Categories */}
                        {articleCategories && articleCategories.length > 0 && (
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 6,
                            }}
                          >
                            {articleCategories.slice(0, 2).map((category) => (
                              <span
                                key={category.id}
                                style={{
                                  display: "inline-block",
                                  padding: "3px 8px",
                                  borderRadius: 12,
                                  fontSize: 11,
                                  fontWeight: 500,
                                  color: "#fff",
                                  background: category.color,
                                }}
                              >
                                {category.name}
                              </span>
                            ))}
                            {articleCategories.length > 2 && (
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "3px 8px",
                                  borderRadius: 12,
                                  fontSize: 11,
                                  fontWeight: 500,
                                  color: "#6b7280",
                                  background: "#f3f4f6",
                                }}
                              >
                                +{articleCategories.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
