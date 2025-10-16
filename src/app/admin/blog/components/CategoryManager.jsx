'use client';

import { useState } from 'react';
import { FiPlus, FiX, FiTag, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

const CategoryManager = ({ categories = [], onAddCategory, onDeleteCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [isEditing, setIsEditing] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    const categoryData = { 
      name: categoryName.trim(), 
      description: categoryDesc.trim() 
    };

    if (isEditing) {
      onAddCategory({ ...categoryData, _id: isEditing });
    } else {
      onAddCategory(categoryData);
    }
    
    setCategoryName('');
    setCategoryDesc('');
    setIsEditing(null);
    setIsOpen(false);
  };

  const handleEdit = (category) => {
    setCategoryName(category.name);
    setCategoryDesc(category.description || '');
    setIsEditing(category._id);
    setIsOpen(true);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Categories</h2>
        <button
          onClick={() => {
            setIsEditing(null);
            setCategoryName('');
            setCategoryDesc('');
            setIsOpen(true);
          }}
          className="flex items-center gap-2 text-sm bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] text-[var(--button-color)] px-3 py-1.5 rounded cursor-pointer"
        >
          <FiPlus size={14} /> Add Category
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <div 
            key={category._id}
            className="group flex items-center gap-2 bg-[var(--button-bg-color)] text-[var(--button-color)] px-3 py-1.5 rounded-full text-sm"
          >
            <FiTag size={14} />
            <div className="flex items-center gap-1.5">
              <span>{category.name}</span>
              <span className="text-xs text-red-600 px-1.5 py-0.5 rounded-full">
                {category.blogCount || 0}
              </span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleEdit(category)}
                className="text-[var(--button-color)] cursor-pointer"
                title="Edit category"
              >
                <FiEdit2 size={14} />
              </button>
              <button
                onClick={() => onDeleteCategory(category._id)}
                className="text-[var(--button-color)] cursor-pointer"
                title="Delete category"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Category Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-transparent border border flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--container-color-in)] p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setIsEditing(null);
                }} 
                className="text-red-600 cursor-pointer"
              >
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full p-2 border rounded bg-[var(--container-color)]"
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={categoryDesc}
                  onChange={(e) => setCategoryDesc(e.target.value)}
                  className="w-full p-2 border rounded bg-[var(--container-color)]"
                  rows="3"
                  placeholder="Enter category description (optional)"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsEditing(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-[var(--button-color)] bg-[var(--button-bg-color)] rounded hover:bg-[var(--button-hover-color)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-[var(--button-color)] bg-[var(--button-bg-color)] rounded hover:bg-[var(--button-hover-color)] cursor-pointer"
                >
                  {isEditing ? 'Update' : 'Add'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
