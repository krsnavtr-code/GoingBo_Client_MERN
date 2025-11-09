"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ProfileManagement() {
  const [formData, setFormData] = useState({
    image: "",
    role: "",
    name: "",
    description: "",
    sortDescription: "",
    experience: "",
    projects: "",
    cvPdf: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile from:', `${process.env.NEXT_PUBLIC_API_URL}/admin/profile`);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/profile`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        console.log('Profile API Response:', data);

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        if (data.data && data.data.profile) {
          const profile = data.data.profile;
          setFormData({
            image: profile.image || "",
            role: profile.role || "",
            name: profile.name || "",
            description: profile.description || "",
            sortDescription: profile.sortDescription || "",
            experience: profile.experience || "",
            projects: profile.projects || "",
            cvPdf: profile.cvPdf || "",
          });
        } else {
          console.error('Unexpected response format:', data);
          toast.error("Profile data not found in the expected format");
        }
      } catch (error) {
        toast.error(error.message || "Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      if (data.success) {
        toast.success("Profile updated successfully");
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Error updating profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="bg-[var(--container-color-in)] rounded-lg shadow p-6 border border-[var(--border-color)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--text-color)]">
        Profile Management
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar URL */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {formData.image ? (
                  <img
                    src={(() => {
                      // Handle both direct URLs and env variable format
                      if (
                        formData.image.includes(
                          "process.env.NEXT_PUBLIC_API_URL"
                        )
                      ) {
                        // Extract the path part from format: process.env.NEXT_PUBLIC_API_URL + "/path"
                        const pathMatch =
                          formData.image.match(/\+\s*"([^"]+)"/);
                        const path = pathMatch ? pathMatch[1] : "";
                        return process.env.NEXT_PUBLIC_API_URL + path;
                      }
                      return formData.image;
                    })()}
                    alt="Profile Preview"
                    className="h-16 w-16 rounded-full object-cover border-2 border-[var(--container-color)]"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/64";
                      e.target.className =
                        "h-16 w-16 rounded-full bg-[var(--container-color)] flex items-center justify-center text-[var(--text-color)]";
                    }}
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-[var(--container-color)] flex items-center justify-center text-[var(--text-color)]">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-[var(--text-color)] mb-1"
                >
                  Avatar URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-2 border border-[var(--container-color)] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--container-color)] text-[var(--text-color)]"
                />
              </div>
            </div>
            {formData.image && (
              <p className="text-xs text-[var(--text-color)]">
                Live preview of your avatar
              </p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[var(--text-color)] mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[var(--container-color)] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--container-color)] text-[var(--text-color)]"
            />
          </div>

          {/* Job Title */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-[var(--text-color)] mb-1"
            >
              Job Title
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[var(--container-color)] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--container-color)] text-[var(--text-color)]"
            />
          </div>

          {/* Experience */}
          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-[var(--text-color)] mb-1"
            >
              Years of Experience
            </label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              step="0.1"
              min="0"
              required
              className="w-full px-4 py-2 border border-[var(--container-color)] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--container-color)] text-[var(--text-color)]"
            />
          </div>

          {/* Projects */}
          <div>
            <label
              htmlFor="projects"
              className="block text-sm font-medium text-[var(--text-color)] mb-1"
            >
              Projects Completed
            </label>
            <input
              type="number"
              id="projects"
              name="projects"
              value={formData.projects}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-4 py-2 border border-[var(--container-color)] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--container-color)] text-[var(--text-color)]"
            />
          </div>

          {/* CV URL */}
          <div>
            <label
              htmlFor="cvPdf"
              className="block text-sm font-medium text-[var(--text-color)] mb-1"
            >
              CV/Resume URL
            </label>
            <input
              type="text"
              id="cvPdf"
              name="cvPdf"
              value={formData.cvPdf}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[var(--container-color)] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--container-color)] text-[var(--text-color)]"
            />
          </div>

          {/* Main Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-[var(--text-color)] mb-1"
            >
              Main Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              required
              className="w-full px-4 py-2 border border-[var(--container-color)] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--container-color)] text-[var(--text-color)]"
            />
          </div>

          {/* Short Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="sortDescription"
              className="block text-sm font-medium text-[var(--text-color)] mb-1"
            >
              Short Description
            </label>
            <input
              type="text"
              id="sortDescription"
              name="sortDescription"
              value={formData.sortDescription}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[var(--container-color)] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[var(--container-color)] text-[var(--text-color)]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[var(--button-bg-color)] text-[var(--button-color)] font-medium rounded-md hover:bg-[var(--button-hover-color)] cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
