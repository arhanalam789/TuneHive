import { useEffect, useState } from "react";
import axios from "axios";
import { ListMusic, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AllPlaylists() {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "https://tunehive-nw51.onrender.com";

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/adminpower/all-playlists`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setPlaylists(res.data.playlists);
        } else {
          toast.error(res.data.message || "Failed to fetch playlists");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Unauthorized! Please login again");
          setTimeout(() => navigate("/admin-login"), 1500);
        } else {
          toast.error("Failed to load playlists");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

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
            onClick={() => navigate("/admin-home")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-white text-4xl font-bold mb-3">All Playlists</h2>
          <p className="text-neutral-400 text-lg">Manage and view your playlists</p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-neutral-400">Loading playlists...</p>
          </div>
        )}

        {!loading && playlists.length === 0 && (
          <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-16 text-center">
            <div className="w-20 h-20 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-6">
              <ListMusic className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-white text-2xl font-semibold mb-2">
              No playlists created
            </h3>
            <p className="text-neutral-400 mb-6">Start building curated playlists</p>
            <button
              onClick={() => navigate("/admin-home/add-playlist")}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Create Playlist
            </button>
          </div>
        )}

        {!loading && playlists.length > 0 && (
          <>
            <div className="mb-6 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                  <ListMusic className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">{playlists.length} Playlists</p>
                  <p className="text-neutral-400 text-sm">Total playlists created</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {playlists.map((playlist) => (
                <div
                  key={playlist._id}
                  onClick={() => navigate(`/admin-home/playlist/${playlist._id}`)}
                  className="group cursor-pointer rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-4 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-neutral-800">
                    <img
                      src={playlist.coverImage}
                      alt={playlist.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="text-white text-lg font-semibold truncate mb-1 group-hover:text-purple-300 transition-colors">
                    {playlist.title}
                  </h3>

                  <p className="text-neutral-400 text-sm truncate mb-3">
                    {playlist.description || "No Description"}
                  </p>

                  <div className="text-neutral-500 text-xs mb-2">
                    {playlist.songs?.length || 0} songs
                  </div>

                  <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 max-h-40 overflow-y-auto">
                    {playlist.songs?.length > 0 ? (
                      playlist.songs.map((song) => (
                        <div key={song._id} className="flex items-center gap-3 mb-3 last:mb-0">
                          <img
                            src={song.imageurl}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                          <div>
                            <p className="text-white text-sm font-medium">{song.title}</p>
                            <p className="text-neutral-500 text-xs">{song.artist}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-neutral-600 text-sm">No songs</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
