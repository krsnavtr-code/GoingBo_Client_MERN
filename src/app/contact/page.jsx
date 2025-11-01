'use client';

import React from "react";
import Contact from "@/components/ContactForm";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Page = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="px-6">
        {/* Top Section */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium mb-2">Get In Touch</p>
          <h2 className="text-3xl font-semibold mb-2">Feel Free To Contact</h2>
        </div>

        {/* Main Content Section */}
        <div className="max-w-6xl bg-[var(--container-color-in)] rounded-2xl shadow-md p-5">
          {/* Left Side: Text Info */}
          <div className="flex-1 text-center md:text-left">
            <p className="mb-6">Travel smarter. Explore farther. — GoingBo</p>
            <p className="mb-6">
              GoingBo is your smart travel partner — helping you find affordable
              flights, plan better trips, and travel stress-free with 24/7
              support.
            </p>
            <p className="mb-6">
              GoingBo offers you budget-friendly flights, flexible booking
              options, and personalized travel suggestions. Our mission is to
              make travel accessible, transparent, and stress-free — whether
              it’s a short getaway or a business trip, we’re here for you every
              step of the way
            </p>
            <p className="mb-6">
              GoingBo is a trusted online travel platform that provides
              end-to-end support for flight bookings, trip planning, and travel
              deals. We offer real-time fare comparisons, multiple airline
              options, and secure payments to help you get the best price and
              route. With 24/7 customer assistance and easy cancellation or
              refund policies, we’re committed to making your travel experience
              smooth and worry-free. Our goal is to create meaningful journeys
              for every traveler through smart technology and personalized
              recommendations.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center mt-8 text-sm">
          You get assistance on any kind of travel related query. We are happy
          to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="mt-12 text-center">
          <div className="p-5 mb-5 flex items-center gap-4 bg-[var(--container-color-in)] text-[var(--text-color)] rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Icon Container */}
            <div className="w-12 h-12 bg-[var(--container-color)] rounded-full flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[var(--first-color)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Email Text */}
            <p className="text-sm sm:text-base font-medium truncate">
              krishna.trivixa@zohomail.in
            </p>
          </div>

          <div className="p-5 mb-5 flex items-center gap-4 bg-[var(--container-color-in)] text-[var(--text-color)] rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Icon Container */}
            <div className="w-12 h-12 bg-[var(--container-color)] rounded-full flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <p className="">+91 9084407615</p>
          </div>

          <div className="p-5 mb-5 flex items-center gap-4 bg-[var(--container-color-in)] text-[var(--text-color)] rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Icon Container */}
            <div className="w-12 h-12 bg-[var(--container-color)] rounded-full flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="">Noida, India</p>
          </div>
        </div>

        <div className="mt-12 bg-[var(--container-color-in)] rounded-lg shadow-lg p-6 md:p-8">
          <Contact />
        </div>
      </div>
    </div>
  );
};

export default Page;
