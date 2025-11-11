import React from 'react';

const colors = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: 'text-blue-500',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: 'text-green-500',
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: 'text-yellow-500',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: 'text-red-500',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    icon: 'text-purple-500',
  },
};

const DashboardCard = ({ title, value, icon: Icon, color = 'blue', trend, trendText }) => {
  const colorScheme = colors[color] || colors.blue;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${colorScheme.bg}`}>
            <Icon className={`h-6 w-6 ${colorScheme.icon}`} aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {trend && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend > 0 ? (
                      <svg
                        className="self-center flex-shrink-0 h-5 w-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="self-center flex-shrink-0 h-5 w-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="sr-only">
                      {trend > 0 ? 'Increased' : 'Decreased'} by
                    </span>
                    {trend}% {trendText && <span className="ml-1 text-gray-500">{trendText}</span>}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <a
            href="#"
            className={`font-medium ${colorScheme.text} hover:text-indigo-900`}
          >
            View all
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
