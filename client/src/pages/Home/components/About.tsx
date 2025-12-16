import img1 from "../../../assets/images/owner2.jpg";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="bg-light-blue mt-1 py-8 md:py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        
        {/* Image Card - perfectly sized and centered like the sample */}
        <div className="w-full md:w-1/3 lg:w-2/5 flex justify-center md:justify-end">
          <div className="relative w-80 h-96 md:w-96 md:h-[480px] lg:w-[440px] lg:h-[540px] mx-auto">
            {/* Soft beige background card (behind the image) */}
            <div className="absolute inset-0 bg-[#F5E8D9] rounded-3xl shadow-xl -z-10 translate-y-4 md:translate-y-6" />

            {/* Actual image container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group h-full">
              <img
                src={img1}
                alt="Founder / Team"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Subtle dark overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center md:text-left md:w-2/3 lg:w-3/5">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Join our innovation
          </h2>
          
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto md:mx-0 mb-10">
            We're creating a system where Africa can buy and sell properties with ease. 
            Our platform leverages cutting-edge technology to connect buyers and sellers, 
            ensuring a seamless and efficient experience for all users. Whether you're 
            looking to find your dream home or sell your property quickly, we're here 
            to help you every step of the way.
          </p>

          {/* Modern Button - using your dark gradient */}
          <Link
            to="/signup"
            className="
              inline-flex items-center justify-center
              bg-pinky         
              hover:bg-white
              hover:text-gray-700
              text-white
              px-10 py-4
              rounded-full
              text-lg font-semibold
              shadow-xl hover:shadow-2xl hover:shadow-cyan-500/30
              transition-all duration-500 ease-out
              hover:scale-105 hover:-translate-y-1
              border border-cyan-800/30 hover:border-cyan-600/60
            "
          >
            Join Us
          </Link>
        </div>
      </div>
    </section>
  );
}