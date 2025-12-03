import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleAuthStore } from "../../store/googleAuthStore";

export default function SelectRolePage() {
  const navigate = useNavigate();
  const { pendingGoogleUser, googleSignup, loading, user, error } = useGoogleAuthStore();

  const [role, setRole] = useState("");

  // Redirect to signup if accessed without Google login
  useEffect(() => {
    if (!pendingGoogleUser) {
      navigate("/signup", { replace: true });
    }
  }, [pendingGoogleUser, navigate]);

  // Redirect to dashboard if user already exists / after signup
  useEffect(() => {
    if (user) {
      const roleLower = user.role.toLowerCase();
      const dashboard = 
        roleLower === "agent" ? "/dashboard/agent" :
        roleLower === "buyer" ? "/dashboard/buyer" :
        "/dashboard/admin";
      navigate(dashboard, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async () => {
    if (!role) return;

    // Set the role for pending user
    useGoogleAuthStore.getState().setRoleForPendingUser(role);

    try {
      const redirectUrl = await googleSignup();

      // Redirect after successful signup
      if (redirectUrl) {
        navigate(redirectUrl, { replace: true });
      }
    } catch (err) {
      console.error("Error completing Google signup:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-blue p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Complete Your Signup</h1>

        <p className="text-gray-600 text-center mb-4">
          Hello <strong>{pendingGoogleUser?.fullName}</strong> 👋
          <br />
          Choose your account type to continue
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Role Selection */}
        <div className="flex flex-col gap-4 my-6">
          {["Buyer", "Agent"].map((r) => (
            <label key={r} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                value={r}
                checked={role === r}
                onChange={(e) => setRole(e.target.value)}
                className="radio radio-primary"
              />
              <span className="text-gray-700">{r}</span>
            </label>
          ))}
        </div>

        <button
          className="bg-btn-colors w-full py-2 rounded-full text-white text-lg hover:bg-secondary-blue/80 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading || !role}
        >
          {loading ? "Completing..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
