'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiMail, 
  FiClock, 
  FiMessageSquare,
  FiEye,
  FiArchive,
  FiTrash2
} from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ContactDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/v1/admin/contacts/${id}`);
        setContact(data.data.contact);
        setStatus(data.data.contact.status);
      } catch (error) {
        console.error('Error fetching contact:', error);
        toast.error('Failed to load contact details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContact();
    }
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      setStatus(newStatus);
      await axios.patch(`/api/v1/admin/contacts/${id}`, { status: newStatus });
      toast.success('Status updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'new':
        return <FiMail className="h-4 w-4 text-blue-500" />;
      case 'read':
        return <FiEye className="h-4 w-4 text-green-500" />;
      case 'replied':
        return <FiMessageSquare className="h-4 w-4 text-purple-500" />;
      case 'archived':
        return <FiArchive className="h-4 w-4 text-gray-500" />;
      default:
        return <FiMail className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Contact not found</h2>
          <p className="text-gray-600 mb-6">The requested contact could not be found.</p>
          <Link 
            href="/admin/contacts" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Contacts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/admin/contacts" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <FiArrowLeft className="mr-1" /> Back to Contacts
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {contact.subject || 'No Subject'}
            </h1>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <span className="flex items-center">
                {getStatusIcon()}
                <span className="ml-1 capitalize">{status}</span>
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <FiClock className="mr-1 h-3.5 w-3.5" />
                {new Date(contact.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              className="text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={status}
              onChange={(e) => updateStatus(e.target.value)}
            >
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
            <a
              href={`mailto:${contact.email}${contact.subject ? `?subject=Re: ${contact.subject}` : ''}`}
              className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Reply
            </a>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">{contact.name}</p>
              <p className="text-sm text-gray-500">{contact.email}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{contact.message}</p>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <p>Submitted on {new Date(contact.createdAt).toLocaleDateString()}</p>
            {contact.updatedAt !== contact.createdAt && (
              <p>Last updated on {new Date(contact.updatedAt).toLocaleString()}</p>
            )}
          </div>
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={() => {
              if (window.confirm('Are you sure you want to archive this contact?')) {
                updateStatus('archived');
              }
            }}
          >
            <FiArchive className="mr-1.5 h-4 w-4" />
            Archive
          </button>
        </div>
      </div>
    </div>
  );
}
