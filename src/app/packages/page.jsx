import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Users, Star } from "lucide-react";
import PackageGallery from "@/components/PackageGallery";
import { styleEffect } from "framer-motion";

async function getPackages() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/packages?isPublished=true`,
      { 
        next: { revalidate: 60 },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000) 
      }
    );
    
    if (!res.ok) {
      console.error('Failed to fetch packages:', res.status, res.statusText);
      return { data: { projects: [] }, error: 'Failed to load packages' };
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching packages:', error);
    return { data: { projects: [] }, error: error.message };
  }
}

export default async function PackagesPage() {
  const result = await getPackages();
  const packages = result.data?.projects || [];

  return (
    <div className="container mx-auto px-4 py-12 text-[var(--text-color)]">
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold mb-3">All Travel Packages</h1>
        <p className="text-base max-w-2xl mx-auto">
          Explore our exclusive travel deals and limited-time offers ✈️
        </p>
      </div>

      {result.error ? (
        <div className="text-center py-12 text-red-500">
          <p>Error loading packages: {result.error}</p>
          <p className="mt-2">Please try again later or contact support if the issue persists.</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12">
          <p>No packages found. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2">
          {/* Filter Sidebar */}
          <div className="col-span-2 space-y-2 overflow-y-auto h-[calc(100vh-8rem)] sticky top-24 pr-2">
            {/* Scrollable container */}
            <div className="space-y-2">
              {/* Categories Filter */}
              <div className="rounded-xl overflow-hidden shadow-lg border border-[var(--border-color)] bg-[var(--container-color-in)] p-5">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {[
                    "Adventure",
                    "Honeymoon",
                    "Family",
                    "Solo",
                    "Luxury",
                    "Beach",
                    "Mountain",
                  ].map((category) => (
                    <label
                      key={category}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-[var(--border-color)]"
                      />
                      <span>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div className="rounded-xl overflow-hidden shadow-lg border border-[var(--border-color)] bg-[var(--container-color-in)] p-5">
                <h3 className="font-semibold mb-3">Duration (in Days)</h3>
                <div className="space-y-2">
                  {["1-3", "4-7", "8-14", "15+"].map((range) => (
                    <label
                      key={range}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-[var(--border-color)]"
                      />
                      <span>{range} Days</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Filter */}
              <div className="rounded-xl overflow-hidden shadow-lg border border-[var(--border-color)] bg-[var(--container-color-in)] p-5">
                <h3 className="font-semibold mb-3">Budget Per Person (in ₹)</h3>
                <div className="space-y-2">
                  {[
                    "Under 10,000",
                    "10,000 - 20,000",
                    "20,000 - 50,000",
                    "50,000+",
                  ].map((range) => (
                    <label
                      key={range}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-[var(--border-color)]"
                      />
                      <span>₹{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hotel Star Rating */}
              <div className="rounded-xl overflow-hidden shadow-lg border border-[var(--border-color)] bg-[var(--container-color-in)] p-5">
                <h3 className="font-semibold mb-3">Hotel Star Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <label
                      key={stars}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-[var(--border-color)]"
                      />
                      <div className="flex">
                        {[...Array(stars)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Activities Filter */}
              <div className="rounded-xl overflow-hidden shadow-lg border border-[var(--border-color)] bg-[var(--container-color-in)] p-5">
                <h3 className="font-semibold mb-3">Activities</h3>
                <div className="space-y-2">
                  {[
                    "Trekking",
                    "Sightseeing",
                    "Safari",
                    "Beach",
                    "Shopping",
                    "Cultural",
                  ].map((activity) => (
                    <label
                      key={activity}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-[var(--border-color)]"
                      />
                      <span>{activity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cities Filter */}
              <div className="rounded-xl overflow-hidden shadow-lg border border-[var(--border-color)] bg-[var(--container-color-in)] p-5">
                <h3 className="font-semibold mb-3">Cities</h3>
                <div className="space-y-2">
                  {[
                    "Mumbai",
                    "Delhi",
                    "Goa",
                    "Kerala",
                    "Rajasthan",
                    "Himachal",
                  ].map((city) => (
                    <label
                      key={city}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-[var(--border-color)]"
                      />
                      <span>{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Inclusions Filter */}
              <div className="rounded-xl overflow-hidden shadow-lg border border-[var(--border-color)] bg-[var(--container-color-in)] p-5">
                <h3 className="font-semibold mb-3">Inclusions</h3>
                <div className="space-y-2">
                  {[
                    "Breakfast",
                    "Lunch",
                    "Dinner",
                    "Sightseeing",
                    "Airport Transfer",
                    "Guide",
                  ].map((inclusion) => (
                    <label
                      key={inclusion}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-[var(--border-color)]"
                      />
                      <span>{inclusion}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Package card */}
          <div className="col-span-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="rounded-xl overflow-hidden shadow-md border border-[var(--border-color)] bg-[var(--container-color-in)] hover:shadow-lg transition duration-300"
                >
                  {pkg.endDate && (
                    <div className="bg-amber-100 text-amber-900 text-xs font-medium text-center py-1 px-2">
                      Hurry up! Offer valid till{" "}
                      {new Date(pkg.endDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  )}

                  {/* Image Section */}
                  <div className="relative">
                    <Link href={`/packages/${pkg.slug || pkg._id}`}>
                      <PackageGallery pkg={pkg} />
                    </Link>

                    {/* Discount Badge */}
                    {pkg.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm z-10">
                        {pkg.discount}% OFF
                      </div>
                    )}
                    {pkg.itcategories?.length > 0 && (
                      <div className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm z-10">
                        {pkg.itcategories.map((cat) => cat.name).join(", ")}
                      </div>
                    )}

                    {/* At image in bottom */}
                    {/* <div className="absolute bottom-2 left-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} /> {pkg.destination || "—"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={18} /> {pkg.durationDay} Days /{" "}
                        {pkg.duration} Nights
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={18} /> Max {pkg.maxTravelers} Travelers
                      </div>
                      {pkg.ratings?.average && (
                        <div className="flex items-center gap-2">
                          <Star size={18} className="text-yellow-400" />
                          {pkg.ratings.average.toFixed(1)} ({pkg.ratings.count}{" "}
                          reviews)
                        </div>
                      )}
                    </div> */}
                  </div>

                  {/* Content */}
                  <div className="p-3 flex flex-col justify-between min-h-[200px]">
                    {/* Title */}
                    <Link href={`/packages/${pkg.slug || pkg._id}`}>
                      <h2 className="text-base font-semibold hover:text-[var(--logo-color)] transition line-clamp-2">
                        {pkg.title}
                      </h2>
                    </Link>

                    {/* Description */}
                    <p className="text-xs text-[var(--text-color-light)] line-clamp-2">
                      {pkg.shortDescription}
                    </p>

                    {/* Duration */}
                    <p className="text-xs text-[var(--text-color-light)]">
                      {pkg.durationDay}D / {pkg.duration}N •{" "}
                      {/* <span className="text-amber-700 font-medium">
                        {pkg.accommodation || ""}
                      </span>{" "}
                      Included */}
                    </p>

                    {/* Price Section */}
                    <div className="">
                      {pkg.discount ? (
                        <>
                          <div className="flex items-center gap-1">
                            <div className="text-lg font-bold text-green-600">
                              ₹{" "}
                              {(
                                pkg.price -
                                (pkg.price * parseFloat(pkg.discount)) / 100
                              ).toLocaleString("en-IN")}
                            </div>
                            <span className="text-[11px] text-gray-400 line-through">
                              ₹ {pkg.price.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-lg font-bold text-green-600">
                          ₹ {pkg.price?.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>

                    {/* Ratings */}
                    {pkg.ratings && (
                      <div className="text-xs text-[var(--text-color-light)] flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold">
                          {pkg.ratings.average}
                        </span>
                        <span className="text-[var(--text-color-light)]">
                          ({pkg.ratings.count} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-[var(--border-color)] flex text-[12px]">
                    <span className="w-1/2 text-center font-medium py-2 bg-[var(--container-color-in)] hover:bg-[var(--container-color-in)] transition">
                      {pkg.availableSeats} seats left
                    </span>
                    <Link
                      href={`/packages/${pkg.slug || pkg._id}`}
                      className="w-1/2 text-center font-medium py-2 bg-[var(--button-bg-color)] hover:bg-[var(--button-hover-color)] transition text-[var(--button-color)]"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
