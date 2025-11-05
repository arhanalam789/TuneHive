import { useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const API_URL = import.meta.env.VITE_API_URL || "https://tunehive-nw51.onrender.com";

  
  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^[0-9]?$/.test(value)) return; 
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("⚠️ Please enter all 6 digits of the OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/verifyotp`, {
        email,
        otp: enteredOtp,
      });

      toast.success(res.data.message || "OTP verified successfully!");
      navigate("/reset-password", { state: { email } }); // redirect to reset password
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.message || "Invalid OTP. Try again.");
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
          <h1 className="text-white text-4xl font-bold">Verify OTP</h1>
          <p className="text-neutral-400 text-sm mt-2">
            Enter the 6-digit OTP sent to <br />
            <span className="text-purple-400">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="flex justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 bg-neutral-900 border border-neutral-700 rounded-md text-center text-white text-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-purple-800 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-500"
            } text-white font-semibold py-3 rounded-full transition-colors`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-white text-sm underline hover:text-purple-400"
            >
              Resend OTP
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
