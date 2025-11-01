'use client';

// In the home page have a Same Flight page -> client\src\app\flights\page.jsx

import { useState, useEffect } from 'react';
import FloatingSearchCard from '@/components/FloatingSearchCard';
import FlightSearch from '@/components/flights/FlightSearch';
import FlightList from '@/components/flights/FlightList';
import searchFlights from '@/components/FloatingSearchCard';
import { FaPlane, FaCreditCard, FaPassport, FaUsers, FaCalendarAlt, FaBell } from 'react-icons/fa';
import Contact from '@/components/ContactForm';
import Faqs from '@/components/Faqs';
import TodayFlightOffers from '@/components/TodayFlightOffers';

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
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Do More With GoingBo</h2>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Popular Flights</h2>
          {/* <FlightList flights={popularFlights} /> */}
        </div>

        {/* Popular Hotels */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Popular Hotels</h2>
          {/* <HotelList hotels={popularHotels} /> */}
        </div>

        {/* Popular Cabs */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Popular Cabs</h2>
          {/* <CabList cabs={popularCabs} /> */}
        </div>

        {/* Popular Buses */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Popular Buses</h2>
          {/* <BusList buses={popularBuses} /> */}
        </div>

        {/* Today's Flight Offers */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">✈️ Today’s Flight Offers</h2>
          {/* <FlightList flights={todayFlights} /> */}
          <TodayFlightOffers />
        </div>

        {/* Why Book With goingbo? */}
        <div className="my-12 px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">
            Why Book With goingbo?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-[var(--container-color-in)] p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 mx-auto mb-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Easy Booking</h3>
              <p className="text-sm text-center">
                Book flights in just a few clicks with our smooth, fast, and intuitive interface.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[var(--container-color-in)] p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 mx-auto mb-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Best Price Guarantee</h3>
              <p className="text-sm text-center">
                Get the lowest fares on domestic and international flights — guaranteed!
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[var(--container-color-in)] p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 mx-auto mb-4 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">24/7 Support</h3>
              <p className="text-sm text-center">
                Our customer service team is available around the clock to assist you anytime.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[var(--container-color-in)] p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 mx-auto mb-4 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 00-10 0v2m10 0a2 2 0 012 2v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7a2 2 0 012-2m10 0H7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">Secure Payments</h3>
              <p className="text-sm text-center">
                We use advanced encryption to ensure your transactions are safe and secure.
              </p>
            </div>
          </div>
        </div>


        {/* Popular Domestic Airlines Section */}
        <div className="my-12 px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Popular Domestic Airlines
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
            {/* Airline Card */}
            {[
              { name: "IndiGo", img: "/uploads/media-1762014931155-208720630.png" },
              { name: "Air India", img: "/uploads/media-1762014930536-136648618.png" },
              { name: "Air India Express", img: "/uploads/media-1762014930533-605638350.png" },
              { name: "Akasa Air", img: "/uploads/media-1762014930512-171642290.png" },
              { name: "Alliance Air", img: "/uploads/media-1762014930526-87133052.png" },
              { name: "SpiceJet", img: "/uploads/media-1762014930523-222083723.png" },
            ].map((airline, index) => (
              <div
                key={index}
                className="w-full max-w-[140px] flex flex-col items-center bg-[var(--container-color-in)] shadow-md rounded-xl p-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img
                    src={
                      airline.img.startsWith("http")
                        ? airline.img
                        : `${process.env.NEXT_PUBLIC_API_URL}${airline.img}`
                    }
                    alt={airline.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="mt-3 text-sm font-medium">{airline.name}</p>
              </div>
            ))}
          </div>
        </div>


        {/* Frequently Asked Questions */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          {/* <FAQ /> */}
          <Faqs/>
        </div>

        {/* Contact Us */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Contact Us</h2>

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