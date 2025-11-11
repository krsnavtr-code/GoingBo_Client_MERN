'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { registerHotel } from '@/services/hotelService';

export default function HotelRegistrationForm({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare the data for the API
      const hotelData = {
        name: data.hotelName,
        description: data.description,
        category: data.starRating,
        registrationNumber: data.registrationNumber,
        totalRooms: parseInt(data.totalRooms, 10),
        contact: {
          name: data.ownerName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          country: data.country,
          postalCode: data.postalCode,
          mapLocation: data.mapLocationLink
        },
        website: data.website,
        facilities: {
          hasWifi: data.hasWifi || false,
          hasPool: data.hasPool || false,
          hasRestaurant: data.hasRestaurant || false
        },
        additionalInfo: data.additionalInfo
      };

      // Call the API
      const response = await registerHotel(hotelData);
      console.log('Hotel registration successful:', response);
      
      setSuccess(true);
      
      // Reset form on successful submission
      // reset();
      
      // Optionally close the form after a delay
      // setTimeout(() => onClose(), 3000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register hotel. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto p-4">
        <div className="bg-[var(--container-color)] rounded-lg shadow-lg w-full max-w-2xl px-6 py-4 relative max-h-[90vh] overflow-y-auto">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">
              Registration Successful!
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Thank you for registering your hotel. Our team will review your
                application and contact you shortly.
              </p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-[var(--container-color)] rounded-lg shadow-lg w-full max-w-2xl px-6 py-4 relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Register Your Hotel</h2>
          <button
            onClick={onClose}
            className="cursor-pointer"
            disabled={loading}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hotel Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Hotel Information</h3>

              <div>
                <label
                  htmlFor="hotelName"
                  className="block text-sm font-medium"
                >
                  Hotel Name *
                </label>
                <input
                  type="text"
                  id="hotelName"
                  {...register("hotelName", {
                    required: "Hotel name is required",
                  })}
                  className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                />
                {errors.hotelName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.hotelName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  {...register("description")}
                  className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                />
              </div>

              <div>
                <label
                  htmlFor="starRating"
                  className="block text-sm font-medium"
                >
                  Hotel Category/Type
                </label>
                <select
                  id="starRating"
                  {...register("starRating")}
                  className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                  defaultValue=""
                >
                  <option value="">Select rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">Resort</option>
                  <option value="6">Hotel</option>
                  <option value="7">Guest House</option>
                  <option value="8">Boutique Hotel</option>
                  <option value="9">Luxury Hotel</option>
                  <option value="10">Motel</option>
                  <option value="11">Homestay</option>
                  <option value="12">Bed and Breakfast</option>
                  <option value="13">Vacation Rental</option>
                  <option value="14">Apartment</option>
                  <option value="15">Cottage</option>
                  <option value="16">Farmhouse</option>
                </select>
              </div>

              {/* Registration/License Number */}
              <div>
                <label
                  htmlFor="registrationNumber"
                  className="block text-sm font-medium"
                >
                  Registration/License Number
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  {...register("registrationNumber", {
                    required: "Registration number is required",
                  })}
                  className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                />
              </div>

              <div>
                <label
                  htmlFor="totalRooms"
                  className="block text-sm font-medium"
                >
                  Total Number of Rooms
                </label>
                <input
                  type="number"
                  id="totalRooms"
                  min="1"
                  {...register("totalRooms", {
                    required: "Please specify total number of rooms",
                    min: { value: 1, message: "Must have at least 1 room" },
                  })}
                  className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                />
                {errors.totalRooms && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.totalRooms.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>

              <div>
                <label
                  htmlFor="ownerName"
                  className="block text-sm font-medium"
                >
                  Owner/Manager Name *
                </label>
                <input
                  type="text"
                  id="ownerName"
                  {...register("ownerName", {
                    required: "Owner/Manager name is required",
                  })}
                  className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                />
                {errors.ownerName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.ownerName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9+\-\s]+$/,
                      message: "Invalid phone number",
                    },
                  })}
                  className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium">
                  Complete Address *
                </label>
                <textarea
                  id="address"
                  rows={3}
                  {...register("address", { required: "Address is required" })}
                  className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    {...register("city", { required: "City is required" })}
                    className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium"
                  >
                    Country *
                  </label>
                  <select
                    id="country"
                    {...register("country", {
                      required: "Country is required",
                    })}
                    className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select country
                    </option>
                    <option value="IN">India</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="SG">Singapore</option>
                    <option value="MY">Malaysia</option>
                    <option value="TH">Thailand</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium"
                >
                  Postal/Zip Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  {...register("postalCode")}
                  className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                />
              </div>

              {/* Google Map location link */}
              <div>
                <label
                  htmlFor="mapLocationLink"
                  className="block text-sm font-medium"
                >
                  Google Map Location *
                </label>
                <input
                  type="text"
                  id="mapLocationLink"
                  {...register("mapLocationLink", {
                    required: "Location is required",
                  })}
                  className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-4">Additional Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="website" className="block text-sm font-medium">
                  Website (optional)
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    https://
                  </span>
                  <input
                    type="text"
                    id="website"
                    {...register("website")}
                    className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                    placeholder="www.example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Facilities</label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="hasWifi"
                      type="checkbox"
                      {...register("hasWifi")}
                      className="h-4 w-4 focus:ring-[var(--border-color)] border-[var(--border-color)] rounded cursor-pointer"
                    />
                    <label
                      htmlFor="hasWifi"
                      className="ml-2 block text-sm"
                    >
                      Free WiFi
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="hasPool"
                      type="checkbox"
                      {...register("hasPool")}
                      className="h-4 w-4 focus:ring-[var(--border-color)] border-[var(--border-color)] rounded cursor-pointer"
                    />
                    <label
                      htmlFor="hasPool"
                      className="ml-2 block text-sm"
                    >
                      Swimming Pool
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="hasRestaurant"
                      type="checkbox"
                      {...register("hasRestaurant")}
                      className="h-4 w-4 focus:ring-[var(--border-color)] border-[var(--border-color)] rounded cursor-pointer"
                    />
                    <label
                      htmlFor="hasRestaurant"
                      className="ml-2 block text-sm"
                    >
                      Restaurant
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="additionalInfo" className="block text-sm font-medium">
                Additional Information
              </label>
              <textarea
                id="additionalInfo"
                rows={3}
                {...register("additionalInfo")}
                className="block w-full pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color-in)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-[var(--border-color)]"
                placeholder="Any other information you'd like to share about your hotel"
              />
            </div>

            <div className="mt-6 flex items-center">
              <input
                id="terms"
                type="checkbox"
                {...register("terms", {
                  required: "You must accept the terms and conditions",
                })}
                className="h-4 w-4 focus:ring-[var(--border-color)] border-[var(--border-color)] rounded cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 block text-sm">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>{" "}
                *
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.terms.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200">
            <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              * Required fields
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="bg-white py-2 px-4 border border-[var(--border-color)] rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--border-color)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--border-color)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Submit Registration'}
              </button>
            </div>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}
