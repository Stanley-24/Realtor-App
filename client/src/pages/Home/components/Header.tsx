import { useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import LogoWhite from "../../../sharedComponents/Logo";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="py-2 shadow-sm bg-gray-200">
      <div className="container flex items-center justify-between">
        
        {/* Logo */}
        <LogoWhite />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[16px] font-medium font-jetbrain">
          <Link to="/" className="hover:text-btn-colors">Home</Link>
          <Link to="/products" className="hover:text-btn-colors">Properties</Link>
          <Link to="/about" className="hover:text-btn-colors">About</Link>
          <Link
            to="/#contact"
            className="hover:text-btn-colors"
            onClick={(e) => {
              e.preventDefault();

              const pathname = window.location.pathname.replace(/\/$/, "");

              const scrollToContact = () => {
                const el = document.getElementById("contact");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                  return true;
                }
                return false;
              };

              // Already on homepage → scroll directly
              if (pathname === "" || pathname === "/") {
                if (!scrollToContact()) setTimeout(scrollToContact, 100);
                return;
              }

              // On another route → go to /#contact
              window.location.href = "/#contact";
            }}
          >
            Contact
          </Link>

        </nav>
      
        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <style>{`
            header {
              position: sticky;
              top: 0;
              z-index: 50;
            }
          `}</style>
  
          <Link 
            to="/signup" 
            className="bg-pinky
            hover:bg-dark-gradient-hover
            text-white
            px-7
            py-3
            rounded-full
            text-center
            font-semibold
            text-base
            hover:shadow-cyan-500/20
            hover:scale-105
            transition-all
            duration-500 
            ease-out
        

            "
          >
            Get Started
          </Link>
        </div>
      
          {/* Mobile menu toggle */}
          <button 
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <XMarkIcon className="w-7 h-7" />
            ) : (
              <Bars3Icon className="w-7 h-7" />
            )}
          </button>
        </div>
        

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-gray-200 border-t">
            <nav className="flex flex-col gap-4 p-4 text-lg font-medium font-jetbrain">
              <Link  className="hover:text-btn-colors" to="/" onClick={() => setOpen(false)}>Home</Link>
              <Link className="hover:text-btn-colors" to="/products" onClick={() => setOpen(false)}>Properties</Link>
              <Link className="hover:text-btn-colors" to="/about" onClick={() => setOpen(false)}>About</Link>
              <Link className="hover:text-btn-colors"
                to="/#contact"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);

                  const pathname = window.location.pathname.replace(/\/$/, "");

                  const scrollToContact = () => {
                    const el = document.getElementById("contact");
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "center" });
                      return true;
                    }
                    return false;
                  };

                  // Already on homepage → scroll directly
                  if (pathname === "" || pathname === "/") {
                    if (!scrollToContact()) setTimeout(scrollToContact, 100);
                    return;
                  }

                  // On another route → go to /#contact
                  window.location.href = "/#contact";
                }}
              >
                Contact
              </Link>
              
              <hr className="my-1" />

              <Link
                to="/login"
                className="bg-blue-gradient text-white px-5 py-2 rounded-full text-center hover:bg-dark-gradient-hover transition"
                onClick={() => setOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      
    </header>
  );
}
