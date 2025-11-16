import { useEffect, useState } from "react";
import axios from "axios";
import { Music, Disc, Loader2, ArrowLeft, Play, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AllSongs() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingSongId, setPlayingSongId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://tunehive-nw51.onrender.com";

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/adminpower/all-songs`, {
          withCredentials: true
        });
        if (res.data.success) {
          setSongs(res.data.songs);
        } else {
          toast.error(res.data.message || "Failed to fetch songs");
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
        if (error.response?.status === 401) {
          toast.error("Unauthorized! Please login again");
          setTimeout(() => navigate("/admin-login"), 1500);
        } else {
          toast.error("Failed to load songs");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [API_URL, navigate]);

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
            onClick={() => navigate('/admin-home')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-white text-4xl font-bold mb-3">All Songs</h2>
          <p className="text-neutral-400 text-lg">Manage and view your uploaded tracks</p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-neutral-400">Loading your music library...</p>
          </div>
        )}

        {!loading && songs.length === 0 && (
          <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-16 text-center">
            <div className="w-20 h-20 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-6">
              <Music className="w-10 h-10 text-purple-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-white text-2xl font-semibold mb-2">No songs uploaded yet</h3>
            <p className="text-neutral-400 mb-6">Start building your music library</p>
            <button
              onClick={() => navigate('/admin-home/add-song')}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Upload Your First Song
            </button>
          </div>
        )}

        {!loading && songs.length > 0 && (
          <>
            <div className="mb-6 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                  <Disc className="w-5 h-5 text-purple-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-white font-semibold">{songs.length} Songs</p>
                  <p className="text-neutral-400 text-sm">Total tracks in library</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {songs.map((song) => (
                <div
                  key={song._id}
                  className="group rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-4 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-neutral-800">
                    <img
                      src={song.imageurl}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-white text-lg font-semibold truncate mb-1 group-hover:text-purple-300 transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-neutral-400 text-sm truncate mb-1">
                    {song.artist}
                  </p>
                  <p className="text-neutral-500 text-xs truncate mb-3">
                    {song.album || "No Album"}
                  </p>

                  <audio
                    controls
                    className="w-full h-10 rounded-lg"
                    style={{
                      filter: 'invert(1) hue-rotate(180deg)',
                      opacity: 0.9
                    }}
                  >
                    <source src={song.songurl} type="audio/mpeg" />
                  </audio>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}