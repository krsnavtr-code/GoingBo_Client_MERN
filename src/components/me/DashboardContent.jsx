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
  ];

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

            {activeTab === "Bookings" && (
              <div className="p-4 bg-[var(--container-color-in)] rounded-md">
                <h2 className="text-lg font-medium mb-4">
                  Your Bookings
                </h2>
                <div className="mt-4">
                  <Bookings />
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
