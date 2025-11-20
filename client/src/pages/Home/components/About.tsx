import img1 from "../../../assets/images/owner.jpeg";
import { Link } from "react-router-dom";
export default function About() {
  return (
    <section className="bg-background-blue py-8 flex flex-col md:flex-row items-center gap-8 px-8">
      <div className=" relative rounded-2xl overflow-hidden group">

        <img 
          src={img1} 
          alt="About" 
          className="w-full h-full object-cover rounded-2xl" 
          loading="lazy"
        />

        <div 
          className="absolute inset-0 bg-btn-colors/60 opacity-0 group-hover:opacity-40 cursor-pointer transition-opacity duration-300 rounded-2xl">
        </div>

      </div>

      <div className="md:px-7 md:w-1/2">
        <h2 className="text-2xl text-gray-100 font-head font-bold mb-4">Join our innovation</h2>
        <p className="text-base text-gray-200 font-jetbrain font-normal max-w-[480px] text-wrap mb-6">
          We're creating a system where Africa can buy and sell properties with ease. Our platform leverages cutting-edge technology to connect buyers and sellers, ensuring a seamless and efficient experience for all users. Whether you're looking to find your dream home or sell your property quickly, we're here to help you every step of the way.
        </p>
        <Link
          to="/signup"
         className=" bg-btn-colors text-white px-4 py-2 sm:px-6 sm:py-3 
            mt-5 sm:mt-6 rounded-full hover:bg-gray-100 hover:text-black transition 
            font-semibold shadow-lg text-sm sm:text-base"
        >
        Join Us
        </Link>
      </div>
    </section>
  );
}
// Reduce the About image width on md+ screens by injecting a small stylesheet.
// Targets the first md:w-1/2 child inside the About section to avoid affecting other components.
(function () {
  if (typeof window === "undefined") return;
  const id = "about-image-width-override";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @media (min-width: 768px) {
      section.bg-gray-100 > [class*="md:w-1/2"]:first-child {
        width: 33.333333% !important;
        max-width: 33.333333% !important;
      }
    }
  `;
  document.head.appendChild(style);
})();