import { FiMail, FiEye, FiMessageSquare, FiArchive } from 'react-icons/fi';

const statusIcons = {
  new: <FiMail className="h-5 w-5 text-blue-500" />,
  read: <FiEye className="h-5 w-5 text-green-500" />,
  replied: <FiMessageSquare className="h-5 w-5 text-purple-500" />,
  archived: <FiArchive className="h-5 w-5 text-gray-500" />
};

export default function ContactStats({ stats }) {
  const getCountByStatus = (status) => {
    const statusData = stats.byStatus.find(s => s.status === status);
    return statusData ? statusData.count : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      <div className="bg-[var(--container-color-in)] p-4 rounded-lg shadow-sm border border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-color-light)]">Total Submissions</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="p-2 bg-[var(--button-bg-color)] rounded-full">
            <FiMail className="h-6 w-6 text-[var(--button-color)]" />
          </div>
        </div>
      </div>

      {['new', 'read', 'replied', 'archived'].map((status) => (
        <div key={status} className="bg-[var(--container-color-in)] p-4 rounded-lg shadow-sm border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-color-light)] capitalize">{status}</p>
              <p className="text-2xl font-bold">{getCountByStatus(status)}</p>
            </div>
            <div className="p-2 bg-[var(--button-bg-color)] rounded-full">
              {statusIcons[status]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
