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
      className="hover:bg-[var(--container-color)] text-[var(--text-color)] transition-colors"
    >
      <Link href={`/admin/contacts/${contact._id}`} as={`/admin/contacts/${contact._id}`}>
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-[var(--button-bg-color)] text-[var(--button-color)]">
                {statusIcons[currentStatus]}
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <p className="text-sm font-medium">{contact.name}</p>
                  <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {currentStatus}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-color-light)]">{contact.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-sm text-[var(--text-color-light)] mr-4 flex items-center">
                <FiClock className="mr-1 h-4 w-4" />
                {formatDate(contact.createdAt)}
              </div>
              <FiChevronRight className="h-5 w-5 text-[var(--text-color-light)]" />
            </div>
          </div>
          {contact.subject && (
            <div className="mt-2">
              <p className="text-sm text-[var(--text-color-light)] line-clamp-1">
                <span className="font-medium">Subject:</span> {contact.subject}
              </p>
            </div>
          )}
        </div>
      </Link>
      
      <div className="px-4 py-2 bg-[var(--container-color-in)] flex justify-between items-center">
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-[var(--button-color)] bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--button-bg-color)]"
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
                    className={`w-full text-left px-4 py-2 text-sm flex items-center cursor-pointer ${
                      currentStatus === option.value 
                        ? 'bg-[var(--button-bg-color)] text-[var(--button-color)]' 
                        : 'text-[var(--text-color)] bg-[var(--container-color-in)] hover:bg-[var(--button-bg-hover-color)] hover:text-[var(--button-color)]'
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
