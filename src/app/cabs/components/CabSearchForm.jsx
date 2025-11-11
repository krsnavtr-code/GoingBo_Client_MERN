"use client";

import { useState } from "react";
import { MapPin, Clock, Calendar, Users } from "lucide-react";

export default function CabSearchForm({
  searchParams,
  setSearchParams,
  onSubmit,
  loading = false,
}) {
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 bg-[var(--container-color-in)] p-5 rounded-xl shadow-md max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Pickup Location */}
        <div className="relative lg:col-span-3">
          <label htmlFor="pickup" className="block text-sm font-medium mb-1">
            Pickup Location
          </label>
          <div
            className={`relative ${
              focusedField === "pickup" ? "ring-2 ring-[var(--logo-color)]" : ""
            } rounded-md transition-all duration-200`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5" />
            </div>
            <input
              type="text"
              id="pickup"
              name="pickup"
              required
              value={searchParams.pickup}
              onChange={handleInputChange}
              onFocus={() => setFocusedField("pickup")}
              onBlur={() => setFocusedField(null)}
              className="block w-full pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color)] text-[var(--text-color)] focus:outline-none"
              placeholder="Enter pickup location"
            />
          </div>
        </div>

        {/* Drop Location */}
        <div className="relative lg:col-span-3">
          <label htmlFor="drop" className="block text-sm font-medium mb-1">
            Drop Location
          </label>
          <div
            className={`relative ${
              focusedField === "drop" ? "ring-2 ring-[var(--logo-color)]" : ""
            } rounded-md transition-all duration-200`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5" />
            </div>
            <input
              type="text"
              id="drop"
              name="drop"
              required
              value={searchParams.drop}
              onChange={handleInputChange}
              onFocus={() => setFocusedField("drop")}
              onBlur={() => setFocusedField(null)}
              className="block w-full pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color)] text-[var(--text-color)] focus:outline-none"
              placeholder="Enter drop location"
            />
          </div>
        </div>

        {/* Date */}
        <div className="relative sm:col-span-1 lg:col-span-3">
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Date
          </label>
          <div className="relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5" />
            </div>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={searchParams.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="block w-full pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color)] text-[var(--text-color)] focus:outline-none"
            />
          </div>
        </div>

        {/* Time */}
        <div className="relative sm:col-span-1 lg:col-span-2">
          <label htmlFor="time" className="block text-sm font-medium mb-1">
            Time
          </label>
          <div className="relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5" />
            </div>
            <input
              type="time"
              id="time"
              name="time"
              required
              value={searchParams.time}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color)] text-[var(--text-color)] focus:outline-none"
            />
          </div>
        </div>

        {/* Passengers */}
        <div className="relative sm:col-span-1 lg:col-span-1">
          <label
            htmlFor="passengers"
            className="block text-sm font-medium mb-1"
          >
            Passengers
          </label>
          <div className="relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5" />
            </div>
            <select
              id="passengers"
              name="passengers"
              value={searchParams.passengers}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-3 rounded-md border border-[var(--border-color)] px-2 py-2 bg-[var(--container-color)] text-[var(--text-color)] focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center lg:justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`w-full sm:w-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-[var(--button-color)] bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--logo-color)] transition-all duration-200 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Searching..." : "Search Cab"}
        </button>
      </div>
    </form>
  );
}
