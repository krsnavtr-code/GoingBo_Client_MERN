"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { blogAPI } from "@/services/api";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        setError(null);

        // First try to fetch by slug
        let response = await fetch(
          `/api/v1/blog/slug/${encodeURIComponent(slug)}`
        );

        // If not found by slug, try by ID (for backward compatibility)
        if (!response.ok) {
          response = await fetch(`/api/v1/blog/${encodeURIComponent(slug)}`);
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch blog post");
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error("Blog post not found");
        }

        setPost(result.data);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--button-color)]"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            {error || "Blog post not found"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The requested blog post could not be found or no longer exists.
          </p>
          <Link
            href="/blog"
            className="mt-4 inline-block px-6 py-2 bg-[var(--button-bg-color)] text-[var(--button-hover-color)] rounded-lg hover:bg-[var(--button-color)] transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:py-12 py-4">
      <article className="max-w-4xl mx-auto text-[var(--text-color)]">
        <header className="lg:mb-12 md:mb-8 mb-4">
          <h1 className="text-lg md:text-3xl font-bold lg:mt-5">{post.title}</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 items-center">
          {/* LEFT SIDE — FEATURED IMAGE */}
          {post.featuredImage && (
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={
                  post.featuredImage?.includes(
                    "process.env.NEXT_PUBLIC_API_URL"
                  )
                    ? process.env.NEXT_PUBLIC_API_URL +
                      post.featuredImage.split('"')[1]
                    : post.featuredImage || "/avatar.png"
                }
                alt={post.title}
                fill
                className="object-cover object-center border border-[var(--border-color)]"
                priority
              />
            </div>
          )}

          {/* RIGHT SIDE — BLOG DETAILS */}
          <div>
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories?.map((category) => (
                <Link
                  key={category}
                  href={`/blog?category=${encodeURIComponent(category)}`}
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full hover:bg-green-200 transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-[var(--text-color-light)]">
                {post.publishedAt
                  ? format(new Date(post.publishedAt), "MMMM d, yyyy")
                  : "Draft"}
              </span>
              <span className="text-[var(--text-color-light)]">•</span>
              <span className="text-sm text-[var(--text-color-light)]">
                {Math.ceil((post.content?.length || 0) / 1000) || 5} min read
              </span>
            </div>

            <p className="text-[var(--text-color-light)] leading-relaxed mb-4">
              {post.meta?.description || ""}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 ">
              {post.tags?.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded hover:bg-blue-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">{post.excerpt}</div>

        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {post.tags?.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-[var(--button-bg-color)] text-[var(--button-color)] text-sm rounded-full hover:bg-[var(--button-hover-color)] transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
