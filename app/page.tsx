"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
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

  // Articles used for the Recent section: pinned top 3 by createdAt (independent of filters)
  const pinnedArticles = [...articles]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  // Filtered list used only for the All section. Filters should not affect Recent.
  const filteredForAll = articles.filter((article) => {
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

  // Exclude pinned articles from the All list so Recent remains pinned and doesn't duplicate
  const pinnedIds = new Set(pinnedArticles.map((a) => a.id));
  const allArticlesToShow = filteredForAll.filter((a) => !pinnedIds.has(a.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <div className="max-w-[1200px] mx-auto px-5 py-[40px] pb-8 w-full">
        {/* Recent Blog Posts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-8 tracking-tight">
            Recent blog posts
          </h2>

          {/* Featured Articles - Show first 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {pinnedArticles.map((article) => {
              const articleCategories = getCategoriesByIds(
                article.categoryIds || null
              );
              return (
                <div
                  key={article.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/article/${article.id}`)
                  }
                >
                  {/* Image */}
                  <div
                    className={`w-full h-[200px] relative overflow-hidden flex items-center justify-center ${
                      article.coverImageUrl
                        ? "bg-gray-100"
                        : "bg-gradient-to-br from-[#667eea] to-[#764ba2]"
                    }`}
                  >
                    {article.coverImageUrl ? (
                      <Image
                        src={article.coverImageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-white text-5xl font-light">📝</div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Author and Date */}
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
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
                    <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3 leading-tight">
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p className="text-base text-gray-500 leading-relaxed mb-4 line-clamp-2">
                      {article.description}
                    </p>

                    {/* Categories */}
                    {articleCategories && articleCategories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {articleCategories.slice(0, 3).map((category) => (
                          <span
                            key={category.id}
                            className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{ background: category.color }}
                          >
                            {category.name}
                          </span>
                        ))}
                        {articleCategories.length > 3 && (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
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
        <div className="w-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-extrabold text-[#1a1a1a] tracking-tight m-0">
              All blog posts
            </h2>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                showFilters
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-500 hover:text-blue-500"
              }`}
            >
              {showFilters ? "Hide Filters" : "Filter"}
            </button>
          </div>

          {/* Category Filter - reserve space to avoid layout shift */}
          <div className="min-h-[80px] mb-8">
            <div
              className={`${
                showFilters ? "flex flex-wrap gap-3 pt-2" : "hidden"
              }`}
            >
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  selectedCategory === "all"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-500 border-gray-200 hover:border-blue-500 hover:text-blue-500"
                }`}
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
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      selectedCategory === category.id
                        ? ""
                        : "bg-white text-gray-500 border-gray-200 hover:border-blue-500 hover:text-blue-500"
                    }`}
                    style={
                      selectedCategory === category.id
                        ? {
                            background: category.color,
                            color: "#fff",
                            borderColor: category.color,
                          }
                        : undefined
                    }
                  >
                    {category.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="text-gray-500 text-base text-center py-10">
              Loading articles...
            </div>
          )}
          {error && (
            <div className="text-red-600 text-center py-10">{error}</div>
          )}

          {/* All Articles Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {allArticlesToShow.length === 0 ? (
                <div className="text-gray-500 text-center col-span-full py-10">
                  {selectedCategory === "all"
                    ? "No more articles to show."
                    : "No articles in this category."}
                </div>
              ) : (
                allArticlesToShow.map((article) => {
                  const articleCategories = getCategoriesByIds(
                    article.categoryIds || null
                  );
                  return (
                    <div
                      key={article.id}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5 cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/article/${article.id}`)
                      }
                    >
                      {/* Image */}
                      <div
                        className={`w-full h-40 relative overflow-hidden flex items-center justify-center ${
                          article.coverImageUrl
                            ? "bg-gray-100"
                            : "bg-gradient-to-br from-[#667eea] to-[#764ba2]"
                        }`}
                      >
                        {article.coverImageUrl ? (
                          <Image
                            src={article.coverImageUrl}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="text-white text-2xl font-light">
                            📝
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {/* Author and Date */}
                        <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
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
                        <h3 className="text-base font-semibold text-[#1a1a1a] mb-2 leading-tight line-clamp-2">
                          {article.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {article.description}
                        </p>

                        {/* Categories */}
                        {articleCategories && articleCategories.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {articleCategories.slice(0, 2).map((category) => (
                              <span
                                key={category.id}
                                className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                                style={{ background: category.color }}
                              >
                                {category.name}
                              </span>
                            ))}
                            {articleCategories.length > 2 && (
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
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
