"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProfileInfo from "./ProfileInfo";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Profile");
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
    "Orders",
    "Wishlist",
    "Address",
    "Payments",
    "Coupons",
    "Reviews & Ratings",
    "Notifications",
  ];

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="max-w-7xl py-4 mx-auto">
        <div className="bg-white shadow rounded-lg p-2 relative">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
              Welcome, {user.name}!
            </h1>

            <button
              onClick={handleLogout}
              className="hidden md:block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="relative border-b border-gray-200 mb-6">
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
                        ? "after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
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
            {activeTab === "Profile" && <ProfileInfo />}

            {activeTab === "Orders" && (
              <div className="p-4 bg-gray-50 rounded-md">
                <h2 className="text-lg font-medium text-gray-900">
                  Your Orders
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  View and manage your recent orders here.
                </p>
              </div>
            )}

            {activeTab === "Wishlist" && (
              <div className="p-4 bg-gray-50 rounded-md">
                <h2 className="text-lg font-medium text-gray-900">Wishlist</h2>
                <p className="text-sm text-gray-600 mt-2">
                  Your saved items will appear here.
                </p>
              </div>
            )}

            {activeTab === "Address" && (
              <div className="p-4 bg-gray-50 rounded-md">
                <h2 className="text-lg font-medium text-gray-900">Address</h2>
                <p className="text-sm text-gray-600 mt-2">
                  Your saved address will appear here.
                </p>
              </div>
            )}

            {activeTab === "Payments" && (
              <div className="p-4 bg-gray-50 rounded-md">
                <h2 className="text-lg font-medium text-gray-900">Payments</h2>
                <p className="text-sm text-gray-600 mt-2">
                  Your saved payments will appear here.
                </p>
              </div>
            )}

            {activeTab === "Coupons" && (
              <div className="p-4 bg-gray-50 rounded-md">
                <h2 className="text-lg font-medium text-gray-900">Coupons</h2>
                <p className="text-sm text-gray-600 mt-2">
                  Your saved coupons will appear here.
                </p>
              </div>
            )}

            {activeTab === "Reviews & Ratings" && (
              <div className="p-4 bg-gray-50 rounded-md">
                <h2 className="text-lg font-medium text-gray-900">
                  Reviews & Ratings
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Your saved reviews and ratings will appear here.
                </p>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="p-4 bg-gray-50 rounded-md">
                <h2 className="text-lg font-medium text-gray-900">
                  Notifications
                </h2>
                <p className="text-sm text-gray-600 mt-2">
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
