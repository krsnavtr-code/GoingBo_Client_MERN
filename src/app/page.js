'use client';

// In the home page have a Same Flight page -> client\src\app\flights\page.jsx

import { useState, useEffect } from 'react';
import FloatingSearchCard from '@/components/FloatingSearchCard';
import FlightSearch from '@/components/flights/FlightSearch';
import FlightList from '@/components/flights/FlightList';
import searchFlights from '@/components/FloatingSearchCard';
import { FaPlane, FaCreditCard, FaPassport, FaUsers, FaCalendarAlt, FaBell } from 'react-icons/fa';
import Contact from '@/components/ContactForm';

export default function Page() {
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchFlights(searchParams);
      setSearchResults(results.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to search for flights');
      console.error('Flight search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Do More With GoingBo
  const features = [
    { icon: <FaPlane className="text-blue-500 text-3xl" />, title: "Flight Tracker" },
    { icon: <FaCreditCard className="text-blue-500 text-3xl" />, title: "Credit Card" },
    { icon: <FaPassport className="text-blue-500 text-3xl" />, title: "Book Visa" },
    { icon: <FaUsers className="text-blue-500 text-3xl" />, title: "Group Booking" },
    { icon: <FaCalendarAlt className="text-blue-500 text-3xl" />, title: "Plan" },
    { icon: <FaBell className="text-blue-500 text-3xl" />, title: "Fare Alerts" },
  ];


  return (
    <div className="container mx-auto px-4">
      {/* Floating Search Card */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <FloatingSearchCard />
      </div>

      <div className="pt-26 pb-8">
        <div className="">
          <FlightSearch onSearch={handleSearch} loading={loading} />
        </div>

        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {searchResults && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Available Flights</h2>
            <FlightList flights={searchResults.flights} />
          </div>
        )}
      </div>

      {/* Other For Only Home */}
      <div className="">
        {/* Do More With GoingBo */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Do More With GoingBo</h2>
          <div className="bg-[var(--container-color-in)] rounded-2xl shadow-sm border flex justify-between p-6 items-center">
            {features.map((item, index) => (
              <div key={index} className="flex flex-col items-center justify-center text-center w-1/6">
                <div className="mb-2">{item.icon}</div>
                <span className="text-sm font-medium">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Flights */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Popular Flights</h2>
          {/* <FlightList flights={popularFlights} /> */}
        </div>

        {/* Popular Hotels */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Popular Hotels</h2>
          {/* <HotelList hotels={popularHotels} /> */}
        </div>

        {/* Popular Cabs */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Popular Cabs</h2>
          {/* <CabList cabs={popularCabs} /> */}
        </div>

        {/* Popular Buses */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Popular Buses</h2>
          {/* <BusList buses={popularBuses} /> */}
        </div>

        {/* Today's Flight Offers */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Today's Flight Offers</h2>
          {/* <FlightList flights={todayFlights} /> */}
        </div>

        {/* Why Book With goingbo? */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Why Book With goingbo?</h2>
          {/* <WhyBookWithGoingbo /> */}
        </div>

        {/* Popular Domestic Airlines */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Popular Domestic Airlines</h2>
          {/* <FlightList flights={popularDomesticAirlines} /> */}
        </div>

        {/* Frequently Asked Questions */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          {/* <FAQ /> */}
        </div>

        {/* Contact Us */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>

          <div className="bg-[var(--container-color-in)] rounded-2xl shadow-sm border grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-10 items-center">
            {/* Google Map */}
            <div className="w-full h-[300px] md:h-[350px] overflow-hidden rounded-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14010.5321992241!2d77.41897094759607!3d28.61078326082191!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cee941d0fac1d%3A0x23370297a1102792!2sSector%204%2C%20Greater%20Noida%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1762003991744!5m2!1sen!2sin"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
                title="GoingBo Office Location"
              ></iframe>
            </div>

            {/* Contact Component */}
            <div className="flex justify-center md:justify-start">
              <Contact />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}