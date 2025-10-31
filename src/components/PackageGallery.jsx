"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

export default function PackageGallery({ pkg }) {
  const images =
    pkg.imageGallery?.length > 0 ? pkg.imageGallery : [pkg.mainImage];

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
      className="w-full h-44 rounded-t-xl overflow-hidden"
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <Image
            src={
              img.startsWith("http")
                ? img
                : `${process.env.NEXT_PUBLIC_API_URL}${img}`
            }
            alt={`${pkg.title} image ${index + 1}`}
            width={400}
            height={200}
            className="w-full h-44 object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
