import { Music, ListMusic, Library, Album } from 'lucide-react';
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "https://tunehive-nw51.onrender.com";

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/adminauth/logout`, {}, { withCredentials: true });
      if (res.data.success) {
        toast.success("Logged out successfully!");
        setTimeout(() => navigate("/admin-login"), 1500);
      } else {
        toast.error(res.data.message || "Logout failed!");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong while logging out.");
    }
  };

  const adminCards = [
    {
      title: 'Add a Song',
      description: 'Upload and manage individual tracks',
      icon: Music,
      link: '/admin-home/add-song',
      gradient: 'from-purple-900/20 to-purple-600/20'
    },
    {
      title: 'Add a Playlist',
      description: 'Create and curate playlists',
      icon: ListMusic,
      link: '/admin/add-playlist',
      gradient: 'from-violet-900/20 to-violet-600/20'
    },
    {
      title: 'All Songs',
      description: 'View your uploaded tracks',
      icon: Library,
      link: '/admin-home/all-song',
      gradient: 'from-indigo-900/20 to-indigo-600/20'
    },
    {
      title: 'All Playlists',
      description: 'Manage your playlist collection',
      icon: Album,
      link: '/admin/all-playlists',
      gradient: 'from-purple-900/20 to-indigo-600/20'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://i.pinimg.com/originals/91/22/60/912260373c0d9bee4d5bbf80d1af8033.jpg" 
              alt="TuneHive" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <h1 className="text-white text-2xl font-bold">TuneHive</h1>
          </div>

          <button
            onClick={handleLogout}
            className="text-neutral-400 hover:text-white transition-colors text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-white text-4xl font-bold mb-3">Welcome back, Admin</h2>
          <p className="text-neutral-400 text-lg">Manage your music library and playlists</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <a
                key={index}
                href={card.link}
                className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-8 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-purple-600/10 border border-purple-500/20 group-hover:bg-purple-600/20 transition-colors">
                    <Icon className="w-7 h-7 text-purple-400" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-white text-2xl font-semibold mb-2 group-hover:text-purple-300 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {card.description}
                  </p>

                  <div className="mt-6 flex items-center text-neutral-500 group-hover:text-purple-400 transition-colors">
                    <span className="text-sm font-medium mr-2">Manage</span>
                    <svg 
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
            <p className="text-neutral-400 text-sm mb-2">Total Songs</p>
            <p className="text-white text-3xl font-bold">0</p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
            <p className="text-neutral-400 text-sm mb-2">Total Playlists</p>
            <p className="text-white text-3xl font-bold">0</p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
            <p className="text-neutral-400 text-sm mb-2">Active Users</p>
            <p className="text-white text-3xl font-bold">0</p>
          </div>
        </div>
      </main>
    </div>
  );
}
