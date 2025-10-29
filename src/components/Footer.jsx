"use client";

import Link from "next/link";
import { useState } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com/yourusername",
      icon: (
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/yourusername",
      icon: (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12.001 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      ),
    },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Packages", href: "/packages" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Sitemap", href: "/sitemap.xml" },
  ];

  const contactInfo = [
    { type: "email", value: "info@goingbo.com" },
    { type: "phone", value: "+91 9990999561" },
    { type: "address", value: "Plot No. 63, Sector 64 Rd, B Block, Sector 63, Noida, Uttar Pradesh. Pin- 201301" },
  ];

  return (
    <footer className="bg-[var(--container-color-in)] text-text-light">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">GoingBo Tours Pvt. Ltd.</h3>
            <p className="mb-4">
              We are a leading travel agency that offers a wide range of travel
              packages, including flights, hotels, and tours. Our team of
              experienced travel professionals is dedicated to providing you
              with the best possible travel experience.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-light hover:text-text transition-colors"
                  aria-label={item.name}
                >
                  <span className="sr-only">{item.name}</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-text transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start">
                  <span className="capitalize mr-2">{info.type}:</span>
                  <span>{info.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-4">
              Subscribe to get updates on new projects and articles.
            </p>
            {isSubscribed ? (
              <div className="bg-green-100 text-green-800 p-3 rounded">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded bg-[var(--bg-color)] text-[var(--text-color)] border border-[var(--border-color)] focus:outline-none focus:ring-2"
                  required
                />
                <button
                  type="submit"
                  className="bg-[var(--button-bg-color)] py-1 px-2 rounded hover:bg-[var(--button-hover-color)] text-[var(--button-color)] transition-opacity cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border-color)] mt-8 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            © {currentYear} GoingBo. All rights reserved.
          </p>

          <div className="mt-4 md:mt-0 flex flex-wrap justify-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm hover:text-[var(--text-color)] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
