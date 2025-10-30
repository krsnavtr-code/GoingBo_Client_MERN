'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiArrowUp, FiArrowDown, FiCopy } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const PackagesPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const router = useRouter();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProjects();
  }, [currentPage, sortConfig, searchTerm]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/packages?page=${currentPage}&limit=${itemsPerPage}` +
          `&sort=${sortConfig.direction === "asc" ? "" : "-"}${
            sortConfig.key
          }` +
          `${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      setProjects(data.data.projects);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this project?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await fetch(`/api/v1/packages/${id}`, {
                method: "DELETE",
                credentials: "include",
              });

              if (!response.ok) {
                throw new Error("Failed to delete project");
              }

              toast.success("Project deleted successfully");
              fetchProjects();
            } catch (error) {
              console.error("Error deleting project:", error);
              toast.error(error.message);
            }
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/v1/packages/${id}/toggle-publish`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update project status");
      }

      const data = await response.json();
      toast.success(
        `Package ${!currentStatus ? "published" : "unpublished"} successfully`
      );
      fetchProjects();
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error(error.message);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const response = await fetch(`/api/v1/packages/${id}/duplicate`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to duplicate package");
      }

      const data = await response.json();
      toast.success("Package duplicated successfully!");
      fetchProjects();
      
      // Navigate to edit the duplicated package
      router.push(`/admin/packages/edit/${data.data.package._id}`);
    } catch (error) {
      console.error("Error duplicating package:", error);
      toast.error(error.message);
    }
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <FiArrowUp /> : <FiArrowDown />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container text-[var(--text-color)] mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">All Packages</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search packages..."
              className="input input-bordered w-full md:w-64 rounded pr-10 py-2 px-2 bg-[var(--container-color-in)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>
          <Link
            href="/admin/packages/new"
            className="rounded-full px-3 py-2 flex items-center bg-[var(--button-bg-color)] text-[var(--button-color)] hover:bg-[var(--button-hover-color)]"
          >
            <FiPlus className="mr-2" /> Add Package
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow p-5 bg-[var(--container-color-in)]">
        <table className="w-full table-auto rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="w-5">#</th>
              <th className="">Media</th>
              <th>
                <button
                  className="flex items-center gap-1"
                  onClick={() => requestSort("title")}
                >
                  Title {getSortIcon("title")}
                </button>
              </th>
              <th className="text-center">
                <button
                  className="flex items-center justify-center gap-1 w-full"
                  onClick={() => requestSort("status")}
                >
                  Status {getSortIcon("status")}
                </button>
              </th>
              <th className="text-center">
                <button
                  className="flex items-center justify-center gap-1 w-full"
                  onClick={() => requestSort("createdAt")}
                >
                  Created {getSortIcon("createdAt")}
                </button>
              </th>
              <th>
                <button
                  className="flex items-center justify-center gap-1 w-full"
                  onClick={() => requestSort("updatedAt")}
                >
                  Updated {getSortIcon("updatedAt")}
                </button>
              </th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="border-t border-[var(--border-color)]">
            {projects.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  No packages found. Create your first package!
                </td>
              </tr>
            ) : (
              projects.map((project, index) => (
                <tr key={project._id} className="hover">
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>
                    {project.mainImage && (
                      <div className="avatar">
                        <div className="w-12 h-12 rounded">
                          <img
                            src={
                              project.mainImage.startsWith("http")
                                ? project.mainImage
                                : `${process.env.NEXT_PUBLIC_API_URL}${project.mainImage}`
                            }
                            alt={project.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-semibold">{project.title}</div>
                        <div className="text-sm opacity-50">
                          {project.shortDescription?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge ${
                        project.status === "completed"
                          ? "badge-success"
                          : project.status === "in_progress"
                          ? "badge-info"
                          : "badge-warning"
                      }`}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="text-center">
                    {format(new Date(project.createdAt), "d MMM, yy")}
                  </td>
                  <td className="text-center">
                    {format(new Date(project.updatedAt), "d MMM, yy")}
                  </td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button
                        className="btn btn-ghost btn-xs cursor-pointer"
                        onClick={() =>
                          togglePublish(project._id, project.isPublished)
                        }
                        title={project.isPublished ? "Unpublish" : "Publish"}
                      >
                        {project.isPublished ? <FiEye /> : <FiEyeOff />}
                      </button>
                      <button
                        onClick={() => handleDuplicate(project._id)}
                        className="btn btn-ghost btn-xs cursor-pointer"
                        title="Duplicate"
                      >
                        <FiCopy />
                      </button>
                      <Link
                        href={`/admin/packages/edit/${project._id}`}
                        className="btn btn-ghost btn-xs cursor-pointer"
                      >
                        <FiEdit />
                      </Link>
                      <button
                        className="btn btn-ghost btn-xs text-error cursor-pointer"
                        onClick={() => handleDelete(project._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="btn-group">
            <button
              className="btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              «
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  className={`btn ${
                    currentPage === pageNum ? "btn-active" : ""
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagesPage;
