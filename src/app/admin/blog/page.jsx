"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiTag,
  FiFilter,
  FiX,
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  format,
  parseISO,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { getCookie } from "@/services/api";
import CategoryManager from "./components/CategoryManager";

const API_BASE_URL = "/api/v1";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const handleDateChange = (type, value) => {
    setDateRange((prev) => ({
      ...prev,
      [type]: value ? new Date(value) : null,
    }));
  };

  const clearDateFilter = () => {
    setDateRange({ startDate: null, endDate: null });
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      // Search term filter
      const matchesSearch =
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags?.some((tag) =>
          tag?.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        blog.categories?.some((cat) =>
          (typeof cat === "object" ? cat.name : cat)
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

      // Category filter
      const matchesCategory =
        !selectedCategory ||
        blog.categories?.some(
          (cat) =>
            (typeof cat === "object" ? cat._id : cat) === selectedCategory
        );

      // Date range filter
      const matchesDateRange =
        !dateRange.startDate ||
        !dateRange.endDate ||
        (blog.publishedAt &&
          isWithinInterval(new Date(blog.publishedAt), {
            start: startOfDay(new Date(dateRange.startDate)),
            end: endOfDay(new Date(dateRange.endDate)),
          }));

      return matchesSearch && matchesCategory && matchesDateRange;
    });
  }, [blogs, searchTerm, selectedCategory, dateRange]);

  const clearCategoryFilter = () => {
    setSelectedCategory("");
  };

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

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/v1/blog-categories", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(error.message || "Failed to load categories");
      setCategories([]);
    }
  };

  const handleAddCategory = async (categoryData) => {
    try {
      const url = categoryData._id
        ? `${API_BASE_URL}/blog-categories/${categoryData._id}`
        : `${API_BASE_URL}/blog-categories`;

      const method = categoryData._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(categoryData),
      });

      if (res.ok) {
        toast.success(
          `Category ${categoryData._id ? "updated" : "added"} successfully`
        );
        fetchCategories();
        return true;
      } else {
        const error = await res.json();
        throw new Error(error.message || "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error.message || "Failed to save category");
      return false;
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return false;
    }

    try {
      const res = await fetch(`/api/v1/blog-categories/${categoryId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Category deleted successfully");
        fetchCategories();
        return true;
      } else {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.message || "Failed to delete category");
      return false;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">All Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] text-[var(--button-color)] px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FiPlus /> New Post
        </Link>
      </div>

      {/* Category Management Section */}
      <CategoryManager
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        className="mb-8"
      />

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
                <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
                  <div className="flex flex-col gap-1">
                    {/* Label */}
                    <span>Published</span>

                    {/* Start Date */}
                    <input
                      type="date"
                      value={
                        dateRange.startDate
                          ? format(dateRange.startDate, "yyyy-MM-dd")
                          : ""
                      }
                      onChange={(e) =>
                        handleDateChange("startDate", e.target.value)
                      }
                      className="w-24 text-xs rounded-md border-[var(--border-color)] bg-[var(--input-bg-color)] text-[var(--text-color)]"
                      placeholder="Start date"
                    />

                    {/* End Date */}
                    <input
                      type="date"
                      value={
                        dateRange.endDate
                          ? format(dateRange.endDate, "yyyy-MM-dd")
                          : ""
                      }
                      onChange={(e) =>
                        handleDateChange("endDate", e.target.value)
                      }
                      min={
                        dateRange.startDate
                          ? format(dateRange.startDate, "yyyy-MM-dd")
                          : undefined
                      }
                      className="w-24 text-xs rounded-md border-[var(--border-color)] bg-[var(--input-bg-color)] text-[var(--text-color)]"
                      placeholder="End date"
                    />

                    {/* Clear button */}
                    {(dateRange.startDate || dateRange.endDate) && (
                      <button
                        onClick={clearDateFilter}
                        className="self-start text-red-600 cursor-pointer hover:text-red-500 text-xs"
                        title="Clear date filter"
                      >
                        <FiX size={14} />
                      </button>
                    )}
                  </div>
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <div className="flex flex-col gap-1">
                    {/* Label */}
                    <span>Categories</span>

                    {/* Select + Clear Button Container */}
                    <div className="relative w-[150px]">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="block w-full pr-8 text-xs rounded-md border-[var(--border-color)] bg-[var(--container-color-in)] text-[var(--text-color)] focus:ring-1 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] p-1 appearance-none"
                      >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name} ({cat.blogCount || 0})
                          </option>
                        ))}
                      </select>

                      {/* Clear button inside input */}
                      {selectedCategory && (
                        <button
                          onClick={clearCategoryFilter}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 flex items-center justify-center"
                          title="Clear filter"
                        >
                          <FiX size={14} />
                        </button>
                      )}
                    </div>
                  </div>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {blog.categories?.map((category) => (
                          <span
                            key={category._id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {category.name}
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
