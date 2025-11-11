"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProfileInfo from "./ProfileInfo";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import Bookings from "@/components/Bookings";

export default function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Bookings");
  const scrollRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 150;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!user) return null;

  const tabs = [
    "Profile",
    "Bookings",
    "Package Wishlist",
    "All Payments",
    "Coupons For You",
    "Give Ratings",
    "Notifications",
    "My Cabs",
    "Earnings",
    "Customer Reviews",
  ];

  // Sample data - replace with actual API calls
  const [cabs, setCabs] = useState([
    { id: 1, name: 'Toyota Innova', type: 'SUV', number: 'KA01AB1234', status: 'Available' },
    { id: 2, name: 'Maruti Ertiga', type: 'MUV', number: 'KA02CD5678', status: 'In Service' },
  ]);

  const [earnings, setEarnings] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl py-4 mx-auto">
        <div className="shadow rounded-lg px-5 py-3 relative">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
              Welcome, {user.name}!
            </h1>

            <button
              onClick={handleLogout}
              className="hidden cursor-pointer md:block px-4 py-2 bg-[var(--button-bg-color)] text-[var(--button-color)] rounded-md hover:bg-[var(--button-hover-color)] focus:outline-none focus:ring-2 focus:ring-[var(--button-hover-color)] focus:ring-offset-2"
            >
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="relative border-b border-[var(--border-color)] mb-6">
            {/* Left scroll button */}
            <button
              onClick={() => scroll("left")}
              className="md:hidden absolute left-[-10px] top-1/2 -translate-y-1/2 bg-transparent shadow-md rounded-full p-1 z-10  sm:flex hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            {/* Tabs container */}
            <div
              ref={scrollRef}
              className="flex space-x-6 overflow-x-auto scrollbar-hide mx-6"
            >
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-medium transition-colors relative cursor-pointer whitespace-nowrap
                    ${
                      activeTab === tab
                        ? "after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[var(--logo-color)] text-[var(--logo-color)]"
                        : "text-[var(--logo-color-two)] hover:text-[var(--logo-color)]"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Right scroll button */}
            <button
              onClick={() => scroll("right")}
              className="md:hidden absolute right-[-10px] top-1/2 -translate-y-1/2 bg-transparent shadow-md rounded-full p-1 z-10 sm:flex hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === "Profile" && (
              <div className="p-4 bg-[var(--container-color-in)] rounded-md">
                <ProfileInfo />
              </div>
            )}

            {activeTab === "My Cabs" && (
              <div className="p-4 bg-[var(--container-color-in)] rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">My Cabs</h2>
                  <button className="px-4 py-2 bg-[var(--logo-color)] text-white rounded-md hover:bg-[var(--logo-color-dark)] transition-colors">
                    + Add New Cab
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cab Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cabs.map((cab) => (
                        <tr key={cab.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{cab.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{cab.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{cab.number}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              cab.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {cab.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "Bookings" && (
              <div className="p-4 bg-[var(--container-color-in)] rounded-md">
                <h2 className="text-lg font-medium mb-4">
                  Your Cab Bookings
                </h2>
                  <Bookings/>
              </div>
            )}

            {activeTab === "Earnings" && (
              <div className="p-4 bg-[var(--container-color-in)] rounded-md">
                <h2 className="text-lg font-medium mb-4">Earnings Overview</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">₹{earnings.total}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Completed Rides</dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">{earnings.completed}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Your recent earnings and payouts</p>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">No recent transactions</dt>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Customer Reviews" && (
              <div className="p-4 bg-[var(--container-color-in)] rounded-md">
                <h2 className="text-lg font-medium mb-4">Customer Reviews</h2>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xl">JD</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">John Doe</h4>
                        <div className="flex items-center mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="mt-1 text-sm text-gray-600">Great service! The cab was clean and the driver was professional.</p>
                        <p className="text-xs text-gray-500 mt-2">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Package Wishlist" && (
              <div className="p-4 bg-[var(--container-color-in)] rounded-md">
                <h2 className="text-lg font-medium ">
                  Package Wishlist
                </h2>
                <p className="text-sm text-[var(--text-color-light)] mt-2">
                  Your saved items will appear here.
                </p>
              </div>
            )}

            {activeTab === "All Payments" && (
              <div className="p-4 bg-[var(--container-color-in)] rounded-md">
                <h2 className="text-lg font-medium ">
                  All Payments
                </h2>
                <p className="text-sm text-[var(--text-color-light)] mt-2">
                  Your saved All Payments will appear here.
                </p>
              </div>
            )}

            {activeTab === "Coupons For You" && (
              <div className="p-4 bg-[var(--container-color-in)] rounded-md">
                <h2 className="text-lg font-medium ">
                  Coupons For You
                </h2>
                <p className="text-sm text-[var(--text-color-light)] mt-2">
                  Your saved Coupons For You will appear here.
                </p>
              </div>
            )}

            {activeTab === "Give Ratings" && (
              <div className="p-4 bg-[var(--container-color-in)] rounded-md">
                <h2 className="text-lg font-medium ">
                  Give Ratings
                </h2>
                <p className="text-sm text-[var(--text-color-light)] mt-2">
                  Your saved reviews and ratings will appear here.
                </p>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="p-4 bg-[var(--container-color-in)] rounded-md">
                <h2 className="text-lg font-medium ">
                  Notifications
                </h2>
                <p className="text-sm text-[var(--text-color-light)] mt-2">
                  Your saved notifications will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
