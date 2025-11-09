"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEditor } from "@tiptap/react";
import { Underline } from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  FiSave,
  FiX,
  FiImage,
  FiTag,
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";

// Dynamically import Tiptap editor
const Tiptap = dynamic(
  () =>
    import("@tiptap/react").then((mod) => {
      const { EditorContent, Image } = mod;

      const Toolbar = ({ editor }) => {
        if (!editor) return null;

        const Button = ({ onClick, active, title, Icon }) => (
          <button
            type="button"
            onClick={onClick}
            className={`p-2 rounded transition-colors ${
              active
                ? "bg-[var(--button-bg-color)] text-[var(--button-color)]"
                : "hover:bg-[var(--button-bg-color)] hover:text-[var(--button-color)]"
            }`}
            title={title}
          >
            <Icon size={16} />
          </button>
        );

        return (
          <div className="border-b border-[var(--border-color)] bg-[var(--container-color)] p-1 flex flex-wrap gap-1">
            {/* --- Text Style Buttons --- */}
            <Button
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
              title="Bold"
              Icon={FiBold}
            />
            <Button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
              title="Italic"
              Icon={FiItalic}
            />
            <Button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")}
              title="Underline"
              Icon={FiUnderline}
            />

            <div className="border-r border-[var(--border-color)] h-6 mx-1" />

            {/* --- Headings --- */}
            {[1, 2, 3].map((level) => (
              <Button
                key={level}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level }).run()
                }
                active={editor.isActive("heading", { level })}
                title={`Heading ${level}`}
                Icon={() => <span className="font-bold">{`H${level}`}</span>}
              />
            ))}

            <div className="border-r border-[var(--border-color)] h-6 mx-1" />

            {/* --- List Controls --- */}
            <Button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
              title="Bullet List"
              Icon={FiList}
            />
            <Button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
              title="Numbered List"
              Icon={() => <span className="font-semibold">1.</span>}
            />
            <Button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive("blockquote")}
              title="Blockquote"
              Icon={() => <span className="font-serif italic">“”</span>}
            />
            <Button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive("codeBlock")}
              title="Code Block"
              Icon={() => <span className="font-mono text-xs">{`{ }`}</span>}
            />

            <div className="border-r border-[var(--border-color)] h-6 mx-1" />

            {/* --- Alignment --- */}
            {["left", "center", "right", "justify"].map((align) => (
              <Button
                key={align}
                onClick={() => editor.chain().focus().setTextAlign(align).run()}
                active={editor.isActive({ textAlign: align })}
                title={`Align ${align}`}
                Icon={() => (
                  <span className="text-xs capitalize">
                    {align[0].toUpperCase()}
                  </span>
                )}
              />
            ))}

            <div className="border-r border-[var(--border-color)] h-6 mx-1" />

            {/* --- Link / Image --- */}
            <Button
              onClick={() => {
                const url = window.prompt("Enter link URL:");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
              active={editor.isActive("link")}
              title="Insert Link"
              Icon={FiTag}
            />
            <Button
              onClick={() => {
                const url = window.prompt("Enter image URL:");
                if (url) editor.chain().focus().setImage({ src: url }).run();
              }}
              title="Add Image"
              Icon={FiImage}
            />

            <div className="border-r border-[var(--border-color)] h-6 mx-1" />

            {/* --- Undo / Redo --- */}
            <Button
              onClick={() => editor.chain().focus().undo().run()}
              title="Undo"
              Icon={() => <span className="font-bold">↩</span>}
              disabled={!editor.can().undo()}
            />
            <Button
              onClick={() => editor.chain().focus().redo().run()}
              title="Redo"
              Icon={() => <span className="font-bold">↪</span>}
              disabled={!editor.can().redo()}
            />
          </div>
        );
      };

      return function TiptapEditor({ content, onUpdate }) {
        const editor = useEditor({
          extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
            Underline,
            Link.configure({
              openOnClick: false,
              HTMLAttributes: {
                class:
                  "text-[var(--text-color)] hover:text-[var(--button-color)] underline",
                target: "_blank",
              },
            }),
            Image,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
          ],
          content,
          onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
          editorProps: {
            attributes: {
              class:
                "prose max-w-none focus:outline-none min-h-[300px] p-4 bg-[var(--container-color)]",
            },
          },
          immediatelyRender: false, // ✅ add this
        });

        // Update editor content when content prop changes
        useEffect(() => {
          if (editor && content !== undefined) {
            const isSame = editor.getHTML() === content;
            if (!isSame) {
              editor.commands.setContent(content);
            }
          }
        }, [content, editor]);

        if (!editor) return null;

        return (
          <div className="border border-[var(--border-color)] rounded-md">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
          </div>
        );
      };
    }),
  { ssr: false }
);

// ... [previous imports remain the same]

export default function BlogForm({ blogData = null }) {
  const router = useRouter();
  const isEditMode = !!blogData?._id;
  const [editorReady, setEditorReady] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    tags: [],
    categories: [],
    published: false,
    metaTitle: "",
    metaDescription: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog-categories`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setAvailableCategories(data.data || []);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search input
  const filteredCategories = availableCategories
    .filter(
      (category) =>
        category.name.toLowerCase().includes(categoryInput.toLowerCase()) &&
        !formData.categories.some((c) => c._id === category._id)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Toggle category selection
  const toggleCategory = (category) => {
    setFormData((prev) => {
      const categoryExists = prev.categories.some(
        (c) => c._id === category._id
      );
      const newCategories = categoryExists
        ? prev.categories.filter((c) => c._id !== category._id)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };

  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize form data if editing
  useEffect(() => {
    if (isEditMode && blogData) {
      // console.log('Initializing form with blog data:', blogData);

      const categories = Array.isArray(blogData.categories)
        ? blogData.categories.map((cat) => {
            if (typeof cat === "string") {
              // If it's just an ID, try to find the full category in availableCategories
              const found = availableCategories.find((c) => c._id === cat);
              return found || { _id: cat, name: `Category (${cat})` };
            }
            return cat; // Already in the correct format
          })
        : [];

      const initialData = {
        title: blogData.title || "",
        slug: blogData.slug || "",
        excerpt: blogData.excerpt || "",
        content: blogData.content || "",
        featuredImage: blogData.featuredImage || "",
        tags: Array.isArray(blogData.tags) ? [...blogData.tags] : [],
        categories: categories,
        published: !!blogData.published,
        metaTitle: blogData.meta?.title || "",
        metaDescription: blogData.meta?.description || "",
      };

      // console.log('Setting form data:', initialData);
      setFormData(initialData);
      setImagePreview(blogData.featuredImage || "");
      setEditorReady(true);
    } else if (!isEditMode) {
      setEditorReady(true);
    }

    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [isEditMode, blogData]);

  // Handle editor updates
  const handleEditorUpdate = useCallback((content) => {
    setFormData((prev) => ({
      ...prev,
      content: content || "",
    }));
  }, []);

  // Handle basic field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const generateSlug = async () => {
    if (!formData.title) return;

    try {
      // Common stop words (can expand list)
      const stopWords = [
        "the",
        "a",
        "an",
        "and",
        "or",
        "for",
        "of",
        "to",
        "in",
        "on",
        "with",
        "at",
        "from",
        "by",
        "about",
        "as",
        "into",
        "like",
        "through",
        "after",
        "over",
        "between",
        "out",
        "against",
        "during",
        "without",
        "before",
        "under",
        "my",
      ];

      // Generate base slug
      let slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .split(/\s+/)
        .filter((word) => word && !stopWords.includes(word))
        .slice(0, 8) // Limit to first 8 meaningful words
        .join("-")
        .replace(/--+/g, "-")
        .trim("-");

      // Check if slug exists in the database
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/slug/${slug}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const { data } = await response.json();
          if (data) {
            // If slug exists, append a random string
            slug = `${slug}-${nanoid(5)}`;
          }
        }
      } catch (error) {
        console.error("Error checking slug:", error);
        // Continue with the generated slug even if check fails
      }

      // Enforce 60-char limit (without cutting mid-word)
      const MAX_SLUG_LENGTH = 60;
      if (slug.length > MAX_SLUG_LENGTH) {
        const lastHyphen = slug.lastIndexOf("-", MAX_SLUG_LENGTH);
        slug =
          lastHyphen > 0
            ? slug.substring(0, lastHyphen)
            : slug.substring(0, MAX_SLUG_LENGTH);
      }

      // Update state with the new slug
      setFormData((prev) => ({
        ...prev,
        slug: slug.replace(/-+$/, ""), // Remove any trailing hyphens
      }));
    } catch (error) {
      console.error("Error generating slug:", error);
      toast.error("Failed to generate slug. Please try again.");
    }
  };

  // Tag handlers
  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleTagInput = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      setTagInput("");
    }
  };

  // Handle image URL change
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, featuredImage: url }));
    setImagePreview(url);
  };

  // Clear image
  const clearImage = () => {
    setFormData((prev) => ({ ...prev, featuredImage: "" }));
    setImagePreview("");
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isEditMode ? `${process.env.NEXT_PUBLIC_API_URL}/blog/${blogData._id}` : `${process.env.NEXT_PUBLIC_API_URL}/blog`;
      const method = isEditMode ? "PUT" : "POST";

      const categoryIds = formData.categories.map((cat) =>
        typeof cat === "object" ? cat._id : cat
      );
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({
          ...formData,
          categories: categoryIds,
          meta: {
            title: formData.metaTitle,
            description: formData.metaDescription,
          },
        }),
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success(isEditMode ? "Blog updated!" : "Blog created!");
      router.push("/admin/blog");
    } catch (error) {
      toast.error(error.message || "Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 animate-pulse text-center text-gray-500">
        Loading editor...
      </div>
    );

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="shadow rounded-lg p-6 space-y-6 bg-[var(--container-color-in)] text-[var(--text-color)]">
          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              className="w-full rounded-md px-3 py-2 bg-[var(--container-color)] border-[var(--border-color)] shadow-sm focus:border-[var(--border-color)] focus:ring-[var(--border-color)]"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Slug</label>
              <button
                type="button"
                onClick={generateSlug}
                className="text-sm text-blue-500 hover:text-blue-700"
                disabled={!formData.title}
              >
                Generate from Title
              </button>
            </div>
            <div className="flex">
              <span className="px-3 inline-flex items-center bg-[var(--container-color)] border border-r-0 border-[var(--border-color)] text-[var(--text-color)] text-sm rounded-l-md cursor-not-allowed">
                /blog/
              </span>
              <input
                type="text"
                name="slug"
                placeholder="Click 'Generate from Title' or enter manually"
                value={formData.slug || ""}
                onChange={handleChange}
                className="flex-1 rounded-r-md px-3 py-2 bg-[var(--container-color)] border border-[var(--border-color)]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea
              name="excerpt"
              rows="3"
              value={formData.excerpt}
              placeholder="Enter blog excerpt"
              onChange={handleChange}
              className="w-full rounded-md px-3 py-2 bg-[var(--container-color)] border-[var(--border-color)] shadow-sm focus:border-[var(--border-color)] focus:ring-[var(--border-color)]"
            />
          </div>

          {/* Featured Image URL */}
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium mb-1"
            >
              Featured Image URL
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.featuredImage || ""}
                onChange={handleImageUrlChange}
                placeholder="https://example.com/image.jpg"
                className="flex-1 p-2 border border-[var(--border-color)] rounded focus:ring-2 focus:ring-[var(--button-bg-color)] focus:border-transparent"
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Clear
                </button>
              )}
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={
                    formData.featuredImage?.includes(
                      "process.env.NEXT_PUBLIC_API_URL"
                    )
                      ? process.env.NEXT_PUBLIC_API_URL +
                        formData.featuredImage.split('"')[1]
                      : formData.featuredImage || "/avatar.png"
                  }
                  alt="Preview"
                  className="max-h-40 rounded-md border border-[var(--border-color)]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/400x200?text=Image+not+found";
                  }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInput}
                placeholder="Add a tag and press Enter"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={addTag}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
          </div>

          {/* Categories Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Categories (Select at least one)
            </label>
            <div className="relative">
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onFocus={() => setShowCategoryDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowCategoryDropdown(false), 200)
                }
                placeholder="Search categories..."
                className="block w-full px-3 py-2 border border-[var(--border-color)] rounded-md shadow-sm focus:ring-[var(--border-color)] focus:border-[var(--border-color)] sm:text-sm"
              />

              {showCategoryDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-[var(--container-color)] shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {filteredCategories.map((category) => (
                    <div
                      key={category._id}
                      onClick={() => toggleCategory(category)}
                      className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-[var(--container-color-in)] ${
                        formData.categories.some((c) => c._id === category._id)
                          ? "bg-blue-50"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="font-normal ml-3 block truncate">
                          {category.name}
                        </span>
                      </div>
                      {formData.categories.some(
                        (c) => c._id === category._id
                      ) && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                          ✓
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {loadingCategories ? (
                <div className="text-sm text-gray-500">
                  Loading categories...
                </div>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.categories.length === 0 ? (
                    <span className="text-sm text-gray-500">
                      No categories selected
                    </span>
                  ) : (
                    formData.categories.map((category) => (
                      <span
                        key={category._id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {category.name}
                        <button
                          type="button"
                          onClick={() => toggleCategory(category)}
                          className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-200 text-green-600 hover:bg-green-300 focus:outline-none"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <Tiptap content={formData.content} onUpdate={handleEditorUpdate} />
          </div>

          {/* Publish */}
          <div className="flex items-center border-t pt-4">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="h-4 w-4 text-[var(--button-color)] border-[var(--border-color)] rounded cursor-pointer"
            />
            <label className="ml-2 text-sm">Publish this post</label>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-[var(--container-color-in)] text-[var(--text-color)] shadow rounded-lg p-6 space-y-4 ">
          <h2 className="text-lg font-medium">SEO Settings</h2>
          <label className="block text-sm font-medium mb-1">
            Meta Title{" "}
            <span className="text-green-500">
              (Max length - 60 characters )
            </span>
          </label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            placeholder="Meta title"
            className="w-full rounded-md px-3 py-2 bg-[var(--container-color)] border-[var(--border-color)] shadow-sm focus:border-[var(--border-color)] focus:ring-[var(--border-color)]"
          />
          <textarea
            name="metaDescription"
            rows="3"
            value={formData.metaDescription}
            onChange={handleChange}
            placeholder="Meta description"
            className="w-full rounded-md px-3 py-2 bg-[var(--container-color)] border-[var(--border-color)] shadow-sm focus:border-[var(--border-color)] focus:ring-[var(--border-color)]"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="bg-[var(--button-bg-color)] text-[var(--button-color)] py-2 px-4 border rounded-md text-sm font-medium hover:bg-gray-50 cursor-pointer"
          >
            <FiX className="inline mr-1" /> Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[var(--button-bg-color)] text-[var(--button-color)] px-4 py-2 rounded-md text-sm font-medium hover:bg-[var(--button-bg-color)] disabled:opacity-50 cursor-pointer"
          >
            <FiSave className="inline mr-1" />
            {isSubmitting ? "Saving..." : "Save Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
