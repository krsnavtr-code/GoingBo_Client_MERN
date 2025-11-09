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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch blog post");
        }

        const { data } = await res.json();
        
        if (!data) {
          throw new Error("No blog data received");
        }

        const formattedBlog = {
          ...data,
          metaTitle: data.meta?.title || "",
          metaDescription: data.meta?.description || "",
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
