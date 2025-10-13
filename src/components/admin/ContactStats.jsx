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
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Submissions</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="p-2 bg-blue-50 rounded-full">
            <FiMail className="h-6 w-6 text-blue-500" />
          </div>
        </div>
      </div>

      {['new', 'read', 'replied', 'archived'].map((status) => (
        <div key={status} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 capitalize">{status}</p>
              <p className="text-2xl font-bold">{getCountByStatus(status)}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-full">
              {statusIcons[status]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
