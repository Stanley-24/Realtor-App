import { LogoBlack } from "../../../components/Logo";
export default function ContactForm() {
  return (
    <div id="contact" className="bg-black/85 text0-white py-12 px-6 md:px-14 flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between gap-8">
      <div className="md:w-1/3 w-full flex flex-col items-center md:items-start text-center md:text-left">
        <h3 className="font-bold mb-2 font-head text-gray-300 text-xl">Send Us Message</h3>
        <p className="text-sm font-jetbrain text-gray-300 mb-4">
          Reach out to us using the form below
        </p>
        <form className="flex font flex-col space-y-3 w-full">
          <input type="text" placeholder="Full name" className="input input-bordered w-full cursor-text hover:bg-btn-colors/30" />
          <input type="email" placeholder="Your email" className="input input-bordered w-full cursor-text hover:bg-btn-colors/30" />
          <textarea placeholder="Your message" className="textarea textarea-bordered w-full cursor-text hover:bg-btn-colors/30"></textarea>
          <button 
            className=" bg-btn-colors opacity-70 text-white px-4 py-2 sm:px-6 sm:py-3 
            mt-5 sm:mt-6 rounded-full hover:bg-secondary-blue/80 transition 
            font-semibold shadow-lg text-sm sm:text-base">
              Send message

          </button>
        </form>
      </div>

      <div className="md:w-1/3 w-full flex flex-col items-center text-center">
        <h3 className="font-bold mb-2 font-head text-gray-300 text-xl">Sitemap</h3>
        <ul className="space-y-3 font-jetbrain text-lg text-gray-300">
          <li>About us</li>
          <li>Contact Us</li>
          <li>Join the team</li>
          <li>Refer and earn $2000</li>
        </ul>
      </div>

      <div className="md:w-1/3 w-full flex flex-col items-center justify-center space-y-3 text-center">
        <LogoBlack/>
        <p className=" text-gray-300 font-jetbrain">📞 +234 81213997001</p>
        <p className=" text-gray-300 font-jetbrain">✉️ Owarieta24@gmail.com</p>
      </div>
    </div>
  );
}

