"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  FiUsers,
  FiPieChart,
  FiSettings,
  FiLogOut,
  FiHome,
  FiUser,
  FiImage,
  FiAward,
  FiMail,
  FiMenu,
  FiX,
} from "react-icons/fi";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/v1/users/me", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Not authorized");
        }

        const data = await res.json();

        if (data.data.user.role !== "admin") {
          throw new Error("Access denied. Admins only.");
        }

        setUser(data.data.user);
      } catch (error) {
        toast.error(error.message || "Please log in as admin");
        window.location.href = "/login";
      }
    };

    checkAdmin();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/users/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", icon: <FiPieChart />, path: "/admin" },
    { name: "Users", icon: <FiUsers />, path: "/admin/users" },
    { name: "Profile", icon: <FiUser />, path: "/admin/profile" },
    {
      name: "Package Categories",
      icon: <FiImage />,
      path: "/admin/package-categories",
    },
    { name: "Packages", icon: <FiAward />, path: "/admin/packages" },
    { name: "Skills", icon: <FiAward />, path: "/admin/skills" },
    { name: "Blog", icon: <FiMail />, path: "/admin/blog" },
    { name: "Media", icon: <FiImage />, path: "/admin/media" },
    { name: "Contacts", icon: <FiMail />, path: "/admin/contacts" },
  ];

  return (
    <div className="flex h-screen bg-[var(--container-color)] text-[var(--text-color)] overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out z-30 w-40 bg-[var(--container-color)] border-r border-[var(--border-color)] flex flex-col`}
      >
        <div className="flex items-center justify-between h-12 px-4 border-b border-[var(--border-color)]">
          <h1 className="text-md font-bold">Admin</h1>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-[var(--button-bg-hover)]"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 mt-2">
          <ul className="space-y-1 px-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`flex items-center px-2 py-1 text-sm font-medium rounded-md transition-colors ${
                    pathname === item.path
                      ? "bg-[var(--button-bg-color)] text-[var(--button-color)]"
                      : "text-[var(--text-color)] hover:bg-[var(--button-bg-hover)]"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="py-1 px-2 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-[var(--button-bg-color)] flex items-center justify-center text-[var(--button-color)]">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="ml-3">
                <p className="text-[11px] font-medium">
                  {user?.name || "Admin"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-40">
        <header className="bg-[var(--container-color)] border-b border-[var(--border-color)] h-12 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md hover:bg-[var(--button-bg-hover)] mr-2"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold">
              {navItems
                .sort((a, b) => b.path.length - a.path.length) // Sort by path length in descending order
                .find(
                  (item) =>
                    item.path === pathname || // Exact match
                    (pathname.startsWith(item.path) &&
                      (pathname[item.path.length] === "/" ||
                        pathname.length === item.path.length))
                )?.name || "Admin"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="bg-[var(--button-bg-color)] text-[var(--button-color)] px-2 rounded-md"
            >
              User Panel
            </Link>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2 rounded-md text-red-600 flex items-center cursor-pointer gap-2"
              title="Logout"
            >
              Logout
              <FiLogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[var(--bg-color)]">
          {children}
        </main>
      </div>
    </div>
  );
}
