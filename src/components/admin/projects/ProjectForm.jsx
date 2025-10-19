'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import dynamic from "next/dynamic";

const TipTapEditor = dynamic(() => import("./TipTapEditor"), { ssr: false });


const ProjectForm = ({ project = null }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    technologies: [],
    projectUrl: "",
    githubUrl: "",
    githubUrl2: "",
    status: "planning",
    priority: 0,
    startDate: "",
    endDate: "",
    tags: [],
    isPublished: false,
    mainImage: "",
    imageGallery: [],
    itcategories: [],
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newTech, setNewTech] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newImage, setNewImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // console.log('Fetching categories...');
        const res = await fetch("/api/v1/it-categories");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const result = await res.json();
        // console.log('Categories API response:', result);
        if (result && result.data && Array.isArray(result.data.categories)) {
          // console.log('Setting categories:', result.data.categories);
          setCategories(result.data.categories);
        } else {
          console.warn('No categories found in response:', result);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // If editing, populate form with project data
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        shortDescription: project.shortDescription || "",
        description: project.description || "",
        technologies: project.technologies || [],
        projectUrl: project.projectUrl || "",
        githubUrl: project.githubUrl || "",
        githubUrl2: project.githubUrl2 || "",
        status: project.status || "planning",
        priority: project.priority || 0,
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().split("T")[0]
          : "",
        endDate: project.endDate
          ? new Date(project.endDate).toISOString().split("T")[0]
          : "",
        tags: project.tags || [],
        isPublished: project.isPublished || false,
        mainImage: project.mainImage || "",
        imageGallery: project.imageGallery || [],
        itcategories: project.itcategories?.map((cat) => cat._id) || [],
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Update the description field in form data
  const handleDescriptionChange = (html) => {
    setFormData((prev) => ({
      ...prev,
      description: html,
    }));
  };


  const addTechnology = (e) => {
    e.preventDefault();
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()],
      }));
      setNewTech("");
    }
  };

  const removeTechnology = (techToRemove) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((tech) => tech !== techToRemove),
    }));
  };

  const addTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addImageToGallery = (e) => {
    e.preventDefault();
    if (newImage.trim() && !formData.imageGallery.includes(newImage.trim())) {
      setFormData((prev) => ({
        ...prev,
        imageGallery: [...prev.imageGallery, newImage.trim()],
      }));
      setNewImage("");
    }
  };

  const removeImageFromGallery = (imageToRemove) => {
    setFormData((prev) => ({
      ...prev,
      imageGallery: prev.imageGallery.filter((img) => img !== imageToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = project
        ? `/api/v1/projects/${project._id}`
        : "/api/v1/projects";
      const method = project ? "PATCH" : "POST";

      // Helper function to validate and format URLs
      const formatImageUrl = (url) => {
        if (!url || typeof url !== 'string') return null;
        const trimmedUrl = url.trim();
        if (!trimmedUrl) return null;
        
        // If it's already a full URL, return as is
        try {
          new URL(trimmedUrl);
          return trimmedUrl;
        } catch (e) {
          // If it's a relative path, ensure it starts with a slash
          return trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`;
        }
      };

      // Prepare the data to be sent
      const dataToSend = {
        ...formData,
        // Ensure required fields are present
        title: formData.title.trim(),
        description: formData.description.trim(),
        // Convert empty strings to null for optional fields
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        // Ensure arrays are properly formatted
        technologies: Array.isArray(formData.technologies) ? formData.technologies : [],
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        itcategories: Array.isArray(formData.itcategories) ? formData.itcategories : [],
        // Format and validate image gallery URLs
        imageGallery: Array.isArray(formData.imageGallery) 
          ? formData.imageGallery
              .map(url => formatImageUrl(url))
              .filter(Boolean) // Remove any null/undefined values
          : [],
        // Ensure boolean fields are properly set
        isPublished: Boolean(formData.isPublished),
        // Ensure priority is a number
        priority: Number(formData.priority) || 0
      };

      // Format mainImage if it exists
      dataToSend.mainImage = formatImageUrl(formData.mainImage);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
        credentials: "include",
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok) {
        console.error('Server responded with error:', responseData);
        throw new Error(responseData.message || responseData.error || 'Something went wrong');
      }

      toast.success(`Project ${project ? "updated" : "created"} successfully`);
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      console.error("Error saving project:", error);
      // Try to parse the error response if it's a JSON response
      let errorMessage = 'Failed to save project';
      try {
        const errorData = await error.response?.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // If we can't parse the error response, use the original error message
        errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-6 text-[var(--text-color)]">
      <h1 className="text-3xl font-bold mb-10 border-b pb-3">
        {project ? "Edit Project" : "Add New Project"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic + Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 border-b pb-2">
              Basic Information
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  maxLength={250}
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 h-24 resize-none focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {formData.shortDescription?.length || 0}/250
                </p>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Categories *
                </label>
                <select
                  multiple
                  value={formData.itcategories}
                  onChange={(e) => {
                    const selected = Array.from(
                      e.target.selectedOptions,
                      (o) => o.value
                    );
                    setFormData((prev) => ({
                      ...prev,
                      itcategories: selected,
                    }));
                  }}
                  className="w-full min-h-[120px] rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                >
                  {categories.length > 0 ? (
                    categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>
                      No categories found. Please add categories first.
                    </option>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  Hold Ctrl/Cmd to select multiple
                </p>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 border-b pb-2">
              Project Details
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Priority (0–10)
                  </label>
                  <input
                    type="number"
                    name="priority"
                    min="0"
                    max="10"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate}
                    className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Project URL
                </label>
                <input
                  type="url"
                  name="projectUrl"
                  value={formData.projectUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  GitHub Repository
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 mb-3 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                />
                <input
                  type="url"
                  name="githubUrl2"
                  value={formData.githubUrl2}
                  onChange={handleChange}
                  placeholder="Secondary GitHub URL (optional)"
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-lg font-semibold">
              Main description with all information 
            </h2>
            <div className="flex border border-[var(--border-color)] rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className={`px-4 py-1 text-sm font-medium cursor-pointer ${!showPreview ? 'bg-[var(--container-color)]' : 'bg-[var(--container-color-in)]'}`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className={`px-4 py-1 text-sm font-medium cursor-pointer ${showPreview ? 'bg-[var(--container-color)]' : 'bg-[var(--container-color-in)]'}`}
              >
                Preview
              </button>
            </div>
          </div>
          
          {!showPreview ? (
            <>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <div className="rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] overflow-hidden">
                <TipTapEditor
                  content={formData.description}
                  onChange={handleDescriptionChange}
                />
              </div>
            </>
          ) : (
            <div className="prose max-w-none p-4 border border-[var(--border-color)] rounded-lg bg-[var(--container-color)] min-h-[200px]"
              dangerouslySetInnerHTML={{ __html: formData.description || '<p class="text-[var(--text-color-secondary)]">No content to preview. Start typing in the editor to see a preview here.</p>' }}
            />
          )}
        </div>

        {/* Technologies + Tags + Images + Publish */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Technologies */}
          <div className="bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 border-b pb-2">
              Technologies
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="inline-flex items-center bg-[var(--button-bg-color)] text-[var(--button-color)] px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="ml-2 text-[var(--button-color)] hover:text-red-500 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Add a technology"
                className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
              <button
                type="button"
                onClick={addTechnology}
                disabled={!newTech.trim()}
                className="px-6 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--button-bg-color)] text-[var(--button-color)] hover:bg-[var(--button-hover-color)] transition cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 border-b pb-2">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center bg-[var(--button-bg-color)] text-[var(--button-color)] px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-[var(--button-color)] hover:text-red-500 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!newTag.trim()}
                className="px-6 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--button-bg-color)] text-[var(--button-color)] hover:bg-[var(--button-hover-color)] transition cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 border-b pb-2">Images</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Main Image URL
            </label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                name="mainImage"
                value={formData.mainImage}
                onChange={handleChange}
                placeholder="e.g., /uploads/projects/image.jpg"
                className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
              {formData.mainImage && (
                <img
                  src={
                    formData.mainImage.startsWith("http")
                      ? formData.mainImage
                      : `${process.env.NEXT_PUBLIC_API_URL}${formData.mainImage}`
                  }
                  alt="Preview"
                  className="w-14 h-14 rounded-lg object-cover border"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Image Gallery
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {formData.imageGallery.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={
                      img.startsWith("http")
                        ? img
                        : `${process.env.NEXT_PUBLIC_API_URL}${img}`
                    }
                    className="rounded-lg object-cover w-full aspect-video border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageFromGallery(img)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Add image URL"
                className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
              <button
                type="button"
                onClick={addImageToGallery}
                disabled={!newImage.trim()}
                className="px-6 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--button-bg-color)] text-[var(--button-color)] hover:bg-[var(--button-hover-color)] transition cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Publish Options */}
        <div className="bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">Publish</h2>
              <p className="text-sm text-gray-500">
                {formData.isPublished
                  ? "This project is currently published."
                  : "This project is not published yet."}
              </p>
            </div>
            <label className="inline-flex items-center gap-2">
              <span className="text-sm font-medium">Published</span>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, isPublished: e.target.checked }))
                }
                className="w-5 h-5 accent-indigo-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.push("/admin/projects")}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--button-bg-color)] text-[var(--button-color)] hover:bg-[var(--button-hover-color)] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--button-bg-color)] text-[var(--button-color)] hover:bg-[var(--button-hover-color)] transition cursor-pointer"
          >
            {isSubmitting && (
              <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4"></span>
            )}
            {project
              ? isSubmitting
                ? "Updating..."
                : "Update Project"
              : isSubmitting
              ? "Creating..."
              : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
