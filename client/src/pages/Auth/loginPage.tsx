import { useState, type FormEvent } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { getDashboardUrl } from "../../lib/utils";
import img1 from "../../assets/images/images4.jpeg";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import GoogleAuthButton from "../../sharedComponents/GoogleAuthButton";

export default function LoginPage() {
  const { login, loading, error, user, initializing } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Wait for auth check to complete
  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  // Redirect authenticated users to their dashboard
  if (user) {
    return <Navigate to={getDashboardUrl(user.role)} replace />;
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const redirectUrl = await login(email, password); // will now return backend URL

    if (redirectUrl) {
      navigate(redirectUrl, { replace: true }); // redirects immediately
    }
  };


  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block bg-light-blue/90">
        <div className="h-full overflow-hidden rounded-l-lg bg-background-blue shadow-lg rounded-full">
          <img
            src={img1}
            alt="Login visual"
            className="w-full h-full object-cover  opacity-80 object-center transform transition duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-6 md:p-10 bg-primary-blue relative min-h-screen md:min-h-0">
        <Link
          to="/"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-4 md:left-4 inline-flex items-center text-white font-jetbrain font-normal hover:text-gray-200 transition text-sm sm:text-base z-10"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </Link>

        <div className="w-full max-w-md mt-8 sm:mt-12 md:mt-0">
          <form onSubmit={handleLogin} className="w-full space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold font-jetbrain text-center md:text-left">
              Welcome Back to <span className="text-white cursor-pointer">Rental Wave</span>
            </h1>

            {error && <p className="text-red-500 text-sm sm:text-base">{error}</p>}

            <input
              type="email"
              className="input input-bordered w-full bg-white text-gray-800 placeholder-gray-400 text-sm sm:text-base"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />

            <input
              type="password"
              className="input input-bordered w-full bg-white text-gray-800 placeholder-gray-400 text-sm sm:text-base"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            />

            <button 
              className="bg-pinky px-5 py-2.5 sm:py-3 rounded-full font-bold font-jetbrain hover:bg-blue-gradient transition w-full text-white text-base sm:text-base" 
              disabled={loading}
            >
              {loading ? "Processing..." : "Login"}
            </button>

            <div className="flex flex-row justify-between items-center text-xs sm:text-sm">
              <Link to="/forgot-password" className="text-white font-jetbrain font-normal hover:text-btn-colors">
                Forgot Password?
              </Link>

              <Link to="/signup" className="text-white font-jetbrain font-normal hover:text-btn-colors">
                New here? Sign up
              </Link>
            </div>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="flex-grow h-[1px] bg-pinky" />
            <span className="text-white text-xs sm:text-sm">or</span>
            <div className="flex-grow h-[1px] bg-pinky" />
          </div>

          <GoogleAuthButton />
        </div>
      </div>
    </div>
  );
}
