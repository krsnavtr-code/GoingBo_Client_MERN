"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import axios from "axios";

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "frontend",
    level: 3,
    icon: "code",
  });
  const router = useRouter();

  // Skill categories
    const skillCategories = [
    { value: "", label: "Select Category" },
    { value: "frontend", label: "Frontend" },
    { value: "backend", label: "Backend" },
    { value: "database", label: "Database" },
    { value: "devops", label: "DevOps" },
    { value: "mobile", label: "Mobile" },
    { value: "other", label: "Other" },
  ];

  // Fetch skills
  const fetchSkills = async () => {
    try {
      const { data } = await axios.get("/api/v1/admin/skills");
      setSkills(data.data.skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "level" ? parseInt(value, 10) : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (currentSkill) {
        // Update existing skill
        await axios.patch(`/api/v1/admin/skills/${currentSkill._id}`, formData);
        toast.success("Skill updated successfully");
      } else {
        // Create new skill
        await axios.post("/api/v1/admin/skills", formData);
        toast.success("Skill created successfully");
      }
      setIsModalOpen(false);
      setCurrentSkill(null);
      setFormData({ name: "", category: "frontend", level: 3, icon: "code" });
      fetchSkills();
    } catch (error) {
      console.error("Error saving skill:", error);
      toast.error(error.response?.data?.message || "Failed to save skill");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit skill
  const handleEdit = (skill) => {
    setCurrentSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon || "code",
    });
    setIsModalOpen(true);
  };

  // Handle delete skill
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    try {
      setIsDeleting(id);
      await axios.delete(`/api/v1/admin/skills/${id}`);
      toast.success("Skill deleted successfully");
      fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill");
    } finally {
      setIsDeleting(false);
    }
  };

  // Render skill level as stars
  const renderLevelStars = (level) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <span
          key={i}
          className={`text-lg ${
            i < level ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Skills Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] text-[var(--button-color)] px-4 py-2 rounded-md flex items-center gap-2"
        >
          <FaPlus /> Add Skill
        </button>
      </div>

      {/* Skills Table */}
      <div className="rounded-lg shadow overflow-hidden">
        {loading && !skills.length ? (
          <div className="flex justify-center items-center p-8">
            <FaSpinner className="animate-spin text-2xl text-[var(--button-color)]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--container-color)]">
              <thead className="bg-[var(--container-color-in)] text-[var(--text-color)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[var(--container-color-in)] divide-y divide-gray-200">
                {skills.map((skill) => (
                  <tr
                    key={skill._id}
                    className="hover:bg-[var(--container-color-in)]"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-[var(--container-color)] rounded-md">
                          <span className="text-[var(--text-color)] text-lg">
                            {skill.icon || "💻"}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">
                            {skill.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[var(--container-color)] text-[var(--text-color)] capitalize">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex bg-[var(--container-color)] rounded-md px-2 py-0 ">
                        {renderLevelStars(skill.level)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="text-[var(--button-bg-color)] hover:text-[var(--button-hover-color)] mr-4"
                      >
                        <FaEdit className="inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill._id)}
                        className="text-[var(--button-bg-color)] hover:text-[var(--button-hover-color)]"
                        disabled={isDeleting === skill._id}
                      >
                        {isDeleting === skill._id ? (
                          <FaSpinner className="animate-spin inline" />
                        ) : (
                          <FaTrash className="inline" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
                {!skills.length && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-[var(--text-color-light)]"
                    >
                      No skills found. Add your first skill!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--container-color-in)] text-[var(--text-color)] border rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {currentSkill ? "Edit Skill" : "Add New Skill"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="MERN Stack"
                    className="w-full px-3 py-2 border border rounded-md focus:outline-none focus:ring-1"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border rounded-md focus:outline-none focus:ring-1"
                    required
                  >
                    {skillCategories.map((category) => (
                      <option
                        key={category.value}
                        value={category.value}
                        className="text-[var(--text-color)] bg-[var(--container-color)]"
                      >
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Proficiency Level
                  </label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      name="level"
                      min="1"
                      max="5"
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full h-2 bg-[var(--container-color)] rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-3 text-lg bg-[var(--container-color)] text-[var(--text-color)] rounded-md px-2 py-0">
                      {renderLevelStars(formData.level)}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Icon (Emoji or Icon Code)
                  </label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border rounded-md focus:outline-none focus:ring-1"
                    placeholder="e.g., 💻 or code"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setCurrentSkill(null);
                      setFormData({
                        name: "",
                        category: "",
                        level: 4,
                        icon: "",
                      });
                    }}
                    className="px-4 py-2 border rounded-md text-[var(--text-color)] cursor-pointer hover:bg-[var(--container-color-in)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[var(--button-bg-color)] text-[var(--button-color)] cursor-pointer rounded-md hover:bg-[var(--button-hover-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : currentSkill ? (
                      "Update Skill"
                    ) : (
                      "Add Skill"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsPage;
