import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
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
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-full transition-colors"
          >
            Log In
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
          <p className="text-neutral-400 text-sm mb-4">
            Don't have an account?
          </p>
          <Link to="/signup" className="block w-full border border-neutral-700 hover:border-purple-500 text-white font-semibold py-3 rounded-full transition-colors text-center">
            Sign up for TuneHive
          </Link>
        </div>
      </div>
    </div>
  );
}