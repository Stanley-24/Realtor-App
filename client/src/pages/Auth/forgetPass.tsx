// src/pages/ForgotPasswordPage.tsx

import { useState, type FormEvent, useEffect } from "react"; // ← Add useEffect
import { Link, useNavigate } from "react-router-dom";
import { usePasswordResetStore } from "@/store/lostPassStore";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { apiConfig } from "@/config";

const ICON_URL = apiConfig.ICON_URL || "";

export default function ForgotPasswordPage() {
  const { forgotPassword, loading, error, success, clearMessages } = usePasswordResetStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  // ← NEW: Clear any old success/error messages when page loads
  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  // Optional: Auto-redirect after success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login"); // Better to go to login than home
      }, 5000);
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [success, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessages(); // Already good, but redundant now
    await forgotPassword(email.trim());
  };

  return (
    <div className="min-h-screen bg-background-blue flex items-center justify-center p-4 relative">
      <Link
        to="/"
        className="absolute top-6 left-6 inline-flex items-center text-white font-jetbrain font-normal hover:text-gray-200 transition text-sm sm:text-base z-10"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">Back</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div
            style={{
              background: "linear-gradient(135deg, #ba3fc0, #bbb7bb)",
              padding: "3px",
              borderRadius: "8px",
              display: "inline-block",
            }}
          >
            <img
              src={ICON_URL}
              alt="Rental Wave Logo"
              style={{
                maxWidth: "400px",
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: "6px",
              }}
            />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold font-jetbrain text-white mb-3">
                Forgot Your Password?
              </h1>
              <p className="text-gray-200 text-sm sm:text-base">
                No worries! Enter your email and we'll send you a link to reset it.
              </p>
            </div>

            {error && (
              <p className="text-red-700 text-lg text-center">{error}</p>
            )}

            {success ? (
              <div className="text-center space-y-4">
                <p className="text-green-400 text-base font-semibold">{success}</p>
                <p className="text-gray-300 text-sm">
                  Redirecting to login in 5 seconds...
                </p>
                <Link
                  to="/login"
                  className="inline-block w-full bg-pinky hover:bg-blue-gradient transition font-bold font-nunito text-white py-3 rounded-full text-base"
                >
                  Go to login Now
                </Link>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="input input-bordered w-full bg-white text-gray-800 placeholder-gray-400 disabled:bg-white disabled:text-gray-800 disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pinky hover:bg-blue-gradient transition font-bold font-nunito text-white py-3 rounded-full text-base"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </>
            )}

            <p className="text-center text-sm text-gray-200">
              Try password again ?{" "}
              <Link
                to="/login"
                className="text-gray-300 hover:text-btn-colors font-jetbrain font-semibold"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}