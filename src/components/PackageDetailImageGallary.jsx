"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function ImageGallery({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const stripRef = useRef(null);
  const offsetRef = useRef(0); // 🧠 offset stored here
  const scrollSpeed = 0.4;

  useEffect(() => {
    if (!stripRef.current || !images.length) return;

    const strip = stripRef.current;
    let animationFrame;

    const loop = () => {
      if (!isHovered) {
        offsetRef.current -= scrollSpeed;

        // use modulus instead of hard reset
        const maxScroll = strip.scrollWidth / 3;
        if (Math.abs(offsetRef.current) >= maxScroll) {
          offsetRef.current = offsetRef.current % maxScroll;
        }

        strip.style.transform = `translateX(${offsetRef.current}px)`;
      }

      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [isHovered, images]);

  if (!images.length) return null;

  return (
    <div
      className="relative w-full py-5 overflow-hidden bg-[var(--container-color-in)] rounded-xl"
      style={{
        boxShadow:
          "inset 0 4px 10px rgba(0, 0, 0, 0.1), inset 0 -4px 10px rgba(0, 0, 0, 0.05)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Scrolling strip */}
      <div
        ref={stripRef}
        className="hidden md:flex items-center space-x-6"
        style={{
          whiteSpace: "nowrap",
          display: "flex",
          willChange: "transform",
        }}
      >
        {[...images, ...images, ...images].map((img, i) => (
          <div
            key={i}
            className="relative w-64 h-40 flex-shrink-0 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-500 cursor-pointer"
            onClick={() =>
              setSelectedImage(
                img.startsWith("http")
                  ? img
                  : `${process.env.NEXT_PUBLIC_API_URL}${img}`
              )
            }
          >
            <Image
              src={
                img.startsWith("http")
                  ? img
                  : `${process.env.NEXT_PUBLIC_API_URL}${img}`
              }
              alt={`Thumb ${i}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <button
            className="absolute top-6 right-6 text-white p-2 hover:bg-white/20 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <X size={28} />
          </button>
          <div className="relative w-[90vw] h-[80vh]">
            <Image
              src={selectedImage}
              alt="Full view"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
