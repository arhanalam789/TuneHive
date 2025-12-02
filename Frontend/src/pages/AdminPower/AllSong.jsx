import { useEffect, useState } from "react";
import axios from "axios";
import { Music, Disc, Loader2, ArrowLeft, Play, Trash2, Edit, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AllSongs() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const songsPerPage = 8;

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({ id: "", title: "", artist: "", album: "" });

  const API_URL = import.meta.env.VITE_API_URL || "https://tunehive-nw51.onrender.com";

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/adminpower/all-songs`, {
        params: {
          page: currentPage,
          limit: songsPerPage,
          search: search,
          sort: sort
        },
        withCredentials: true
      });

      if (res.data.success) {
        setSongs(res.data.songs);
        setTotalPages(res.data.totalPages);
      }
    } catch {
      toast.error("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSongs();
    }, 500); 

    return () => clearTimeout(timeoutId);
  }, [currentPage, search, sort]);

  const handleSearch = (v) => {
    setSearch(v);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setCurrentPage(1);
  };

  const deleteSong = async (id) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return;

    try {
      const res = await axios.delete(`${API_URL}/api/adminpower/delete-song/${id}`, {
        withCredentials: true
      });
      if (res.data.success) {
        toast.success("Song deleted");
        fetchSongs(); // Refresh list after delete
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const openEdit = (song) => {
    setEditData({
      id: song._id,
      title: song.title,
      artist: song.artist,
      album: song.album || ""
    });
    setEditModal(true);
  };

  const updateSong = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/api/adminpower/edit-song/${editData.id}`,
        editData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Updated");
        setEditModal(false);
        fetchSongs(); 
      }
    } catch {
      toast.error("Update failed");
    }
  };

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
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-white text-4xl font-bold">All Songs</h2>

          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={sort}
                onChange={handleSortChange}
                className="appearance-none bg-neutral-900 border border-neutral-700 text-white px-4 py-3 pr-10 rounded-xl outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search songs by title, artist, album..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 rounded-xl mb-10 outline-none focus:border-purple-500"
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          </div>
        ) : (
          <>
            {songs.length === 0 ? (
              <div className="text-center py-20 text-neutral-500">
                No songs found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {songs.map((song) => (
                  <div
                    key={song._id}
                    className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 hover:border-purple-500/40 hover:shadow-purple-500/10 shadow-xl transition-all relative"
                  >
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button
                        onClick={() => openEdit(song)}
                        className="p-2 rounded-full bg-neutral-800 hover:bg-purple-600 transition"
                      >
                        <Edit className="text-white w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSong(song._id)}
                        className="p-2 rounded-full bg-neutral-800 hover:bg-red-600 transition"
                      >
                        <Trash2 className="text-white w-4 h-4" />
                      </button>
                    </div>

                    <div className="aspect-square rounded-xl overflow-hidden mb-4">
                      <img
                        src={song.imageurl}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="text-white font-semibold text-lg truncate">{song.title}</h3>
                    <p className="text-neutral-400 text-sm truncate">{song.artist}</p>
                    <p className="text-neutral-600 text-xs truncate mb-4">
                      {song.album || "No Album"}
                    </p>

                    <audio
                      controls
                      className="w-full h-10 rounded-lg"
                      style={{ filter: "invert(1) hue-rotate(180deg)" }}
                    >
                      <source src={song.songurl} type="audio/mpeg" />
                    </audio>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-10">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg disabled:opacity-30 hover:bg-neutral-800 transition"
                >
                  Prev
                </button>

                <span className="text-neutral-400">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg disabled:opacity-30 hover:bg-neutral-800 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {editModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 p-6 rounded-2xl w-96 border border-neutral-700">
            <h3 className="text-white text-xl font-semibold mb-4">Edit Song</h3>

            <input
              className="w-full bg-neutral-800 text-white px-3 py-2 rounded mb-3 outline-none focus:border-purple-500 border border-transparent"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              placeholder="Title"
            />
            <input
              className="w-full bg-neutral-800 text-white px-3 py-2 rounded mb-3 outline-none focus:border-purple-500 border border-transparent"
              value={editData.artist}
              onChange={(e) => setEditData({ ...editData, artist: e.target.value })}
              placeholder="Artist"
            />
            <input
              className="w-full bg-neutral-800 text-white px-3 py-2 rounded mb-5 outline-none focus:border-purple-500 border border-transparent"
              value={editData.album}
              onChange={(e) => setEditData({ ...editData, album: e.target.value })}
              placeholder="Album"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={updateSong}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
