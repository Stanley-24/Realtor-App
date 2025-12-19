// ContactForm.tsx
import { LogoBlack } from "@/sharedComponents/Logo";
import { useContactStore } from "@/store/contactStore";

export default function ContactForm() {
  const {
    fullname,
    email,
    message,
    status,
    setFullname,
    setEmail,
    setMessage,
    submitForm,
  } = useContactStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <div
      id="contact"
      className="bg-black/85 text-white py-12 px-6 md:px-14 flex flex-col md:flex-row items-center justify-center md:justify-between gap-8"
    >
      {/* Left: Contact Form */}
      <div className="md:w-1/3 w-full flex flex-col items-center md:items-start text-center md:text-left">
        <h3 className="font-bold mb-2 font-head text-gray-300 text-xl">
          Send Us Message
        </h3>
        <p className="text-sm font-jetbrain text-gray-300 mb-4">
          Reach out to us using the form below
        </p>

        <form className="flex flex-col space-y-3 w-full text-gray-800" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="input input-bordered w-full cursor-text hover:text-gray-300 hover:bg-btn-colors/30"
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full cursor-text hover:text-gray-300 hover:bg-btn-colors/30"
            required
          />
          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="textarea textarea-bordered w-full cursor-text hover:text-gray-300 hover:bg-btn-colors/30 h-32 resize-none"
            required
          />

          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-pinky opacity-90 text-white px-4 py-2 sm:px-6 sm:py-3 
                       mt-5 sm:mt-6 rounded-full hover:bg-secondary-blue/80 transition 
                       font-semibold shadow-lg text-sm sm:text-base 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </div>

      {/* Middle: Sitemap */}
      <div className="md:w-1/3 w-full flex flex-col items-center text-center">
        <h3 className="font-bold mb-2 font-head text-gray-300 text-xl">Sitemap</h3>
        <ul className="space-y-3 font-jetbrain text-lg text-gray-300">
          <li>About us</li>
          <li>Contact Us</li>
          <li>Join the team</li>
          <li>Refer and earn $2000</li>
        </ul>
      </div>

      {/* Right: Logo & Contact Info */}
      <div className="md:w-1/3 w-full flex flex-col items-center justify-center space-y-3 text-center">
        <LogoBlack />
        <p className="text-gray-300 font-jetbrain">📞 +234 81213997001</p>
        <p className="text-gray-300 font-jetbrain">✉️ Owarieta24@gmail.com</p>
      </div>
    </div>
  );
}