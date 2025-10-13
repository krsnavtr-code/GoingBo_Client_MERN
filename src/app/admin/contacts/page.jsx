'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMail, FiSearch, FiFilter, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import ContactStats from '@/components/admin/ContactStats';
import ContactListItem from '@/components/admin/ContactListItem';

const statusFilters = ['all', 'new', 'read', 'replied', 'archived'];

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [statusFilter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/v1/admin/contacts', {
        params: { status: statusFilter === 'all' ? '' : statusFilter }
      });
      setContacts(data.data.contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/v1/admin/contacts/stats');
      setStats(data.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`/api/v1/admin/contacts/${id}`, { status: newStatus });
      await fetchContacts();
      await fetchStats();
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.subject && contact.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Contact Submissions</h1>
          <p className="text-gray-500">Manage and respond to contact form submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            href="/admin/dashboard"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {stats && <ContactStats stats={stats} />}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <FiFilter className="h-4 w-4 text-gray-400" />
            <select
              className="border border-gray-200 rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusFilters.map(filter => (
                <option key={filter} value={filter}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading contacts...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No contacts found
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredContacts.map((contact) => (
                <ContactListItem 
                  key={contact._id} 
                  contact={contact} 
                  onStatusUpdate={handleStatusUpdate}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactsPage;
