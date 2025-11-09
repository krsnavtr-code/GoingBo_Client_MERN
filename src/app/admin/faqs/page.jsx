"use client";

import { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi';

export default function FaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    isActive: true,
  });

  // Fetch FAQs
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faqs`);
      const data = await res.json();
      if (data.success) {
        setFaqs(data.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      alert('Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = currentFaq 
        ? `${process.env.NEXT_PUBLIC_API_URL}/faqs/${currentFaq._id}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/faqs`;
      const method = currentFaq ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error saving FAQ');
      }

      alert(currentFaq ? 'FAQ updated successfully!' : 'FAQ created successfully!');
      setIsDialogOpen(false);
      fetchFaqs();
      resetForm();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert(error.message || 'Failed to save FAQ');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete FAQ
  const deleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faqs/${id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete FAQ');
      }
      
      alert('FAQ deleted successfully');
      fetchFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert(error.message || 'Failed to delete FAQ');
    }
  };

  // Toggle FAQ status
  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faqs/${id}/toggle`, {
        method: 'PATCH',
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update status');
      }
      
      fetchFaqs();
    } catch (error) {
      console.error('Error toggling FAQ status:', error);
      alert(error.message || 'Failed to update status');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      isActive: true,
    });
    setCurrentFaq(null);
  };

  // Open dialog for add/edit
  const openDialog = (faq = null) => {
    if (faq) {
      setCurrentFaq(faq);
      setFormData({
        question: faq.question,
        answer: faq.answer,
        isActive: faq.isActive,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  // Close dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage FAQs</h1>
        <button
          onClick={() => openDialog()}
          className="flex items-center gap-2 bg-[var(--button-bg-color)] text-[var(--button-color)] px-4 py-2 rounded-lg hover:bg-[var(--button-hover-color)] transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Add New FAQ
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-[var(--container-color-in)] rounded-lg shadow overflow-hidden">
          {faqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No FAQs found. Create your first FAQ to get started.
              </p>
              <button
                onClick={() => openDialog()}
                className="mt-4 bg-[var(--button-bg-color)] text-[var(--button-color)] px-4 py-2 rounded-lg hover:bg-[var(--button-hover-color)] transition-colors"
              >
                Create FAQ
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--border-color)]">
                <thead className="">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Answer
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {faqs.map((faq) => (
                    <tr key={faq._id} className="">
                      <td className="px-6 py-4 whitespace-normal">
                        <div className="text-sm font-medium">
                          {faq.question}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm line-clamp-2">{faq.answer}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleStatus(faq._id, faq.isActive)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            faq.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {faq.isActive ? (
                            <>
                              <FiCheck className="mr-1" /> Active
                            </>
                          ) : (
                            <>
                              <FiX className="mr-1" /> Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => openDialog(faq)}
                            className="text-[var(--text-color)] hover:text-[var(--button-hover-color)] cursor-pointer"
                            title="Edit"
                          >
                            <FiEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteFaq(faq._id)}
                            className="text-[var(--text-color)] hover:text-[var(--button-hover-color)] cursor-pointer"
                            title="Delete"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit FAQ Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--container-color-in)] border border-[var(--border-color)] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[var(--text-color)]">
                  {currentFaq ? "Edit FAQ" : "Add New FAQ"}
                </h2>
                <button
                  onClick={closeDialog}
                  className="text-[var(--text-color)] hover:text-[var(--button-hover-color)] cursor-pointer"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="question"
                    className="block text-sm font-medium mb-1"
                  >
                    Question <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter question"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="answer"
                    className="block text-sm font-medium mb-1"
                  >
                    Answer <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="answer"
                    name="answer"
                    value={formData.answer}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter detailed answer"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm">
                    Active
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-[var(--border-color)] rounded-md shadow-sm text-sm font-medium text-[var(--button-text-color)] bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {currentFaq ? "Updating..." : "Creating..."}
                      </>
                    ) : currentFaq ? (
                      "Update FAQ"
                    ) : (
                      "Create FAQ"
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
}