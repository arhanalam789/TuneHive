import { ChevronDown, Settings, LogOut, Search, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { usePlayer } from '../context/PlayerContext';

export default function UserHomePage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState({ username: 'User' });
  const [allPlaylists, setAllPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likedSongs, setLikedSongs] = useState([]);
  const navigate = useNavigate();
  const { playSong } = usePlayer();
  const API_URL = import.meta.env.VITE_API_URL || "https://tunehive-nw51.onrender.com";

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchPlaylists();
    fetchLikedSongs();
  }, []);

  useEffect(() => {
    if (activeFilter === 'Music' || searchQuery) {
      fetchSongs();
    } else if (activeFilter === 'Liked Songs') {
      fetchFullLikedSongs();
    }
  }, [activeFilter, searchQuery, page]);

  const fetchPlaylists = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/adminpower/all-playlists`);
      if (res.data.success) {
        setAllPlaylists(res.data.playlists);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const fetchLikedSongs = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      const res = await axios.get(`${API_URL}/api/user/liked-songs`, {
        headers: { Cookie: `token=${token}` },
        withCredentials: true
      });
      if (res.data.success) {
        setLikedSongs(res.data.likedSongs.map(song => song._id));
      }
    } catch (error) {
      console.error("Error fetching liked songs:", error);
    }
  };

  const fetchFullLikedSongs = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;
      const res = await axios.get(`${API_URL}/api/user/liked-songs`, {
        headers: { Cookie: `token=${token}` },
        withCredentials: true
      });
      if (res.data.success) {
        setSongs(res.data.likedSongs);
        setTotalPages(1); // No pagination for liked songs for now
      }
    } catch (error) {
      console.error("Error fetching full liked songs:", error);
    }
  };

  const fetchSongs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/adminpower/all-songs`, {
        params: { page, limit: 10, search: searchQuery }
      });
      if (res.data.success) {
        setSongs(res.data.songs);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const handleLike = async (songId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        navigate('/login');
        return;
      }
      const res = await axios.post(`${API_URL}/api/user/toggle-like`, { songId }, {
        headers: { Cookie: `token=${token}` },
        withCredentials: true
      });
      if (res.data.success) {
        if (res.data.isLiked) {
          setLikedSongs([...likedSongs, songId]);
        } else {
          setLikedSongs(likedSongs.filter(id => id !== songId));
        }
      }
    } catch (error) {
      console.error("Error liking song:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const playlists = [
    { name: 'Liked Songs', count: '336 songs', icon: '💜', playing: false },
    { name: 'Symmetry - Karan Aujla x Ed Sheeran', count: 'Playlist • Topsify Canada', playing: false },
    { name: 'Top 50 Urdu Qawwalies', count: 'Album • Nusrat Fateh Ali Khan', playing: true },
    { name: 'Weeknd Hours', count: 'Playlist • arkamareeb', playing: false },
    { name: 'Farak', count: 'Artist', playing: false },
    { name: 'Wavy', count: 'Single • Karan Aujla', playing: false },
    { name: 'K', count: 'Playlist • arhanalam', playing: false },
    { name: 'Her', count: 'Playlist • arhanalam', playing: false },
  ];



  return (

    <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 p-0.5">
              <img
                src="https://i.pinimg.com/originals/91/22/60/912260373c0d9bee4d5bbf80d1af8033.jpg"
                alt="TuneHive"
                className="w-full h-full rounded-full object-cover border-2 border-black"
              />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
              TuneHive
            </h1>
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                placeholder="What do you want to play?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:bg-white/10 focus:border-purple-500/50 transition-all"
              />
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 px-2 py-1.5 pr-4 rounded-full transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm font-bold shadow-lg">
                {user.username.charAt(0)}
              </div>
              <span className="font-medium text-sm hidden sm:block">{user.username}</span>
              <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#121212] rounded-xl shadow-2xl border border-white/10 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-white/5 mb-1">
                  <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                </div>
                <a href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </a>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left">
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, <span className="text-purple-400">{user.username}</span>
          </h2>
          <p className="text-neutral-400">Jump back into your favorite tunes.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Music', 'Liked Songs'].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setPage(1);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeFilter === filter
                ? 'bg-white text-black hover:bg-neutral-200'
                : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Content */}
        {(activeFilter === 'Music' || activeFilter === 'Liked Songs' || searchQuery) ? (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
              {songs.map((song) => (
                <div
                  key={song._id}
                  className="group bg-neutral-900/40 hover:bg-neutral-800/60 p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/10 border border-white/5 hover:border-white/10 cursor-pointer relative"
                >
                  <div className="relative mb-4 aspect-square rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={song.imageurl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300"}
                      alt={song.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSong(song, songs);
                      }}
                      className="absolute bottom-3 right-3 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-black/50 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:bg-purple-500"
                    >
                      <span className="text-white text-xl ml-1">▶</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold mb-1 truncate text-base">{song.title}</h3>
                      <p className="text-neutral-400 text-sm truncate">{song.artist}</p>
                    </div>
                    <button
                      onClick={(e) => handleLike(song._id, e)}
                      className={`ml-2 p-1 rounded-full hover:bg-white/10 transition-colors ${likedSongs.includes(song._id) ? 'text-purple-500' : 'text-neutral-400'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 bg-white/5 rounded-full disabled:opacity-50 hover:bg-white/10 transition"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-neutral-400">Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 bg-white/5 rounded-full disabled:opacity-50 hover:bg-white/10 transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {allPlaylists.map((playlist) => (
              <div
                key={playlist._id}
                onClick={() => navigate(`/playlist/${playlist._id}`)}
                className="group bg-neutral-900/40 hover:bg-neutral-800/60 p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-900/10 border border-white/5 hover:border-white/10 cursor-pointer"
              >
                <div className="relative mb-4 aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={playlist.coverImage || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300"}
                    alt={playlist.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <button className="absolute bottom-3 right-3 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-black/50 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 hover:bg-purple-500">
                    <span className="text-white text-xl ml-1">▶</span>
                  </button>
                </div>
                <h3 className="text-white font-bold mb-1 truncate text-base">{playlist.title}</h3>
                <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed">
                  {playlist.description || "No description available"}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
