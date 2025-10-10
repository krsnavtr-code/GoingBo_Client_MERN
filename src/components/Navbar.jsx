"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiUser, FiLogOut, FiLogIn, FiSettings } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Logo from "assets/trivixa-fix-size-brand-logo.png";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close mobile menu when authentication state changes
  useEffect(() => {
    setIsOpen(false);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "#about" },
    { name: "Projects", path: "#projects" },
    { name: "Skills", path: "#skills" },
    { name: "Contact", path: "#contact" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--container-color-in)] backdrop-blur-md shadow-sm"
          : "bg-[var(--container-color)]"
      }`}
    >
      <div className="container mx-auto py-2 px-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            <Image
              src={Logo}
              alt="Logo"
              width={70}
              height={70}
              className="rounded-sm"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="transition-colors duration-50 font-medium group relative"
                >
                  {item.name}
                  <span className="absolute left-1/2 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#0B2545] to-transparent rounded-full transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
                </Link>
              ))}
            </nav>

            <ThemeToggle />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none cursor-pointer"
                >
                  {user.photo ? (
                    <Image
                      src={user.photo}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center ">
                      <span className="text-blue-700 dark:text-blue-300 font-semibold bg-[#0B2545] rounded-full">
                        {user?.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2) // only first 2 initials
                          : "U"}
                      </span>
                    </div>
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/me"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiUser size={14} />
                      Profile
                    </Link>
                    {/* Admin panel button - only show if user is admin */}
                    {user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block p-2 hover:bg-[var(--container-color-in)] rounded-md transition-colors duration-200 flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <FiSettings size={16} />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                    >
                      <FiLogOut size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="flex items-center px-4 py-1 rounded-lg text-sm font-medium border border-gray-400 hover:bg-[var(--container-color-in)] transition-colors duration-50"
                  >
                    Login
                    <FiLogIn size={16} />
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[var(--text-color)] focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[var(--container-color-in)] mt-3 pb-4 max-w-[200px] border rounded border-[#0B2545] border-[3px] p-2">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="block p-2 hover:bg-[var(--container-color-in)] rounded-md transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <hr className="bg-[var(--logo-bg-color)] h-[1px]" />
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  href="/me"
                  className="block p-2 hover:bg-[var(--container-color-in)] rounded-md transition-colors duration-200 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser size={16} />
                  Profile
                </Link>

                {/* Admin panel button - only show if user is admin */}
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block p-2 hover:bg-[var(--container-color-in)] rounded-md transition-colors duration-200 flex items-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiSettings size={16} />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center space-x-2"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block w-max p-2 font-medium text-center rounded-md flex items-center gap-1"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                  <FiLogIn size={16} />
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
