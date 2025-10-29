'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from "next/image";
import { FiX } from "react-icons/fi";
import dynamic from "next/dynamic";
import CharCountField from "@/components/CharCountField";
import HtmlTagStats from "@/components/HtmlTagStats";

const TipTapEditor = dynamic(() => import("./TipTapEditor"), { ssr: false });

const ProjectForm = ({ project = null }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Basic project fields
    title: "",
    shortDescription: "",
    description: "",
    technologies: [],
    status: "planning",
    priority: 0,
    startDate: "",
    endDate: "",
    tags: [],
    isPublished: false,
    slug: "",
    order: 0,
    itcategories: [],
    mainImage: "",
    imageGallery: [],
    
    // Travel package fields
    packageType: "travel",
    destination: "",
    duration: 0,
    price: 0,
    discount: 0,
    maxTravelers: 1,
    departureDate: "",
    returnDate: "",
    included: [],
    excluded: [],
    itinerary: [],
    accommodation: "",
    transportation: "",
    mealPlan: "",
    cancellationPolicy: "",
    bookingDeadline: "",
    minTravelersRequired: 1,
    isFeatured: false,
    isGroupDiscountAvailable: false,
    groupDiscountDetails: "",
    ageRestrictions: "",
    physicalRating: "",
    specialRequirements: "",
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
          console.warn("No categories found in response:", result);
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
      // Format dates for date inputs
      const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
        } catch (e) {
          console.error('Error formatting date:', e);
          return '';
        }
      };

      setFormData({
        // Basic project fields
        title: project.title || "",
        shortDescription: project.shortDescription || "",
        description: project.description || "",
        technologies: project.technologies || [],
        status: project.status || "planning",
        priority: project.priority || 0,
        startDate: formatDate(project.startDate),
        endDate: formatDate(project.endDate),
        tags: project.tags || [],
        isPublished: project.isPublished || false,
        slug: project.slug || "",
        order: project.order || 0,
        mainImage: project.mainImage || "",
        imageGallery: project.imageGallery || [],
        itcategories: project.itcategories?.map((cat) => cat._id || cat) || [],
        
        // Travel package fields
        packageType: project.packageType || "travel",
        destination: project.destination || "",
        duration: project.duration || 0,
        price: project.price || 0,
        discount: project.discount || 0,
        maxTravelers: project.maxTravelers || 1,
        departureDate: formatDate(project.departureDate),
        returnDate: formatDate(project.returnDate),
        included: project.included || [],
        excluded: project.excluded || [],
        itinerary: project.itinerary || [],
        accommodation: project.accommodation || "",
        transportation: project.transportation || "",
        mealPlan: project.mealPlan || "",
        cancellationPolicy: project.cancellationPolicy || "",
        bookingDeadline: formatDate(project.bookingDeadline),
        minTravelersRequired: project.minTravelersRequired || 1,
        isFeatured: project.isFeatured || false,
        isGroupDiscountAvailable: project.isGroupDiscountAvailable || false,
        groupDiscountDetails: project.groupDiscountDetails || "",
        ageRestrictions: project.ageRestrictions || "",
        physicalRating: project.physicalRating || "",
        specialRequirements: project.specialRequirements || ""
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

      // Prepare the data to be sent
      const dataToSend = {
        ...formData,
        // Ensure required fields are present
        title: formData.title.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription?.trim() || '',
        // Convert empty strings to null for optional fields
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        // Ensure arrays are properly formatted
        technologies: Array.isArray(formData.technologies) ? formData.technologies : [],
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        itcategories: Array.isArray(formData.itcategories) ? formData.itcategories : [],
        // Format and validate image gallery URLs
        imageGallery: Array.isArray(formData.imageGallery)
          ? formData.imageGallery.map((url) => url).filter(Boolean)
          : [],
        // Ensure boolean fields are properly set
        isPublished: Boolean(formData.isPublished),
        isFeatured: Boolean(formData.isFeatured),
        isGroupDiscountAvailable: Boolean(formData.isGroupDiscountAvailable),
        // Ensure priority is a number
        priority: Number(formData.priority) || 0,
        // Format travel package fields
        packageType: formData.packageType || 'project',
        destination: formData.destination || '',
        duration: Number(formData.duration) || 0,
        price: Number(formData.price) || 0,
        discount: Number(formData.discount) || 0,
        maxTravelers: Number(formData.maxTravelers) || 1,
        departureDate: formData.departureDate || null,
        returnDate: formData.returnDate || null,
        included: Array.isArray(formData.included) ? formData.included.filter(Boolean) : [],
        excluded: Array.isArray(formData.excluded) ? formData.excluded.filter(Boolean) : [],
        itinerary: Array.isArray(formData.itinerary) ? formData.itinerary.map(item => ({
          title: item.title?.trim() || `Day ${item._id || ''}`.trim(),
          location: item.location?.trim() || '',
          description: item.description?.trim() || '',
          meals: Array.isArray(item.meals) ? item.meals : []
        })) : [],
        accommodation: formData.accommodation || '',
        transportation: formData.transportation || '',
        mealPlan: formData.mealPlan || '',
        cancellationPolicy: formData.cancellationPolicy || '',
        bookingDeadline: formData.bookingDeadline || null,
        minTravelersRequired: Number(formData.minTravelersRequired) || 1,
        groupDiscountDetails: formData.groupDiscountDetails || '',
        ageRestrictions: formData.ageRestrictions || '',
        physicalRating: formData.physicalRating || '',
        specialRequirements: formData.specialRequirements || ''
      };

      // Format mainImage if it exists
      dataToSend.mainImage = formData.mainImage || '';

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
        console.error("Failed to parse response as JSON:", e);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        console.error("Server responded with error:", responseData);
        throw new Error(
          responseData.message || responseData.error || "Something went wrong"
        );
      }

      toast.success(`Project ${project ? "updated" : "created"} successfully`);
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      console.error("Error saving project:", error);
      // Try to parse the error response if it's a JSON response
      let errorMessage = "Failed to save project";
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

  // Add state for new included/excluded items and itinerary days
  const [newIncluded, setNewIncluded] = useState("");
  const [newExcluded, setNewExcluded] = useState("");
  const [newItineraryDay, setNewItineraryDay] = useState({
    title: "",
    location: "",
    description: "",
    meals: [],
  });

  // Handle adding included items
  const addIncluded = (e) => {
    e.preventDefault();
    if (newIncluded.trim()) {
      setFormData((prev) => ({
        ...prev,
        included: [...prev.included, newIncluded.trim()],
      }));
      setNewIncluded("");
    }
  };

  // Handle removing included items
  const removeIncluded = (item) => {
    setFormData((prev) => ({
      ...prev,
      included: prev.included.filter((i) => i !== item),
    }));
  };

  // Handle adding excluded items
  const addExcluded = (e) => {
    e.preventDefault();
    if (newExcluded.trim()) {
      setFormData((prev) => ({
        ...prev,
        excluded: [...prev.excluded, newExcluded.trim()],
      }));
      setNewExcluded("");
    }
  };

  // Handle removing excluded items
  const removeExcluded = (item) => {
    setFormData((prev) => ({
      ...prev,
      excluded: prev.excluded.filter((i) => i !== item),
    }));
  };

  // Handle adding a new itinerary day
  const addItineraryDay = () => {
    const newDay = {
      title: `Day ${formData.itinerary.length + 1}`,
      location: "",
      description: "",
      meals: [],
    };
    
    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay],
    }));
  };

  // Handle updating an itinerary day
  const updateItineraryDay = (index, field, value) => {
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary[index] = {
      ...updatedItinerary[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      itinerary: updatedItinerary,
    }));
  };

  // Handle removing an itinerary day
  const removeItineraryDay = (index) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container mx-auto max-w-6xl px-6 text-[var(--text-color)]">
      <h1 className="text-3xl font-bold mb-10 border-b pb-3">
        {project ? "Edit Package" : "Add New Package"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 border-b pb-2">
            Basic Information
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => {
                  handleChange(e);
                  // Generate slug from title
                  const slug = e.target.value
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '') // remove special chars
                    .replace(/\s+/g, '-')      // replace spaces with -
                    .replace(/--+/g, '-')       // replace multiple - with single -
                    .trim();
                  
                  setFormData(prev => ({
                    ...prev,
                    slug: slug
                  }));
                }}
                required
                minLength={5}
                maxLength={100}
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />

              {/* Character count and slug preview */}
              <div className="mt-1">
                <div className="flex justify-between items-center">
                  <CharCountField value={formData.title} maxLength={100} />
                  {formData.title && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Slug:</span>
                      <div className="relative flex-1 max-w-xs">
                        <input
                          type="text"
                          name="slug"
                          value={formData.slug || ''}
                          onChange={(e) => {
                            const newSlug = e.target.value
                              .toLowerCase()
                              .replace(/[^\w\s-]/g, '') // remove special chars
                              .replace(/\s+/g, '-')      // replace spaces with -
                              .replace(/--+/g, '-')       // replace multiple - with single -
                              .trim();
                            
                            setFormData(prev => ({
                              ...prev,
                              slug: newSlug
                            }));
                          }}
                          className="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="custom-slug"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // Auto-generate slug from title when the button is clicked
                            const newSlug = formData.title
                              .toLowerCase()
                              .replace(/[^\w\s-]/g, '')
                              .replace(/\s+/g, '-')
                              .replace(/--+/g, '-')
                              .trim();
                            
                            setFormData(prev => ({
                              ...prev,
                              slug: newSlug
                            }));
                          }}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 p-1"
                          title="Regenerate from title"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {formData.slug ? (
                    <span>URL: <span className="font-mono">/projects/{formData.slug}</span></span>
                  ) : 'Enter a title to generate URL'}
                </p>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Categories *{" "}
                <span className="text-xs text-gray-500">
                  (Hold Ctrl/Cmd to select multiple)
                </span>
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
              <CharCountField
                value={formData.itcategories}
                maxLength={categories.length}
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
              <CharCountField
                value={formData.shortDescription}
                maxLength={250}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-lg font-semibold">
              Main description with all information
            </h2>
            <CharCountField value={formData.description} />
            <div className="flex border border-[var(--border-color)] rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className={`px-4 py-1 text-sm font-medium cursor-pointer ${
                  !showPreview
                    ? "bg-[var(--container-color)]"
                    : "bg-[var(--container-color-in)]"
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className={`px-4 py-1 text-sm font-medium cursor-pointer ${
                  showPreview
                    ? "bg-[var(--container-color)]"
                    : "bg-[var(--container-color-in)]"
                }`}
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
            <div
              className="prose max-w-none p-4 border border-[var(--border-color)] rounded-lg bg-[var(--container-color)] min-h-[200px]"
              dangerouslySetInnerHTML={{
                __html:
                  formData.description ||
                  '<p class="text-[var(--text-color-secondary)]">No content to preview. Start typing in the editor to see a preview here.</p>',
              }}
            />
          )}
          <CharCountField value={formData.description} />
          <HtmlTagStats html={formData.description} />
        </div>

        {/* Combined Form Fields */}
        <div className="bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-6 border-b pb-2">
            Package Stay Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Destination *
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Duration (Days) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                required
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Price (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] pl-8 pr-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Departure Date *
              </label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Return Date *
              </label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                min={formData.departureDate}
                required
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Travelers *
              </label>
              <input
                type="number"
                name="maxTravelers"
                value={formData.maxTravelers}
                onChange={handleChange}
                min="1"
                required
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Accommodation Type *
              </label>
              <select
                name="accommodation"
                value={formData.accommodation}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              >
                <option value="">Select Accommodation</option>
                <option value="hotel">Hotel</option>
                <option value="resort">Resort</option>
                <option value="hostel">Hostel</option>
                <option value="villa">Villa</option>
                <option value="apartment">Apartment</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-medium mb-3">What's Included</h3>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={newIncluded}
                onChange={(e) => setNewIncluded(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addIncluded(e)}
                placeholder="Add included item"
                className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
              <button
                onClick={addIncluded}
                type="button"
                className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.included || []).map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeIncluded(item)}
                    className="ml-2 text-indigo-600 hover:text-indigo-900"
                  >
                    <FiX size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-medium mb-3">What's Not Included</h3>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={newExcluded}
                onChange={(e) => setNewExcluded(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addExcluded(e)}
                placeholder="Add excluded item"
                className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
              <button
                onClick={addExcluded}
                type="button"
                className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.excluded || []).map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeExcluded(item)}
                    className="ml-2 text-gray-600 hover:text-gray-900"
                  >
                    <FiX size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-md font-medium mb-3">Itinerary</h3>
            {(formData.itinerary || []).map((day, index) => (
              <div
                key={index}
                className="mb-4 p-4 border border-[var(--border-color)] rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Day {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeItineraryDay(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) =>
                        updateItineraryDay(index, "title", e.target.value)
                      }
                      className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                      placeholder="Day title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={day.location}
                      onChange={(e) =>
                        updateItineraryDay(index, "location", e.target.value)
                      }
                      className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 text-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                      placeholder="Location"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      value={day.description}
                      onChange={(e) =>
                        updateItineraryDay(index, "description", e.target.value)
                      }
                      className="w-full rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 text-sm h-24 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                      placeholder="Day description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Meals Included
                    </label>
                    <div className="flex space-x-4">
                      {["breakfast", "lunch", "dinner"].map((meal) => (
                        <label key={meal} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={day.meals?.includes(meal) || false}
                            onChange={(e) => {
                              const updatedMeals = day.meals || [];
                              if (e.target.checked) {
                                updatedMeals.push(meal);
                              } else {
                                const index = updatedMeals.indexOf(meal);
                                if (index > -1) {
                                  updatedMeals.splice(index, 1);
                                }
                              }
                              updateItineraryDay(index, "meals", [
                                ...updatedMeals,
                              ]);
                            }}
                            className="rounded border-[var(--border-color)] text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm capitalize">
                            {meal}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 p-4 border-2 border-dashed border-[var(--border-color)] rounded-lg">
              <h4 className="text-sm font-medium mb-3">Add New Day</h4>
              <button
                type="button"
                onClick={addItineraryDay}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center justify-center gap-2"
              >
                <span>+</span> Add Day {(formData.itinerary || []).length + 1}
              </button>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 border-b pb-2">
            Project Status Details
          </h2>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
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

            {/* URL fields removed as requested */}
          </div>
        </div>

        {/* Technologies + Tags + Images + Publish */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Technologies */}
          <div className="bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 border-b pb-2">
              Technologies
            </h2>

            {/* Display technologies */}
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
              <CharCountField value={formData.technologies} />
            </div>

            {/* Input + Add button */}
            <div className="flex gap-3">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    document.querySelector("#addTechBtn")?.click();
                  }
                }}
                placeholder='Add technologies (e.g. "React, Next JS, Tailwind CSS")'
                className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
              <button
                id="addTechBtn"
                type="button"
                onClick={() => {
                  if (!newTech.trim()) return;

                  // Split by comma and clean spaces
                  const extractedTechs = newTech
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t.length > 0);

                  // Add all unique technologies
                  setFormData((prev) => ({
                    ...prev,
                    technologies: [
                      ...new Set([...prev.technologies, ...extractedTechs]),
                    ],
                  }));

                  // Clear input field
                  setNewTech("");
                }}
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

            {/* Display Tags */}
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
              <CharCountField value={formData.tags} />
            </div>

            {/* Input Field */}
            <div className="flex gap-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    document.querySelector("#addTagBtn")?.click();
                  }
                }}
                placeholder="Add tags — e.g. #React #NextJS #Tailwind"
                className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />
              <button
                id="addTagBtn"
                type="button"
                onClick={() => {
                  if (!newTag.trim()) return;

                  // Extract tags (keep #)
                  const extractedTags = newTag.match(/#\w+/g) || [];

                  // If no hashtags found, still allow manual entry
                  const finalTags =
                    extractedTags.length > 0
                      ? extractedTags
                      : [
                          newTag.trim().startsWith("#")
                            ? newTag.trim()
                            : `#${newTag.trim()}`,
                        ];

                  // Add unique tags
                  setFormData((prev) => ({
                    ...prev,
                    tags: [...new Set([...prev.tags, ...finalTags])],
                  }));

                  // Clear input
                  setNewTag("");
                }}
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
                placeholder="e.g., /uploads/media-65512.png"
                className="flex-1 rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] px-3 py-2 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
              />

              {formData.mainImage && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[var(--border-color)] shadow-md">
                  <Image
                    src={
                      formData.mainImage.startsWith("http")
                        ? formData.mainImage
                        : `${process.env.NEXT_PUBLIC_API_URL}${formData.mainImage}`
                    }
                    alt="Preview"
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Image Gallery
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {formData.imageGallery.map((img, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--container-color)] shadow-sm"
                >
                  {/* Image Path + Remove Button */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] truncate max-w-[80%]">
                      {img}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeImageFromGallery(img)}
                      className="bg-red-500 hover:bg-red-600 text-white text-[10px] rounded-full px-2 py-[2px] transition"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Image Preview */}
                  <div className="relative w-full h-28 flex items-center justify-center rounded-md overflow-hidden border border-[var(--border-color)] bg-[var(--container-color-in)]">
                    <Image
                      src={
                        img.startsWith("http")
                          ? img
                          : `${process.env.NEXT_PUBLIC_API_URL}${img}`
                      }
                      alt={`Gallery image ${i + 1}`}
                      fill
                      className="object-contain object-center"
                      priority
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="e.g., /uploads/media-554545.png"
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
                  setFormData((p) => ({
                    ...p,
                    isPublished: e.target.checked,
                  }))
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
