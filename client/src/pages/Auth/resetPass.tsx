import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // ← Changed: useParams instead of useSearchParams
import { usePasswordResetStore } from "../../store/lostPassStore";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { apiConfig } from "../../config";

const ICON_URL = apiConfig.ICON_URL || "";

export default function ResetPasswordPage() {
  const { resetPassword, loading, error, success, clearMessages } = usePasswordResetStore();
  const { token } = useParams<{ token: string }>(); // ← Now correctly reads /reset-password/:token
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  // ← NEW: Clear any old success/error messages when page loads
    useEffect(() => {
      clearMessages();
    }, [clearMessages]);
  
  // If no token in URL, show error
  if (!token) {
    return (
      <div className="min-h-screen bg-primary-blue flex items-center justify-center p-8">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Invalid Reset Link</h1>
          <p className="mb-6">The password reset link is missing or invalid.</p>
          <Link to="/forgot-password" className="text-pinky hover:underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearMessages();
    setPasswordError("");

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    await resetPassword(token, password);
  };

  // Auto-redirect on success (optional improvement)
  if (success) {
    setTimeout(() => navigate("/login"), 3000);
  }

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
                Create New Password
              </h1>
              <p className="text-gray-200 text-lg sm:text-base">
                Your new password must be at least 8 characters long.
              </p>
            </div>

            {(error || passwordError) && (
              <p className="text-red-500 text-lg text-center">{passwordError || error}</p>
            )}

            {success ? (
              <div className="text-center space-y-4">
                <p className="text-green-400 text-base font-semibold">{success}</p>
                <p className="text-gray-300 text-sm">Redirecting to login in 3 seconds...</p>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-pinky hover:bg-blue-gradient transition font-bold font-nunito text-white py-3 rounded-full"
                >
                  Go to Login Now
                </button>
              </div>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="input input-bordered w-full bg-white text-gray-800 placeholder-gray-400 disabled:bg-white disabled:text-gray-800 disabled:opacity-70"
                />

                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="input input-bordered w-full bg-white text-gray-800 placeholder-gray-400 disabled:bg-white disabled:text-gray-800 disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pinky hover:bg-blue-gradient transition font-bold font-nunito text-white py-3 rounded-full text-base"
                >
                  {loading ? "Saving..." : "Reset Password"}
                </button>
              </>
            )}

            <p className="text-center text-sm text-gray-200">
              <Link to="/login" className="text-gray-300 hover:text-btn-colors font-jetbrain font-semibold">
                Back to Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}