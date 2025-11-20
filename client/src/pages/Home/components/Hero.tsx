import { useState, useEffect } from "react";
import img1 from "../../../assets/images/images1.png";
import img2 from "../../../assets/images/images2.png";
import img3 from "../../../assets/images/images3.png";
import { Link } from "react-router-dom";

const slides = [img1, img2, img3];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000); // change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[480px] overflow-hidden flex items-center justify-center">
      
      {/* BACKGROUND SLIDES */}
      <div className="absolute inset-0 bg-primary-blue w-full h-full">
        {slides.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`slide-${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === current ? "opacity-60" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* CENTERED TEXT */}
      <div className="relative text-center z-10 flex flex-col items-center 
        max-w-3xl mx-auto px-4">

        {/* HEADING */}
        <h1 className="
          text-3xl sm:text-5xl 
          font-bold text-white font-head drop-shadow-lg leading-tight 
          max-w-[260px] sm:max-w-2xl
        ">
          Buy. Rent. Manage.
        </h1>

        {/* PARAGRAPH */}
        <p className="
          text-base sm:text-xl 
          font-jetbrain
          font-normal
          bg-primary-blue/70 px-3 py-2 rounded-lg
          mt-3 sm:mt-4 text-white drop-shadow-md 
          max-w-[280px] sm:max-w-xl leading-relaxed
        ">
          A smarter way to navigate the real estate market with confidence. 
          With our app, you can easily find places, list your own property, 
          and manage everything in one simple space.
        </p>

        {/* BUTTON */}
        <Link 
          to="/signup" 
          className="
            bg-btn-colors text-white px-4 py-2 sm:px-6 sm:py-3 
            mt-5 sm:mt-6 rounded-full hover:bg-secondary-blue/80 transition 
            font-semibold shadow-lg text-sm sm:text-base
          "
        >
          Get Started
        </Link>
      </div>


      
    </section>
  );
}
