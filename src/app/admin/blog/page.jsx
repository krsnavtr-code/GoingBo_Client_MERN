'use client';

import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getCookie } from '@/services/api';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      console.log("Cookies:", document.cookie); // Debug log

      const res = await fetch("/api/v1/blog", {
        credentials: "include",
      });

      console.log("Response status:", res.status); // Debug log

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      console.log("Blogs data:", data); // Debug log

      if (res.ok) {
        setBlogs(Array.isArray(data) ? data : data.data || data.blogs || []);
      } else {
        throw new Error(data.message || "Failed to fetch blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error(error.message || "Failed to load blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const res = await fetch(`/api/v1/blog/${id}`, {
          method: "DELETE",
          credentials: "include", // Important for cookies
        });

        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }

        const data = await res.json();

        if (res.ok) {
          toast.success("Blog post deleted successfully");
          fetchBlogs();
        } else {
          throw new Error(data.message || "Failed to delete blog post");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        toast.error(error.message || "Failed to delete blog post");
      }
    }
  };

  const filteredBlogs = Array.isArray(blogs)
    ? blogs.filter(
        (blog) =>
          blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (blog.tags &&
            Array.isArray(blog.tags) &&
            blog.tags.some((tag) =>
              tag?.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      )
    : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] text-[var(--button-color)] px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FiPlus /> New Post
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search blogs by title or tags..."
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-[var(--button-bg-color)] focus:border-[var(--button-bg-color)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-[var(--container-color-in)] text-[var(--text-color)] rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto divide-y divide-[var(--border-color)]">
            <thead className="text-[var(--text-color-light)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-[var(--container-color-in)] text-[var(--text-color)] divide-y divide-[var(--border-color)]">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-[var(--container-color-in)]"
                  >
                    <td className="px-6 py-4 max-w-[250px]">
                      <div className="text-sm font-medium truncate">
                        {blog.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--text-color-light)]">
                        {blog.published ? "Published" : "Draft"}
                      </div>
                      {blog.publishedAt && (
                        <div className="text-xs text-gray-400">
                          {format(new Date(blog.publishedAt), "MMM d, yyyy")}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          href={`/admin/blog/edit/${blog._id}`}
                          className="cursor-pointer"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="cursor-pointer"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No blog posts found. Create your first blog post!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
