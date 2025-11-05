import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const API_URL = import.meta.env.VITE_API_URL || "https://tunehive-nw51.onrender.com";

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("⚠️ Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("❌ Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/reset-password`, {
        email,
        newPassword,
      });

      toast.success(res.data.message || "Password reset successful!");
      navigate("/login"); 
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.message || "Error resetting password.");
      } else {
        setError("🚫 Cannot connect to the server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <img
              src="https://i.pinimg.com/originals/91/22/60/912260373c0d9bee4d5bbf80d1af8033.jpg"
              alt="TuneHive"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <h1 className="text-white text-4xl font-bold">Reset Password</h1>
          <p className="text-neutral-400 text-sm mt-2">
            Set a new password for <br />
            <span className="text-purple-400">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-white text-sm font-medium mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-white text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-purple-800 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-500"
            } text-white font-semibold py-3 rounded-full transition-colors`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <div className="text-center mt-2">
            <Link
              to="/login"
              className="text-white text-sm underline hover:text-purple-400"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
