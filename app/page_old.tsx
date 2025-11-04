"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ArticleCard from "./components/ArticleCard";
import Footer from "./components/Footer";
import PageContainer from "./components/PageContainer";

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
        const errorData = await res
          .json()
          .catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(
          errorData.error || `Failed to fetch articles (${res.status})`
        );
      }
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      let message = "Could not load articles.";
      if (err instanceof Error) message = err.message;
      console.error("Error fetching articles:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((article) => {
          if (!article.categoryIds) return false;
          try {
            const categoryIds = JSON.parse(article.categoryIds);
            return (
              Array.isArray(categoryIds) &&
              categoryIds.includes(selectedCategory)
            );
          } catch {
            return false;
          }
        });

  const getCategoriesByIds = (categoryIds: string | null) => {
    if (!categoryIds) return [];
    try {
      const ids = JSON.parse(categoryIds);
      if (!Array.isArray(ids)) return [];
      return categories.filter((cat) => ids.includes(cat.id));
    } catch {
      return [];
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div
        style={{
          flex: 1,
          textAlign: "center",
          marginTop: 40,
          paddingBottom: 30,
        }}
      >
        <h2
          style={{
            marginTop: 32,
            color: "#000",
            fontSize: 32,
            fontWeight: 700,
            background: "linear-gradient(135deg, #0070f3, #00c6ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Latest Articles
        </h2>

        {/* Filter Toggle Button */}
        <div style={{ marginTop: 24, marginBottom: 16 }}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              padding: "12px 24px",
              borderRadius: 25,
              fontSize: 16,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              margin: "0 auto",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(102, 126, 234, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(102, 126, 234, 0.4)";
            }}
          >
            🔍 {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 24,
              padding: "0 20px",
              animation: "fadeIn 0.3s ease-in-out",
            }}
          >
            <button
              onClick={() => setSelectedCategory("all")}
              className={selectedCategory === "all" ? "glass-button" : ""}
              style={{
                padding: "8px 20px",
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                background:
                  selectedCategory === "all"
                    ? "linear-gradient(135deg, #0070f3, #00c6ff)"
                    : "rgba(255, 255, 255, 0.7)",
                color: selectedCategory === "all" ? "#fff" : "#666",
                backdropFilter: "blur(10px)",
                boxShadow:
                  selectedCategory === "all"
                    ? "0 4px 12px rgba(0, 112, 243, 0.4)"
                    : "0 2px 8px rgba(0, 0, 0, 0.1)",
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
                  className={
                    selectedCategory === category.id ? "glass-button" : ""
                  }
                  style={{
                    padding: "8px 20px",
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    background:
                      selectedCategory === category.id
                        ? category.color
                        : "rgba(255, 255, 255, 0.7)",
                    color: selectedCategory === category.id ? "#fff" : "#666",
                    backdropFilter: "blur(10px)",
                    boxShadow:
                      selectedCategory === category.id
                        ? `0 4px 12px ${category.color}60`
                        : "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {category.name} ({count})
                </button>
              );
            })}
          </div>
        )}

        {loading && (
          <div style={{ color: "#666", fontSize: 16, marginTop: 20 }}>
            Loading articles...
          </div>
        )}
        {error && (
          <div
            style={{
              color: "#e74c3c",
              fontSize: 16,
              marginTop: 20,
              background: "rgba(231, 76, 60, 0.1)",
              padding: "12px 24px",
              borderRadius: 12,
              display: "inline-block",
            }}
          >
            {error}
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 24,
            marginTop: 24,
            padding: "0 20px",
            maxWidth: 1200,
            margin: "24px auto 0",
          }}
        >
          {filteredArticles.length === 0 && !loading && (
            <div style={{ color: "#666", fontSize: 16 }}>
              {selectedCategory === "all"
                ? "No articles found."
                : "No articles in this category."}
            </div>
          )}
          {filteredArticles.map((article) => {
            const articleCategories = getCategoriesByIds(
              article.categoryIds || null
            );
            return (
              <div key={article.id} style={{ width: 320, height: 380 }}>
                <ArticleCard
                  id={article.id}
                  title={article.title}
                  description={article.description}
                  coverImageUrl={article.coverImageUrl}
                  categoryIds={article.categoryIds}
                  categories={articleCategories}
                  authorName={article.authorName}
                  authorEmail={article.authorEmail}
                  createdAt={article.createdAt}
                />
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
