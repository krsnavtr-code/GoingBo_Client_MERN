"use client";

import { useEffect, useState } from "react";
import {
  FaCode,
  FaServer,
  FaDatabase,
  FaMobileAlt,
  FaCloud,
  FaTools,
} from "react-icons/fa";
import axios from "axios";

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([
    { _id: "all", name: "All Skills", icon: <FaTools className="mr-2" /> },
  ]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  const getCategoryIcon = (categoryId) => {
    if (categoryId === "all") return <FaTools className="mr-2" />;
    const category = categories.find((c) => c._id === categoryId || c.name.toLowerCase() === categoryId.toLowerCase());
    if (category) return category.icon;
    
    // Fallback to default icons based on category name
    const iconMap = {
      frontend: <FaCode className="mr-2" />,
      backend: <FaServer className="mr-2" />,
      database: <FaDatabase className="mr-2" />,
      devops: <FaCloud className="mr-2" />,
      mobile: <FaMobileAlt className="mr-2" />,
    };
    return iconMap[categoryId?.toLowerCase()] || <FaTools className="mr-2" />;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both skills and categories in parallel
        const [skillsRes, categoriesRes] = await Promise.all([
          axios.get("/api/v1/skills"),
          axios.get("/api/v1/it-categories"),
        ]);

        setSkills(skillsRes.data.data.skills);
        
        // Format categories for the UI
        const formattedCategories = [
          { _id: "all", name: "All Skills", icon: <FaTools className="mr-2" /> },
          ...(categoriesRes.data.data?.categories || []).map(cat => ({
            _id: cat._id,
            name: cat.name,
            icon: getCategoryIcon(cat.name)
          }))
        ];
        
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSkills = skills.filter((skill) => {
    if (activeCategory === "all") return true;
    
    // Handle both string and object categories
    const categoryId = typeof skill.category === 'object' 
      ? skill.category._id?.toString() 
      : skill.category?.toString();
      
    return categoryId === activeCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--container-color)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--container-color)] text-[var(--text-color)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
            My Skills
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl  sm:mt-4">
            Technologies and tools I work with
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setActiveCategory(category._id)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer ${
                activeCategory === category._id
                  ? "bg-[var(--primary-color-in)] text-[var(--text-color)]"
                  : "bg-[var(--container-color-in)] text-[var(--text-color)] hover:bg-[var(--primary-color-in)]"
              } shadow-sm border border-gray-200`}
            >
              {getCategoryIcon(category._id)}
              {category.name}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill._id}
              className="bg-[var(--container-color-in)] border border-gray-200 text-[var(--text-color)] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-0 rounded-sm bg-[var(--container-color)] text-[var(--text-color)]">
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
                    </div>
                    <h3 className="ml-4 text-lg font-semibold">{skill.name}</h3>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold bg-[var(--container-color)] rounded-full">
                    {typeof skill.category === 'object' 
                      ? skill.category?.name || 'Other'
                      : (skill.category?.charAt(0)?.toUpperCase() || '') + 
                        (skill.category?.slice(1) || 'other')
                    }
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>Proficiency</span>
                    <div className="flex rounded bg-[var(--container-color)] px-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`${
                            i < skill.level
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No skills found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsPage;
