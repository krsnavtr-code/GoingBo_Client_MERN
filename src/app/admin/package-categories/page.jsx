"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  
  // Convert children to array and clone the first child to add drag handle
  const childrenArray = React.Children.toArray(children);
  const firstChild = childrenArray[0];
  
  const firstChildWithProps = firstChild ? React.cloneElement(firstChild, {
    'data-drag-handle': true,
    ...attributes,
    ...listeners,
  }) : null;

  return (
    <tr ref={setNodeRef} style={style}>
      {firstChildWithProps}
      {childrenArray.slice(1)}
    </tr>
  );
};

export default function ITCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "folder",
    isActive: true,
  });
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/v1/it-categories");
      const data = await res.json();
      if (data.status === "success") setCategories(data.data.categories);
    } catch (err) {
      showToast("Failed to load categories", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editingCategory
        ? `/api/v1/it-categories/${editingCategory._id}`
        : "/api/v1/it-categories";
      const method = editingCategory ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save category");
      showToast(editingCategory ? "Category updated" : "Category created");
      fetchCategories();
      closeModal();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;
    try {
      const res = await fetch(`/api/v1/it-categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");
      showToast("Category deleted");
      fetchCategories();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || "",
      icon: cat.icon || "folder",
      isActive: cat.isActive !== false,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", description: "", icon: "folder", isActive: true });
  };

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = categories.findIndex((c) => c._id === active.id);
    const newIndex = categories.findIndex((c) => c._id === over.id);
    const newOrder = arrayMove(categories, oldIndex, newIndex);
    setCategories(newOrder);

    // Update DB
    try {
      await fetch("/api/v1/it-categories/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: newOrder.map((c, i) => ({ _id: c._id, order: i })),
        }),
      });
    } catch {
      showToast("Failed to update order", "error");
      fetchCategories();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 text-[var(--text-color)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Package Categories</h1>
          <p className="text-gray-500">Manage your Package categories</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center bg-[var(--button-bg-color)] text-[var(--button-color)] px-4 py-2 rounded-lg hover:bg-[var(--button-hover-color)] cursor-pointer transition"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </button>
      </div>

      {toast && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full table-auto rounded-lg overflow-hidden">
            <thead className="bg-[var(--container-color-in)]">
              <tr>
                <th className="p-2 w-10">#</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <SortableContext
              items={categories.map((c) => c._id)}
              strategy={verticalListSortingStrategy}
            >
              <tbody className="bg-[var(--container-color-in)] border-t border-[var(--border-color)]">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      Loading...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <SortableItem key={cat._id} id={cat._id}>
                      <td className="p-2 cursor-move">
                        <GripVertical className="h-4 w-4" />
                      </td>
                      <td className="p-2 font-medium">{cat.name}</td>
                      <td className="p-2 text-gray-500">
                        {cat.description || "No description"}
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${
                            cat.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-2 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="p-1 rounded cursor-pointer "
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(cat._id);
                            }}
                            className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </SortableItem>
                  ))
                )}
              </tbody>
            </SortableContext>
          </table>
        </DndContext>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
          <div className="bg-[var(--container-color-in)] border border-[var(--border-color)] w-full max-w-lg rounded-xl shadow-lg p-6 relative">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Category Name"
                  className="w-full border border-[var(--border-color)] bg-[var(--container-color)] text-[var(--text-color)] rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Description"
                  className="w-full border border-[var(--border-color)] bg-[var(--container-color)] text-[var(--text-color)] rounded px-3 py-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-[var(--border-color)] text-[var(--button-bg-color)] focus:ring-[var(--button-bg-color)]"
                />
                <label className="text-sm font-medium">Active</label>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-1 border rounded bg-[var(--button-bg-color)] text-[var(--button-color)] hover:bg-[var(--button-hover-color)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1 bg-[var(--button-bg-color)] text-[var(--button-color)] rounded hover:bg-[var(--button-hover-color)] cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
