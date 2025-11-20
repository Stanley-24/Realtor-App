import { useState, type FormEvent } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { getDashboardUrl } from "../../lib/utils";
import img1 from "../../assets/images/images1.png";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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
      <div className="hidden md:block bg-btn-colors/60">
        <div className="h-full overflow-hidden rounded-l-lg bg-background-blue shadow-lg rounded-full">
          <img
            src={img1}
            alt="Login visual"
            className="w-full h-full object-cover  opacity-80 object-center transform transition duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>

      <div className="flex items-center justify-center p-10 bg-primary-blue relative">
        <Link
          to="/"
          className="absolute py-8 top-4 left-4 inline-flex items-center text-white font-jetbrain font-normal hover:text-gray-200 transition"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <div className="w-full max-w-md">
          <form onSubmit={handleLogin} className="w-full space-y-6">
            <h1 className="text-3xl font-bold font-jetbrain text-center md:text-left">
              Welcome Back to <span className="text-btn-colors cursor-pointer hover:text-white">Rental Wave</span>
            </h1>

            {error && <p className="text-red-500">{error}</p>}

            <input
              type="email"
              className="input input-bordered w-full bg-white text-gray-800 placeholder-gray-400"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />

            <input
              type="password"
              className="input input-bordered w-full bg-white text-gray-800 placeholder-gray-400"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={true}
            />

            <button className=
              "bg-btn-colors px-5 py-2 rounded-full font-jetbrain hover:bg-secondary-blue/80 transition w-full text-white text-base" 
              disabled={loading}>
              {loading ? "Processing..." : "Login"}
            </button>

            <div className="flex justify-between text-sm">
              <button className="text-white font-jetbrain font-normal hover:text-btn-colors">Forgot Password?</button>

              <Link to="/signup" className="text-white font-jetbrain font-normal hover:text-btn-colors">
                New here? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
