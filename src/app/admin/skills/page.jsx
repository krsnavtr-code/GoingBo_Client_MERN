"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import axios from "axios";

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [itCategories, setItCategories] = useState([{ value: "", label: "Loading categories..." }]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    level: 3,
    icon: "code",
  });
  const router = useRouter();

  const filteredSkills = skills.filter(
    (skill) => !categoryFilter || skill.category === categoryFilter
  );

  // Fetch IT categories
  const fetchItCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/it-categories");
      
      // Extract categories from the response
      const categories = data.data?.categories || [];
      
      // Format categories for the select component
      const formattedCategories = categories.map(category => ({
        value: category._id,
        label: category.name
      }));
      
      // Add the default "Select Category" option
      const allCategories = [
        { value: "", label: "Select Category" },
        ...formattedCategories
      ];
      
      setItCategories(allCategories);
      
      // Set default category if not set
      if (!formData.category && categories.length > 0) {
        setFormData(prev => ({ ...prev, category: categories[0].value }));
      }
    } catch (error) {
      console.error("Error fetching IT categories:", error);
      toast.error("Failed to load IT categories");
      setItCategories([{ value: "", label: "Failed to load categories" }]);
    }
  };

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
    const fetchData = async () => {
      await fetchItCategories();
      await fetchSkills();
    };
    fetchData();
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
    
    // Validate category
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      setLoading(true);
      
      // Prepare the data to send with the category ID
      const skillData = {
        name: formData.name,
        category: formData.category, // Send the category ID directly
        level: formData.level,
        icon: formData.icon || "code"
      };

      if (currentSkill) {
        // Update existing skill
        await axios.patch(`/api/v1/admin/skills/${currentSkill._id}`, skillData);
        toast.success("Skill updated successfully");
      } else {
        // Create new skill
        await axios.post("/api/v1/admin/skills", skillData);
        toast.success("Skill created successfully");
      }
      
      // Reset form and refresh data
      setIsModalOpen(false);
      setCurrentSkill(null);
      setFormData({ 
        name: "", 
        category: "", // Reset to empty to show the "Select Category" placeholder
        level: 3, 
        icon: "code" 
      });
      
      // Refresh the skills list
      await fetchSkills();
      
    } catch (error) {
      console.error("Error saving skill:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save skill";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit skill
  const handleEdit = (skill) => {
    setCurrentSkill(skill);
    
    // Set the category ID directly from the skill data
    setFormData({
      name: skill.name,
      category: skill.category?._id || skill.category || "",
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
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border rounded-md bg-[var(--container-color)] text-[var(--text-color)] focus:outline-none focus:ring-1"
        >
          <option value="">All Categories</option>
          {itCategories
            .filter((cat) => cat.value !== "") // Exclude the empty value option
            .map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
        </select>
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
          <div className="overflow-x-auto border border-[var(--border-color)]">
            <table className="min-w-full divide-y divide-[var(--border-color)]">
              <thead className="bg-[var(--container-color-in)] text-[var(--text-color)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Icon
                  </th>
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
              <tbody className="bg-[var(--container-color-in)] divide-y divide-[var(--border-color)]">
                {filteredSkills.map((skill) => (
                  <tr
                    key={skill._id}
                    className="hover:bg-[var(--container-color-in)]"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-[var(--container-color)] rounded-md">
                        <span className="text-[var(--text-color)] text-lg">
                          {skill.icon ? (
                            <img
                              src={
                                skill.icon?.includes(
                                  "process.env.NEXT_PUBLIC_API_URL"
                                )
                                  ? process.env.NEXT_PUBLIC_API_URL +
                                    skill.icon.split('"')[1]
                                  : skill.icon || "/avatar.png"
                              }
                              alt="icon"
                              className="w-8 h-8 inline-block object-cover rounded-full"
                              onError={(e) => {
                                e.target.src = "/avatar.png";
                              }}
                            />
                          ) : (
                            "💻"
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{skill.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[var(--container-color)] text-[var(--text-color)] capitalize">
                        {typeof skill.category === 'object' ? skill.category.name : skill.category}
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
                    className="w-full px-3 py-2 bg-[var(--container-color)] rounded-md focus:outline-none focus:ring-1"
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
                    className="w-full px-3 py-2 bg-[var(--container-color)] rounded-md focus:outline-none focus:ring-1"
                    required
                  >
                    {itCategories.map((category, index) => (
                      <option
                        key={category.value || `category-${index}`}
                        value={category.value}
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
                    className="w-full px-3 py-2 bg-[var(--container-color)] rounded-md focus:outline-none focus:ring-1"
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
                    className="px-4 py-2 border rounded-md text-[var(--button-color)] cursor-pointer hover:bg-[var(--button-hover-color)] bg-[var(--button-bg-color)]"
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
