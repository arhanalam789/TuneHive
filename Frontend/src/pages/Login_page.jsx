import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "https://tunehive-nw51.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('⚠️ Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true } 
      );

      if (res.data.success) {
        toast.success(' Login successful!');
        navigate('/'); 
      } else {
        setError(res.data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.message || 'Invalid email or password.');
        } else if (err.response.status === 500) {
          setError('⚠️ Internal server error. Try again later.');
        } else {
          setError('❌ Something went wrong.');
        }
      } else {
        setError('🚫 Cannot connect to the server. Check your network.');
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
          <h1 className="text-white text-4xl font-bold">TuneHive</h1>
        </div>


        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-purple-800 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500'
            } text-white font-semibold py-3 rounded-full transition-colors`}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <div className="text-center">
            <Link to="/forgot-password" className="text-white text-sm underline hover:text-purple-400">
              Forgot your password?
            </Link>
          </div>
        </form>

 
        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-neutral-800"></div>
        </div>


        <div className="text-center">
          <p className="text-neutral-400 text-sm mb-4">Don't have an account?</p>
          <Link
            to="/signup"
            className="block w-full border border-neutral-700 hover:border-purple-500 text-white font-semibold py-3 rounded-full transition-colors text-center"
          >
            Sign up for TuneHive
          </Link>
        </div>
      </div>
    </div>
  );
}
