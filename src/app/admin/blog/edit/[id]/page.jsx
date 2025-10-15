"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BlogForm from "../../components/BlogForm";
import { toast } from "react-toastify";

export default function EditBlogPost() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/v1/blog/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch blog post");
        }

        const data = await res.json();
        // console.log("Fetched blog data:", data);
        const blogData = data.data;
        // console.log("Blog data:", blogData);

        const formattedBlog = {
          ...blogData,
          metaTitle: blogData.meta?.title || "",
          metaDescription: blogData.meta?.description || "",
        };

        setBlog(formattedBlog);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        toast.error(error.message || "Failed to load blog post");
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (!blog) {
    return <div className="text-center py-12">Blog post not found</div>;
  }

  return <BlogForm blogData={blog} />;
}
