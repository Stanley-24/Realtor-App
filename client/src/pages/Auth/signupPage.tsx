import { useState, type FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { getDashboardUrl } from "../../lib/utils";
import img1 from "../../assets/images/images1.png";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function SignupPage() {
  const { signup, loading, error, user, initializing } = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
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

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signup(fullName, email, password, role);

    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      navigate(getDashboardUrl(currentUser.role), { replace: true });
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT IMAGE */}
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
      
      {/* RIGHT SIDE FORM */}
      <div className="flex items-center justify-center p-10 bg-background-blue relative">
        {/* BACK BUTTON */}
        <a
          href="/"
          className="absolute py-8 top-4 left-4 inline-flex items-center text-white font-jetbrain hover:text-gray-200 font-normal"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Home
        </a>

        <div className="w-full max-w-md mt-0 md:mt-0 flex flex-col justify-center h-full">
          <form onSubmit={handleSignup} className="w-full space-y-6 font-jetbrain font-normal">
            <h1 className="text-3xl font-bold font-jetbrain text-center md:text-left">
              Create a free Account with <span className="text-white cursor-pointer hover:text-gray-400">Us</span>
            </h1>

            {error && <p className="text-red-500">{error}</p>}

            <input
              className="input input-bordered w-full bg-white text-gray-800 placeholder-gray-400"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required={true}
            />

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

            <div className="flex flex-col gap-3 text-left">
              <label className="font-medium text-white">Select Role</label>

              <div className="flex items-center gap-4">

                {/* Buyer */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="Buyer"
                    checked={role === "Buyer"}
                    onChange={(e) => setRole(e.target.value)}
                    className="radio radio-primary"
                    required={true}
                  />
                  <span className="text-gray-200">Buyer</span>
                </label>

                {/* Agent */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="Agent"
                    checked={role === "Agent"}
                    onChange={(e) => setRole(e.target.value)}
                    className="radio radio-primary"
                    required={true}
                  />
                  <span className="text-gray-200">Agent</span>
                </label>

              </div>
            </div>

            <button
              className="bg-btn-colors px-5 py-2 rounded-full hover:bg-secondary-blue/80 transition w-full text-white text-base"
              disabled={loading}
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>

            <p className="text-sm text-center text-gray-200">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-gray-300 hover:text-btn-colors font-jetbrain font-semibold"
              >
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
