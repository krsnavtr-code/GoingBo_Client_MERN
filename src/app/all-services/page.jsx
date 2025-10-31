"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlane, FaHotel, FaTaxi, FaBus, FaSuitcase, FaStar, FaHeadset, FaShieldAlt, FaGlobe } from 'react-icons/fa';

const services = [
  {
    id: 1,
    title: 'Flight Bookings',
    description: 'Book domestic and international flights with the best deals and flexible options.',
    icon: <FaPlane className="w-8 h-8 text-blue-500" />,
    link: '/flights',
    features: [
      'Best Price Guarantee',
      '24/7 Customer Support',
      'Easy Rescheduling',
      'Wide Network of Airlines'
    ]
  },
  {
    id: 2,
    title: 'Hotel Stays',
    description: 'Find the perfect accommodation for your next trip with our wide selection of hotels.',
    icon: <FaHotel className="w-8 h-8 text-green-500" />,
    link: '/hotels',
    features: [
      'Luxury to Budget Stays',
      'Free Cancellation',
      'Best Rate Guarantee',
      'Verified Guest Reviews'
    ]
  },
  {
    id: 3,
    title: 'Cab Services',
    description: 'Hassle-free local and outstation cab bookings at competitive rates.',
    icon: <FaTaxi className="w-8 h-8 text-yellow-500" />,
    link: '/cabs',
    features: [
      '24/7 Availability',
      'Professional Drivers',
      'Multiple Vehicle Options',
      'Secure Rides'
    ]
  },
  {
    id: 4,
    title: 'Bus Tickets',
    description: 'Book bus tickets for all major routes with comfortable seating options.',
    icon: <FaBus className="w-8 h-8 text-purple-500" />,
    link: '/buses',
    features: [
      'Sleeper & Seater Options',
      'Live Tracking',
      'Safe & Comfortable',
      'Multiple Operators'
    ]
  },
  {
    id: 5,
    title: 'Holiday Packages',
    description: 'Customized holiday packages for domestic and international destinations.',
    icon: <FaSuitcase className="w-8 h-8 text-red-500" />,
    link: '/packages',
    features: [
      'Customizable Itineraries',
      'All-inclusive Deals',
      'Expert Travel Guides',
      'Best Value for Money'
    ]
  }
];

const features = [
  {
    icon: <FaStar className="w-6 h-6 text-yellow-500" />,
    title: 'Best Prices',
    description: 'Guaranteed best prices for all our services.'
  },
  {
    icon: <FaHeadset className="w-6 h-6 text-blue-500" />,
    title: '24/7 Support',
    description: 'Round-the-clock customer support for all your travel needs.'
  },
  {
    icon: <FaShieldAlt className="w-6 h-6 text-green-500" />,
    title: 'Secure Booking',
    description: 'Your security is our top priority with encrypted transactions.'
  },
  {
    icon: <FaGlobe className="w-6 h-6 text-purple-500" />,
    title: 'Wide Network',
    description: 'Extensive network across multiple destinations worldwide.'
  }
];

const AllServicesPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-[var(--container-color-in)] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Travel Services</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover a world of travel options tailored to your needs
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg mr-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={service.link}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Explore {service.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[var(--container-color-in)] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-[var(--container-color-in)] p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[var(--container-color-in)] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Next Trip?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let us help you create unforgettable travel experiences with our comprehensive travel services.
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-[var(--logo-color-two)] text-white font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            Contact Us Today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AllServicesPage;