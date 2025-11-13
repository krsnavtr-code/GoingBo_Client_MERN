'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from "react-toastify";
import HotelRegistrationForm from './HotelRegistrationForm';
import { searchCities, searchHotels } from "@/services/hotelService";

const HotelSearch = ({ onSearch, loading: externalLoading }) => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [loading, setLoading] = useState(externalLoading || false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      city: '',
      country: 'IN',
      rooms: 1,
      guests: {
        adults: 2,
        children: 0
      }
    }
  });
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  });
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState(Array(children).fill(0));
  const [cityQuery, setCityQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isCitySearching, setIsCitySearching] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Search for cities when cityQuery changes
  useEffect(() => {
    const searchCity = async () => {
      if (cityQuery.length < 2) {
        setCities([]);
        return;
      }

      setIsCitySearching(true);
      try {
        const results = await searchCities(cityQuery);
        console.log("City search results:", results);
        setCities(Array.isArray(results) ? results : []);
      } catch (error) {
        console.error("Error searching cities:", error);
        setCities([]);
      } finally {
        setIsCitySearching(false);
      }
    };

    const timer = setTimeout(searchCity, 300);
    return () => clearTimeout(timer);
  }, [cityQuery]);

  // Update childrenAges when children count changes
  useEffect(() => {
    setChildrenAges((prev) => {
      const newAges = [...prev];
      while (newAges.length < children) {
        newAges.push(0);
      }
      return newAges.slice(0, children);
    });
  }, [children]);

  const handleCitySelect = (city) => {
    console.log("City selected:", city);

    // Update the city query and clear suggestions
    setCityQuery(city.CityName);
    setCities([]);

    // Update the selected city
    setSelectedCity(city);

    // Update the form field using setValue
    setValue("city", city.CityId, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    console.log("City selection complete, cityId:", city.CityId);
  };

  const formatDate = useCallback((date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }, []);

  const validateSearch = useCallback(() => {
    if (!selectedCity) {
      toast.error("Please select a city from the dropdown");
      return false;
    }

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select both check-in and check-out dates");
      return false;
    }

    if (checkInDate >= checkOutDate) {
      toast.error("Check-out date must be after check-in date");
      return false;
    }

    if (adults < 1) {
      toast.error("At least one adult is required");
      return false;
    }

    return true;
  }, [selectedCity, checkInDate, checkOutDate, adults]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateSearch()) {
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const searchParams = {
        CheckIn: formatDate(checkInDate),
        CheckOut: formatDate(checkOutDate),
        CityId: selectedCity.CityId.toString(),
        CountryCode: "IN",
        GuestNationality: "IN",
        ResponseTime: 23.0,
        IsDetailedResponse: true,
        HotelCodes: [],
        Filters: {
          Refundable: false,
          NoOfRooms: parseInt(rooms) || 1,
          MealType: 0,
          OrderBy: 0,
          StarRating: 0,
        },
        PaxRooms: [
          {
            RoomIndex: 1,
            RoomId: 1,
            Adults: parseInt(adults) || 2,
            Children: parseInt(children) || 0,
            ChildrenAges: childrenAges
              .slice(0, children)
              .map((age) => parseInt(age) || 0),
          },
        ],
      };

      console.log("Searching hotels with params:", searchParams);

      // Call the search API
      const response = await searchHotels(searchParams);

      if (response.success) {
        console.log("Search results:", response.data);
        if (onSearch) {
          onSearch(response.data);
        }
      } else {
        const errorMsg = response.error?.message || "Failed to search hotels";
        toast.error(errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Error in hotel search:", err);
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to search hotels";
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 max-w-5xl mx-auto bg-[var(--container-color-in)] px-5 py-2 pb-10 rounded-xl"
    >
      <div className="flex justify-between items-center mt-5">
        <h2 className="text-2xl font-bold">Find best stay for you</h2>
        <div>
          <button
            onClick={() => setShowRegistration(true)}
            className="px-4 py-2 bg-[var(--button-bg-color)] text-[var(--button-color)] rounded-md hover:bg-[var(--button-hover-color)] cursor-pointer"
          >
            Register Your Hotel
          </button>
          {showRegistration && (
            <HotelRegistrationForm onClose={() => setShowRegistration(false)} />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium">City</label>
          <div className="relative">
            <input
              type="text"
              value={cityQuery}
              onChange={(e) => {
                const value = e.target.value;
                setCityQuery(value);
                if (!value) {
                  setSelectedCity(null);
                  setCities([]);
                }
              }}
              onFocus={() => {
                if (cityQuery.length >= 2) {
                  // Trigger search when input is focused and has text
                  searchCities(cityQuery).then((results) => {
                    setCities(Array.isArray(results) ? results : []);
                  });
                }
              }}
              placeholder="Search for a city..."
              className="block w-full pl-3 pr-10 rounded-md border border-gray-300 shadow-sm py-2 bg-white text-gray-900"
              required
              autoComplete="off"
            />
            {isCitySearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              </div>
            )}
          </div>
          {cities.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {cities.map((city) => (
                <li
                  key={`${city.CityId}-${city.CityName}`}
                  className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                  onClick={() => handleCitySelect(city)}
                >
                  <div className="flex items-center">
                    <span className="font-normal ml-3 block truncate">
                      {city.CityName}, {city.CountryName} ({city.CityId})
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {/* Hidden input for the form state */}
          <input type="hidden" {...register("city")} />

          {/* Display the selected city */}
          <div className="text-xs text-gray-500 mt-1">
            {selectedCity ? (
              <span>
                Selected: {selectedCity.CityName} ({selectedCity.CityId})
              </span>
            ) : (
              <span className="text-red-500">
                Please select a city from the dropdown
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Check-in</label>
          <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date)}
            minDate={new Date()}
            className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Check-out</label>
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date)}
            minDate={checkInDate}
            className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)]"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium">Rooms</label>
          <select
            value={rooms}
            onChange={(e) => setRooms(parseInt(e.target.value))}
            className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)]"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Room" : "Rooms"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Adults</label>
          <select
            value={adults}
            onChange={(e) => setAdults(parseInt(e.target.value))}
            className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)] text-sm"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Children</label>
          <select
            value={children}
            onChange={(e) => {
              const count = parseInt(e.target.value);
              setChildren(count);
              setChildrenAges(Array(count).fill(0));
            }}
            className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)] text-sm"
          >
            {[...Array(5)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        {children > 0 && (
          <div className="">
            <label className="block text-sm font-medium">Children Ages</label>
            <div className="">
              {childrenAges.map((age, index) => (
                <select
                  key={index}
                  value={age}
                  onChange={(e) => {
                    const newAges = [...childrenAges];
                    newAges[index] = parseInt(e.target.value);
                    setChildrenAges(newAges);
                  }}
                  className="block w-full pl-10 pr-10 rounded-md border-[var(--border-color)] shadow-sm px-2 py-1 bg-[var(--container-color)] text-[var(--text-color)] text-sm"
                >
                  {[...Array(18)].map((_, i) => (
                    <option key={i} value={i}>
                      {i} {i === 1 ? "year" : "years"}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <button
            type="submit"
            disabled={isSearching}
            className={`w-full py-3 px-6 rounded-md text-white font-medium transition-colors ${
              isSearching
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSearching ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Searching...
              </span>
            ) : (
              "Find Hotels"
            )}
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </form>
  );
};

export default HotelSearch;
