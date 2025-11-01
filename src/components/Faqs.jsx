"use client";

import { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Fetch FAQs
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/faqs');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch FAQs');
        }
        
        // Filter only active FAQs
        const activeFaqs = data.data.filter(faq => faq.isActive);
        setFaqs(activeFaqs);
        
        // Expand first FAQ by default if available
        if (activeFaqs.length > 0) {
          setExpandedId(activeFaqs[0]._id);
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError(err.message || 'Failed to load FAQs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaq = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No FAQs available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-8">
      <div className="space-y-2">
        {faqs.map((faq) => (
          <div 
            key={faq._id}
            className="border border-[var(--border-color)] rounded-lg overflow-hidden transition-all duration-200 bg-[var(--container-color-in)]"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
              onClick={() => toggleFaq(faq._id)}
              aria-expanded={expandedId === faq._id}
              aria-controls={`faq-${faq._id}`}
            >
              <span className="font-medium text-lg">
                {faq.question}
              </span>
              {expandedId === faq._id ? (
                <FiChevronUp className="w-5 h-5" />
              ) : (
                <FiChevronDown className="w-5 h-5" />
              )}
            </button>
            
            <div
              id={`faq-${faq._id}`}
              className={`px-6 pb-4 pt-0 transition-all duration-200 border-t border-[var(--border-color)] ${
                expandedId === faq._id ? 'block' : 'hidden'
              }`}
              aria-hidden={expandedId !== faq._id}
            >
              <div className="">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}