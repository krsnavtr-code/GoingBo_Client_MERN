"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Utensils,
  Hotel,
  Calendar,
  Tag,
  Check,
  X,
  ChevronRight,
  HelpCircle,
  CalendarDays,
  Plane,
} from "lucide-react";
import PackageDetailImageGallary from "@/components/PackageDetailImageGallary";
import Link from "next/link";

async function getProject(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/packages/slug/${slug}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  return await res.json();
}

export default function TravelPackageDetailPage({ params }) {
  const { slug } = React.use(params);
  const [project, setProject] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await getProject(slug);
      setProject(result?.data?.project || null);
    };
    fetchData();
  }, [slug]);

  if (!project)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 text-lg">
        Loading package details...
      </div>
    );

  const location = project.location || {};

  return (
    <div className="text-[var(--text-color)]">
      {/* === HERO SECTION === */}
      <section className="relative mx-auto w-full max-w-[1600px] px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center max-w-[1200px] mx-auto">
          {/* Left Image Section */}
          <div className="col-span-12 md:col-span-6 relative flex items-center justify-center w-full">
            <div className="relative w-full aspect-[16/9] md:aspect-[5/3] rounded-xl overflow-hidden">
              <Image
                src={
                  project.mainImage?.startsWith("http")
                    ? project.mainImage
                    : `${process.env.NEXT_PUBLIC_API_URL}${
                        project.mainImage || "/default.jpg"
                      }`
                }
                alt={project.title}
                fill
                className="object-contain w-full h-full rounded-xl"
                priority
              />
            </div>
            {/* isFeatured */}
            {project.isFeatured && (
              <div className="absolute top-4 right-4 bg-green-600 text-white px-1 rounded z-100">
                Featured
              </div>
            )}
          </div>

          {/* Right Content Section */}
          <div className="col-span-12 md:col-span-6 flex flex-col justify-center">
            <div className="space-y-2">
              {/* Location Tag */}
              <div className="inline-flex items-center px-3 py-1 text-sm font-medium bg-[var(--container-color-in)] text-[var(--text-color)] rounded-full w-fit">
                <MapPin className="w-4 h-4 mr-2" />
                {`${location.city || ""}${
                  location.state ? ", " + location.state : ""
                }${location.country ? ", " + location.country : ""}`}
              </div>

              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold leading-tight text-[var(--text-color)]">
                {project.title}
              </h1>

              {/* Description */}
              <p className="text-[var(--text-color-light)] text-sm leading-relaxed">
                {project.shortDescription}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-2 items-center text-[var(--text-color)]">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-[var(--accent-color)]" />
                  <span>
                    {project.durationDay} D / {project.duration} N
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[var(--accent-color)]" />
                  <span>Only {project.availableSeats} seats left</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-400" />
                  <span>
                    {project?.ratings?.average
                      ? `${project.ratings.average.toFixed(1)} (${
                          project.ratings.count
                        } Reviews)`
                      : "No ratings yet"}
                  </span>
                </div>
              </div>

              {/* Price Card */}
              <div className="mt-6 bg-[var(--container-color-in)] max-w-[400px] p-6 rounded-2xl shadow-xl w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span>From</span>
                  {project.discount > 0 && (
                    <span className="text-sm line-through text-[var(--text-color-light)]">
                      ₹
                      {(
                        project.price *
                        (1 + project.discount / 100)
                      ).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-[var(--text-color)]">
                      ₹
                      {project.discount > 0
                        ? (
                            project.price -
                            (project.price * project.discount) / 100
                          ).toLocaleString()
                        : project.price?.toLocaleString()}
                    </span>
                    <span className="text-[var(--text-color-light)] ml-2 mb-1">
                      / person
                    </span>
                  </div>

                  {project.discount > 0 && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Save {project.discount}%
                    </span>
                  )}
                </div>

                <p className="text-sm text-[var(--text-color-light)] mt-3">
                  Best price guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === PACKAGE OVERVIEW === */}
      <section className="max-w-6xl mx-auto px-6 py-5">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-6 relative inline-block">
              <span className="relative">
                Find All About This Tour
                <span className="absolute bottom-0 left-0 w-full h-1 bg-green-600 rounded-full"></span>
              </span>
            </h2>

            <div className="space-y-2">
              <div className="max-w-none text-lg leading-relaxed prose prose-lg prose-gray">
                <div
                  id="visible-content"
                  dangerouslySetInnerHTML={{
                    __html: project.description
                      .split(" ")
                      .slice(0, 300)
                      .join(" "),
                  }}
                />
                <div
                  id="more-content"
                  className="hidden"
                  dangerouslySetInnerHTML={{
                    __html: project.description.split(" ").slice(300).join(" "),
                  }}
                />
              </div>
              {project.description.split(" ").length > 300 && (
                <button
                  onClick={() => {
                    const moreContent = document.getElementById("more-content");
                    const button = document.getElementById("read-more-btn");

                    if (moreContent.classList.contains("hidden")) {
                      moreContent.classList.remove("hidden");
                      button.textContent = "Read Less";
                    } else {
                      moreContent.classList.add("hidden");
                      button.textContent = "Read More";
                    }
                  }}
                  id="read-more-btn"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2 inline-flex items-center"
                >
                  Read More
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Sidebar with key info */}
          <div className="space-y-6">
            <div className="bg-[var(--container-color-in)] rounded-2xl p-6 shadow-sm border border-[var(--border-color)]">
              <h3 className="text-xl font-semibold mb-4">Tour Details</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-[var(--container-color-in)] p-2 rounded-lg mr-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-color-light)]">
                      Destination
                    </p>
                    <p className="font-medium">{project.destination}</p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="bg-[var(--container-color-in)] p-2 rounded-lg mr-3">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-color-light)]">
                      Group Size
                    </p>
                    <p className="font-medium">
                      {project.minTravelersRequired
                        ? `Min ${project.minTravelersRequired}`
                        : ""}
                      {project.maxTravelers
                        ? ` • Max ${project.maxTravelers} travelers`
                        : ""}
                    </p>
                  </div>
                </li>

                {/* isGroupDiscountAvailable */}
                <li className="flex items-start">
                  <div className="bg-[var(--container-color-in)] p-2 rounded-lg mr-3">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-color-light)]">
                      Group Discount
                    </p>
                    <p className="font-medium">
                      {project.isGroupDiscountAvailable
                        ? "Available"
                        : "Not Available"}
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="bg-[var(--container-color-in)] p-2 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-color-light)]">
                      Available Dates
                    </p>
                    <p className="font-medium">
                      {project.startDate
                        ? `${new Date(
                            project.startDate
                          ).toLocaleDateString()} - ${new Date(
                            project.endDate
                          ).toLocaleDateString()}`
                        : "Contact for availability"}
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="bg-[var(--container-color-in)] p-2 rounded-lg mr-3">
                    <Tag className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-color-light)]">
                      Price
                    </p>
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-[var(--accent-color)]">
                        ₹{project.price?.toLocaleString()}
                      </span>
                      {project.discount > 0 && (
                        <span className="ml-2 text-sm text-[var(--text-color-light)] line-through">
                          ₹
                          {(
                            project.price *
                            (1 + project.discount / 100)
                          ).toLocaleString()}
                        </span>
                      )}
                      {project.discount > 0 && (
                        <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Save {project.discount}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-color-light)] mt-1">
                      Per person, excluding flights
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick Facts */}
            <div className="bg-[var(--container-color-in)] rounded-2xl p-6 border border-[var(--border-color)]">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                Quick Facts
              </h3>
              <div className="">
                <div className="flex items-start mb-5">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-color-light)]">
                      Duration
                    </p>
                    <p className="font-medium">
                      {project.durationDay} Days / {project.duration} Nights
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-5">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                    <Plane className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-color-light)]">
                      Transportation
                    </p>
                    <p className="font-medium">
                      {project.transportation || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-5">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
                    <Hotel className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-color-light)]">
                      Accommodation
                    </p>
                    <p className="font-medium">
                      {project.accommodation || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-5">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg mr-3">
                    <Utensils className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-color-light)]">
                      Meal Plan
                    </p>
                    <p className="font-medium">
                      {project.mealPlan || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start mb-5">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg mr-3">
                    <Tag className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-color-light)]">
                      Package Type
                    </p>
                    <p className="font-medium">
                      {project.packageType || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Need help? */}
            <div className="bg-[var(--container-color-in)] rounded-2xl p-6 border border-[var(--border-color)]">
              <div className="flex items-start">
                <div className="p-2 rounded-lg mr-3">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold">Need help booking?</h4>
                  <p className="text-sm text-[var(--text-color-light)] mt-1">
                    Speak to our travel experts who can help plan your perfect
                    trip.
                  </p>
                  <p className="text-sm mt-3 flex items-center gap-2 text-[var(--text-color-light)]">
                    Have questions?{" "}
                    <Link
                      href="/contact"
                      className="px-2 py-1 rounded-full bg-[var(--button-bg-color)] text-[var(--button-color)] hover:bg-[var(--button-hover-color)]"
                    >
                      Contact us
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image galary */}
      <section className="mx-30 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 relative inline-block">
          <span className="relative">
            Moments You’ll Witness on This Adventure
            <span className="absolute bottom-0 left-0 w-full h-1 bg-green-600 rounded-full"></span>
          </span>
        </h2>
        <PackageDetailImageGallary images={project.imageGallery} />
      </section>

      {/* === HIGHLIGHTS / INCLUSIONS === */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-1">Tour Highlights</h2>
            <div className="w-52 h-1 bg-green-600 rounded-full mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="bg-[var(--container-color-in)] rounded-2xl p-8 shadow-sm border border-[var(--border-color)] h-full">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-[var(--accent-color)] flex items-center justify-center mr-3">
                    <Star className="w-4 h-4" />
                  </span>
                  Tour Highlights
                </h3>
                <ul className="space-y-4">
                  {project.highlights?.length > 0 ? (
                    project.highlights.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 dark:text-gray-400">
                      No highlights added
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-[var(--container-color-in)] rounded-2xl p-8 shadow-sm border border-[var(--border-color)]">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mr-3">
                    <Check className="w-4 h-4" />
                  </span>
                  What's Included
                </h3>
                <ul className="space-y-3">
                  {project.included?.length > 0 ? (
                    project.included.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 dark:text-gray-400">
                      No inclusions added
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-[var(--container-color-in)] rounded-2xl p-8 shadow-sm border border-[var(--border-color)]">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center mr-3">
                    <X className="w-4 h-4" />
                  </span>
                  What's Not Included
                </h3>
                <ul className="space-y-3">
                  {project.excluded?.length > 0 ? (
                    project.excluded.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <X className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 dark:text-gray-400">
                      No exclusions added
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === ITINERARY === */}
      {project.itinerary?.length > 0 && (
        <section className="bg-[var(--container-color-in)] py-10">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-10 text-center">Itinerary</h2>
            <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.itinerary.map((day, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl shadow-sm bg-[var(--container-color)]"
                >
                  <h3 className="text-xl font-bold mb-2">{day.title}</h3>
                  <p className=" mb-2">
                    📍 <strong>{day.location}</strong>{" "}
                    {day.locationMapLink && (
                      <a
                        href={day.locationMapLink}
                        target="_blank"
                        className="text-blue-500 hover:underline ml-1"
                      >
                        Map View
                      </a>
                    )}
                  </p>
                  <p className="">{day.description}</p>
                  {day.meals?.length > 0 && (
                    <p className="mt-2 text-sm ">
                      🍽 Meals: {day.meals.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* tags */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-2">
          {project.itcategories?.map((itcategory, i) => (
            <span
              key={itcategory._id || i}
              className="px-2 py-1 rounded-full bg-[var(--button-bg-color)] text-[var(--button-color)] hover:bg-[var(--button-hover-color)]"
            >
              {itcategory.name || itcategory._id || "Category"}
            </span>
          ))}
          {project.tags?.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded-full bg-[var(--button-bg-color)] text-[var(--button-color)] hover:bg-[var(--button-hover-color)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* === FAQs === */}
      {project.faqs?.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-10">
          <h2 className="text-3xl font-bold mb-10 text-center">FAQs</h2>
          <div className="space-y-6">
            {project.faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-300 pb-4">
                <h3 className="font-semibold text-lg mb-2">
                  Q. {faq.question}
                </h3>
                <p className="">A. {faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
