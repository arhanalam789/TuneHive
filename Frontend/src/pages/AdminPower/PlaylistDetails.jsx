import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Loader2,
  Music,
  ListMusic,
  Search,
  Trash2,
  Check,
} from "lucide-react";

export default function PlaylistDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [playlist, setPlaylist] = useState(null);
  const [allSongs, setAllSongs] = useState([]);
  const [selectedSongIds, setSelectedSongIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCover, setEditCover] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playlistRes, songsRes] = await Promise.all([
          axios.get(`${API_URL}/api/adminpower/playlist/${id}`, {
            withCredentials: true,
          }),
          axios.get(`${API_URL}/api/adminpower/all-songs`, {
            withCredentials: true,
          }),
        ]);

        if (!playlistRes.data.success) return toast.error("Failed to fetch playlist");

        setPlaylist(playlistRes.data.playlist);
        setAllSongs(songsRes.data.songs || []);

        const initialIds = (playlistRes.data.playlist.songs || []).map(
          (song) => song._id
        );
        setSelectedSongIds(initialIds);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Unauthorized! Please login again");
          setTimeout(() => navigate("/admin-login"), 1500);
        } else toast.error("Failed to load playlist");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, id, navigate]);

  const toggleSong = (songId) => {
    setSelectedSongIds((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  const selectedSongs = useMemo(
    () => allSongs.filter((song) => selectedSongIds.includes(song._id)),
    [allSongs, selectedSongIds]
  );

  const filteredAvailableSongs = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return allSongs.filter((song) => {
      const inPlaylist = selectedSongIds.includes(song._id);
      if (inPlaylist) return true;
      return (
        song.title.toLowerCase().includes(q) ||
        song.artist.toLowerCase().includes(q) ||
        (song.album || "").toLowerCase().includes(q)
      );
    });
  }, [allSongs, selectedSongIds, searchTerm]);

  const handleSave = async () => {
    if (!playlist) return;
    try {
      setSaving(true);
      const res = await axios.put(
        `${API_URL}/api/adminpower/playlist/${playlist._id}/songs`,
        { songs: selectedSongIds },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Playlist updated");
        setPlaylist(res.data.playlist);
      } else toast.error("Failed to update playlist");
    } catch {
      toast.error("Server error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePlaylist = async () => {
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("description", editDesc);
      if (editCover) formData.append("coverImage", editCover);

      const res = await axios.put(
        `${API_URL}/api/adminpower/playlist/${playlist._id}/edit`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Playlist updated!");
        setPlaylist(res.data.playlist);
        setShowEditModal(false);
      } else toast.error("Failed to update");
    } catch {
      toast.error("Server error");
    }
  };

  const handleDeletePlaylist = async () => {
    if (!confirm("Delete this playlist?")) return;
    try {
      const res = await axios.delete(
        `${API_URL}/api/adminpower/playlist/${playlist._id}/delete`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Playlist deleted");
        navigate("/admin-home/all-playlists");
      } else toast.error("Failed to delete");
    } catch {
      toast.error("Server error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <p className="text-white mb-4">Playlist not found</p>
        <button
          onClick={() => navigate("/admin-home")}
          className="px-4 py-2 rounded-full bg-purple-600 text-white text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-neutral-800 bg-black/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pinimg.com/originals/91/22/60/912260373c0d9bee4d5bbf80d1af8033.jpg"
              className="w-10 h-10 rounded-full object-cover"
            />
            <h1 className="text-white text-2xl font-bold">TuneHive</h1>
          </div>

          <button
            onClick={() => navigate("/admin-home")}
            className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <section className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-40 h-40 md:w-52 md:h-52 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            {playlist.coverImage ? (
              <img src={playlist.coverImage} className="w-full h-full object-cover" />
            ) : (
              <Music className="w-10 h-10 text-neutral-500" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                {playlist.title}
              </h2>

              <button
                onClick={() => {
                  setEditTitle(playlist.title);
                  setEditDesc(playlist.description || "");
                  setShowEditModal(true);
                }}
                className="px-3 py-1.5 text-sm rounded-lg bg-neutral-800 text-white border border-neutral-700 hover:border-purple-500 hover:bg-neutral-700"
              >
                Edit
              </button>

              <button
                onClick={handleDeletePlaylist}
                className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-500"
              >
                Delete
              </button>
            </div>

            {playlist.description && (
              <p className="text-neutral-300 mb-4">{playlist.description}</p>
            )}

            <p className="text-neutral-400 text-sm">
              {selectedSongIds.length} songs
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                <ListMusic className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Songs in Playlist</p>
                <p className="text-neutral-400 text-xs">{selectedSongs.length} selected</p>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {selectedSongs.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-900/70"
                >
                  <img src={song.imageurl} className="w-10 h-10 rounded-md object-cover" />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium truncate">{song.title}</p>
                    <p className="text-neutral-400 text-xs truncate">
                      {song.artist} {song.album ? `• ${song.album}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSong(song._id)}
                    className="p-1.5 rounded-full border border-neutral-700 hover:border-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 text-neutral-400 hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                <Music className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-white font-semibold text-sm">Your Library</p>
            </div>

            <div className="relative mb-3">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search songs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500"
              />
            </div>

            <div className="max-h-80 overflow-y-auto pr-1 space-y-2">
              {filteredAvailableSongs.map((song) => {
                const selected = selectedSongIds.includes(song._id);
                return (
                  <button
                    key={song._id}
                    type="button"
                    onClick={() => toggleSong(song._id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${
                      selected
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-neutral-800 hover:border-neutral-600 bg-neutral-900/70"
                    }`}
                  >
                    <img
                      src={song.imageurl}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium truncate">{song.title}</p>
                      <p className="text-neutral-400 text-xs truncate">
                        {song.artist} {song.album ? `• ${song.album}` : ""}
                      </p>
                    </div>
                    {selected && <Check className="w-4 h-4 text-purple-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`px-6 py-3 rounded-full font-semibold text-sm ${
              saving ? "bg-purple-600/60" : "bg-purple-600 hover:bg-purple-500"
            } text-white`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-white mb-6">Edit Playlist</h2>

            <div className="space-y-4">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700"
                placeholder="Playlist title"
              />

              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700 h-24"
                placeholder="Description"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditCover(e.target.files[0])}
                className="w-full text-sm text-neutral-300"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg bg-neutral-700 text-white hover:bg-neutral-600"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdatePlaylist}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500"
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
