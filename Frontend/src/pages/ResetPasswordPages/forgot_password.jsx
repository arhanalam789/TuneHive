import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "https://tunehive-nw51.onrender.com";

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("⚠️ Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/sendotp`, { email });
      toast.success(res.data.message || "OTP sent successfully!");
      navigate("/verify-otp", { state: { email } }); 
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.message || "Error sending OTP.");
      } else {
        setError("🚫 Unable to connect to the server.");
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
          <h1 className="text-white text-4xl font-bold">Forgot Password</h1>
          <p className="text-neutral-400 text-sm mt-2">
            Enter your email and we'll send an OTP to reset your password.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-purple-800 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-500"
            } text-white font-semibold py-3 rounded-full transition-colors`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <div className="text-center">
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
