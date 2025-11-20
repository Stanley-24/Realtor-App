import { useState } from "react";
import type { Property } from "../../store/productStore";

export default function PropertyCard({ p }: { p: Property }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === p.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? p.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative bg-white shadow rounded-lg overflow-hidden group">

      {/* IMAGE CAROUSEL */}
      <div className="relative h-48 bg-gray-300 overflow-hidden">

        {p.images?.length ? (
          <>
            <img
              src={p.images[currentIndex]}
              alt={p.title}
              className="object-cover w-full h-full transition-all duration-300"
            />

            {/* LEFT ARROW */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-primary-blue text-white p-1 rounded-full hover:bg-secondary-blue z-20"
            >
              ❮
            </button>

            {/* RIGHT ARROW */}
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-blue text-white p-1 rounded-full hover:bg-secondary-blue z-20"
            >
              ❯
            </button>

            {/* DOTS */}
            <div className="absolute bottom-2 inset-x-0 flex justify-center gap-2 z-20">
              {p.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-white scale-125"
                      : "bg-white/40"
                  }`}
                ></div>
              ))}
            </div>

          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* DETAILS */}
      <div className="p-4 bg-primary-blue font-jetbrain text-gray-100">
        <h3 className="font-semibold font-head text-lg">{p.title}</h3>
        <p className="text-sm mb-2">{p.location}</p>
        <p className="text-sm text-gray-200">
          {p.bedrooms} Beds • {p.bathrooms} Baths • {p.squareFootage} sqft
        </p>
        <p className="font-bold text-gray-200 mt-2">
          ₦{p.price.toLocaleString()}
        </p>
      </div>
      {/* HOVER OVERLAY */}
      <div 
        className="absolute inset-0 bg-btn-colors/60 cursor-pointer opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-2xl z-10">
      </div>

    </div>

  );
}
