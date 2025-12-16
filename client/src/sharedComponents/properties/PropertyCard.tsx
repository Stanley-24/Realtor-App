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

  const hasMultipleImages = p.images && p.images.length > 1;

  return (
    <div className="relative bg-white shadow-2xl rounded-3xl overflow-hidden group h-full flex flex-col transition-all duration-300 hover:shadow-3xl">

      {/* IMAGE CAROUSEL */}
      <div className="relative h-80 md:h-56 lg:h-64 bg-gray-300 overflow-hidden">
        {p.images?.length ? (
          <>
            <img
              src={p.images[currentIndex]}
              alt={p.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* ARROWS - Only show if more than 1 image */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-pinky/90 text-white w-12 h-12 rounded-full hover:bg-secondary-blue flex items-center justify-center text-2xl backdrop-blur-sm shadow-lg z-20 transition-all hover:scale-110"
                  aria-label="Previous image"
                >
                  ❮
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-pinky/90 text-white w-12 h-12 rounded-full hover:bg-secondary-blue flex items-center justify-center text-2xl backdrop-blur-sm shadow-lg z-20 transition-all hover:scale-110"
                  aria-label="Next image"
                >
                  ❯
                </button>
              </>
            )}

            {/* DOTS - Only show if more than 1 image */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {p.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "bg-white scale-125 shadow-md"
                        : "bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
            No Image
          </div>
        )}
      </div>

      {/* DETAILS SECTION */}
      <div className="p-8 md:p-6 bg-light-blue text-gray-100 flex flex-col flex-grow">
        <h3 className="font-bold font-jetbrain text-2xl md:text-xl mb-3 leading-tight">
          {p.title}
        </h3>
        <p className="text-base font-bold font-head md:text-sm opacity-90 mb-4">
          {p.location}
        </p>
        <p className="text-base font-bold font-head md:text-sm text-gray-200 mb-6">
          {p.bedrooms} Beds • {p.bathrooms} Baths • {p.squareFootage} sqft
        </p>
        <p className="font-bold text-3xl font-head md:text-2xl text-white mt-auto">
          {p.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
        </p>
      </div>

      {/* Subtle hover overlay */}
      <div className="absolute inset-0 bg-btn-colors/40 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl pointer-events-none md:pointer-events-auto z-10" />
    </div>
  );
}