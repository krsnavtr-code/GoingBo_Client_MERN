import { useState } from 'react';
import Link from 'next/link';
import { 
  FiMail, 
  FiClock, 
  FiChevronRight, 
  FiMessageSquare,
  FiEye,
  FiArchive,
  FiCheck
} from 'react-icons/fi';

const statusIcons = {
  new: <FiMail className="h-4 w-4 text-blue-500" />,
  read: <FiEye className="h-4 w-4 text-green-500" />,
  replied: <FiMessageSquare className="h-4 w-4 text-purple-500" />,
  archived: <FiArchive className="h-4 w-4 text-gray-500" />
};

const statusOptions = [
  { value: 'new', label: 'Mark as New', icon: <FiMail className="h-4 w-4 mr-2" /> },
  { value: 'read', label: 'Mark as Read', icon: <FiEye className="h-4 w-4 mr-2" /> },
  { value: 'replied', label: 'Mark as Replied', icon: <FiMessageSquare className="h-4 w-4 mr-2" /> },
  { value: 'archived', label: 'Archive', icon: <FiArchive className="h-4 w-4 mr-2" /> }
];

export default function ContactListItem({ contact, onStatusUpdate }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(contact.status);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setCurrentStatus(newStatus);
      setIsDropdownOpen(false);
      await onStatusUpdate(contact._id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <li 
      key={contact._id}
      className="hover:bg-gray-50 transition-colors"
    >
      <Link href={`/admin/contacts/${contact._id}`}>
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                {statusIcons[currentStatus] || <FiMail className="h-5 w-5 text-gray-400" />}
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                  <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {currentStatus}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{contact.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-sm text-gray-500 mr-4 flex items-center">
                <FiClock className="mr-1 h-4 w-4" />
                {formatDate(contact.createdAt)}
              </div>
              <FiChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {contact.subject && (
            <div className="mt-2">
              <p className="text-sm text-gray-700 line-clamp-1">
                <span className="font-medium">Subject:</span> {contact.subject}
              </p>
            </div>
          )}
        </div>
      </Link>
      
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            Change Status
          </button>

          {isDropdownOpen && (
            <div className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center ${
                      currentStatus === option.value 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleStatusChange(option.value);
                    }}
                  >
                    {option.icon}
                    {option.label}
                    {currentStatus === option.value && (
                      <FiCheck className="ml-auto h-4 w-4 text-green-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <a 
          href={`mailto:${contact.email}${contact.subject ? `?subject=Re: ${contact.subject}` : ''}`}
          className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          Reply
        </a>
      </div>
    </li>
  );
}
