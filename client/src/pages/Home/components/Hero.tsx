import { useState, useEffect } from "react";
import img1 from "../../../assets/images/images6.jpg";
//import img2 from "../../../assets/images/images4.jpeg";
import img3 from "../../../assets/images/images7.jpg";
import img4 from "../../../assets/images/images8.png";
import { Link } from "react-router-dom";

const slides = [img1, img3, img4];

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
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center justify-center">
      
      {/* BACKGROUND SLIDES */}
      <div className="absolute  w-full h-full">
        {slides.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`slide-${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
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
          max-w-[260px] sm:max-w-2xl capitalize
        ">
          Buy. Rent. Manage.
        </h1>

        {/* PARAGRAPH */}
        <p className="
          text-base sm:text-xl 
          font-nunito
          font-normal
          bg-primary-blue/80 px-3 py-2 rounded-lg
          mt-3 sm:mt-4 text-white drop-shadow-md 
          max-w-[290px] sm:max-w-xl leading-relaxed
        ">
          A smarter way to navigate the real estate market with confidence. 
          With our app, you can easily find places, list your own property, 
          and manage everything in one simple space.
        </p>

        {/* BUTTON */}
       <Link
        to="/signup"
        className="
          bg-pinky
          hover:bg-dark-gradient-hover
          text-white
          px-8               
          py-4               
          w-52              
          mt-8
          transition-all 
          duration-500 
          ease-out
          font-semibold 
          text-lg             
          hover:shadow-cyan-500/20
          hover:scale-105
          hover:-translate-y-1
          tracking-wide       
          rounded-full
          
        "
      >
        Get Started
      </Link>
      </div>


      
    </section>
  );
}
