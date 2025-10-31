"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiUser, FiLogOut, FiLogIn } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Logo from "assets/brand/goingbo-logo.png";
import ThemeToggle from "./ThemeToggle";

// Nav Image as Icon
import Flight from "assets/nav/nobg-flight.png";
import Hotel from "assets/nav/nobg-hotel.png";
import Cab from "assets/nav/nobg-cabs.png";
import Bus from "assets/nav/nobg-bus.png";
import Package from "assets/nav/nobg-holiday-package.png";

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

  // Store admin after check it if admin
  const isAdmin = user?.role === "admin";

  const navItems = [
    // { name: "Admin", path: "/admin", hidden: !isAdmin },
    {
      name: "Flight",
      path: "/flights",
      icon: Flight,
      color: "text-[var(--logo-color-two)]",
    },
    {
      name: "Hotel",
      path: "/hotels",
      icon: Hotel,
      color: "text-[var(--logo-color-two)]",
    },
    {
      name: "Cab",
      path: "/cab",
      icon: Cab,
      color: "text-[var(--logo-color-two)]",
    },
    {
      name: "Bus",
      path: "/bus",
      icon: Bus,
      color: "text-[var(--logo-color-two)]",
    },
    {
      name: "Packages",
      path: "/packages",
      icon: Package,
      color: "text-[var(--logo-color)]",
    },
    { name: "All Services", path: "/all-services" },
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
          <Link href="/">
            <Image
              src={Logo}
              alt="Logo"
              width={90}
              height={90}
              className="rounded-sm"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-5">
            <nav className="flex space-x-5">
              {navItems.map(
                (item) =>
                  !item.hidden && (
                    <Link
                      key={item.name}
                      href={item.path}
                      className="flex items-center gap-1 transition-colors duration-200 font-medium group relative"
                    >
                      {/* Image Icon */}
                      {item.icon && (
                        <span className="flex items-center justify-center w-5 h-5">
                          <Image
                            src={item.icon}
                            alt={item.name}
                            width={20}
                            height={20}
                            className={`object-contain`}
                          />
                        </span>
                      )}

                      {/* Text */}
                      <span className={`${item.color} font-600`}>
                        {item.name}
                      </span>

                      {/* Underline Hover Effect */}
                      <span className="absolute left-1/2 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-transparent via-[var(--logo-bg-color)] to-transparent rounded-full transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
                    </Link>
                  )
              )}
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
                    <div className="w-8 h-8 rounded-full bg-[var(--logo-color)] flex items-center justify-center ">
                      <span className="text-white font-semibold bg-[var(--logo-color-two)] rounded-full">
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
                  <div className="absolute right-0 mt-2 w-48 bg-[var(--container-color-in)] rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/me"
                      className="block px-4 py-2 text-sm hover:bg-[var(--container-color)] flex items-center gap-2"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiUser size={14} />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-[var(--container-color)] flex items-center space-x-2 cursor-pointer"
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
                    className="flex items-center px-4 py-1 rounded-lg text-sm font-medium border border-gray-400 hover:bg-[var(--container-color)] transition-colors duration-50"
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
        <div className="md:hidden bg-[var(--container-color-in)] mt-3 pb-4 border rounded border-[#0B2545] border-[3px] p-2">
          <nav className="flex flex-col space-y-3">
            {navItems.map(
              (item) =>
                !item.hidden && (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="block p-2 hover:bg-[var(--container-color-in)] rounded-md transition-colors duration-200 flex gap-1"
                    onClick={() => setIsOpen(false)}
                  >
                    {/* Image Icon */}
                    {item.icon && (
                      <span className="flex items-center justify-center w-5 h-5">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={20}
                          height={20}
                          className={`object-contain`}
                        />
                      </span>
                    )}
                    <span className={`${item.color} font-600`}>
                      {item.name}
                    </span>
                  </Link>
                )
            )}

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
