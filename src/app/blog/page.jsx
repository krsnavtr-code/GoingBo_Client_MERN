"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import blogAPI from "@/services/blogApi";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });

  const fetchBlogPosts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await blogAPI.getBlogPosts({
        page,
        limit: pagination.limit,
        sort: "-publishedAt",
      });

      // Handle both array and paginated responses
      if (Array.isArray(response)) {
        setPosts(response);
      } else {
        // Handle paginated response
        const { data, pagination: paginationData } = response;
        setPosts(data || []);
        setPagination((prev) => ({
          ...prev,
          page: paginationData?.page || 1,
          total: paginationData?.total || 0,
          totalPages: paginationData?.pages || 1,
        }));
      }
    } catch (err) {
      console.error("Error fetching blog posts:", err);
      setError(err.message || "Failed to load blog posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchBlogPosts(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error loading blog posts</h2>
          <p className="mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Try Again
            </button>
            <Link href="/" className="px-6 py-2 rounded-lg transition-colors">
              Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--container-color)] text-[var(--text-color)]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-lg max-w-2xl mx-auto">
              Explore our latest articles, tutorials, and insights on web
              development, design, and technology.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full px-5 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--container-color-in)] transition-all duration-200"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--button-color)] hover:text-[var(--button-hover-color)] transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[var(--text-color)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {["All", "Web Dev", "React", "Next.js", "JavaScript", "CSS"].map(
                (tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-[var(--button-bg-color)] text-[var(--button-color)] cursor-pointer border-[var(--border-color)] hover:bg-[var(--button-hover-color)] transition-colors"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16 bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-xl shadow-sm">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-medium">No blog posts found</h3>
              <p className="mt-2 max-w-md mx-auto text-[var(--text-color-light)]">
                We couldn't find any articles matching your criteria. Check back
                soon for new content!
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <article
                    key={post._id}
                    className="group bg-[var(--container-color-in)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[var(--border-color)]"
                  >
                    <Link href={`/blog/${post.slug}`} className="block h-full">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={
                            post.featuredImage?.includes(
                              "process.env.NEXT_PUBLIC_API_URL"
                            )
                              ? process.env.NEXT_PUBLIC_API_URL +
                                post.featuredImage.split('"')[1]
                              : post.featuredImage || "/avatar.png"
                          }
                          alt={post.title || "Blog post image"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={false}
                        />
                        <div className="absolute inset-0 bg-[var(--container-color-in)] opacity-0 transition-opacity duration-300 flex items-end p-4">
                          <span className="text-sm font-medium">
                            Read more →
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(post.tags?.slice(0, 2) || ["Uncategorized"]).map(
                            (tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 text-xs font-medium bg-[var(--button-bg-color)] text-[var(--button-color)] rounded-full"
                              >
                                {tag}
                              </span>
                            )
                          )}
                          {post.tags?.length > 2 && (
                            <span className="px-2.5 py-1 text-xs font-medium bg-[var(--button-bg-color)] text-[var(--button-color)] rounded-full">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                        <h2 className="text-md font-bold mb-2 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-[var(--text-color-light)] text-sm mb-4 line-clamp-2">
                          {post.excerpt || "Read more..."}
                        </p>
                        <div className="flex items-center justify-between text-sm text-[var(--text-color-light)]">
                          <span>
                            {post.publishedAt
                              ? format(
                                  new Date(post.publishedAt),
                                  "MMM d, yyyy"
                                )
                              : "Draft"}
                          </span>
                          <span className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {Math.ceil((post.content?.length || 0) / 1000) || 5}{" "}
                            min read
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="inline-flex items-center space-x-1 rounded-lg bg-white dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-md text-[var(--text-color-light)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.page >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                              pagination.page === pageNum
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="p-2 rounded-md text-[var(--text-color-light)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
