import { useEffect, useState } from "react";
import { ArrowLeft, Image, ListMusic, Search, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddPlaylist() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [allSongs, setAllSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSongIds, setSelectedSongIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/adminpower/all-songs`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setAllSongs(res.data.songs);
        } else {
          toast.error(res.data.message || "Failed to fetch songs");
        }
      } catch (err) {
        console.error("Error fetching songs:", err);
        toast.error("Failed to load songs");
      }
    };

    fetchSongs();
  }, [API_URL]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const toggleSong = (id) => {
    setSelectedSongIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const filteredSongs = allSongs.filter((song) => {
    const q = searchTerm.toLowerCase();
    return (
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q) ||
      (song.album || "").toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return toast.error("Playlist title is required");
    }

    if (selectedSongIds.length === 0) {
      return toast.error("Please select at least one song");
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (coverFile) formData.append("coverImage", coverFile);
      formData.append("songs", JSON.stringify(selectedSongIds));

      const res = await axios.post(
        `${API_URL}/api/adminpower/add-playlist`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Playlist created successfully!");
        navigate("/admin-home/all-playlists");
      } else {
        toast.error(res.data.message || "Failed to create playlist");
      }
    } catch (err) {
      console.error("Error creating playlist:", err);
      toast.error("Server error while creating playlist");
    } finally {
      setIsSubmitting(false);
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
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
 
        <div className="mb-10">
          <h2 className="text-white text-4xl font-bold mb-3">Create Playlist</h2>
          <p className="text-neutral-400 text-lg">
            Curate a collection of tracks for your listeners
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
          <div className="lg:col-span-2 space-y-6">

            <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Playlist Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-purple-500"
                    placeholder="Chill Vibes, Workout Mix..."
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Describe this playlist..."
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                    <ListMusic className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Add Songs</p>
                    <p className="text-neutral-400 text-xs">
                      {selectedSongIds.length} song
                      {selectedSongIds.length !== 1 ? "s" : ""} selected
                    </p>
                  </div>
                </div>
              </div>

   
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by title, artist, album..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:ring-2 focus:ring-purple-500"
                />
              </div>


              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {filteredSongs.length === 0 && (
                  <p className="text-neutral-500 text-sm">No songs found.</p>
                )}

                {filteredSongs.map((song) => {
                  const selected = selectedSongIds.includes(song._id);

                  return (
                    <button
                      type="button"
                      key={song._id}
                      onClick={() => toggleSong(song._id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-all ${
                        selected
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-neutral-800 hover:border-neutral-600 bg-neutral-900/60"
                      }`}
                    >
                      <img
                        src={song.imageurl}
                        alt={song.title}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium truncate">
                          {song.title}
                        </p>
                        <p className="text-neutral-400 text-xs truncate">
                          {song.artist} {song.album ? `• ${song.album}` : ""}
                        </p>
                      </div>
                      {selected && (
                        <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>


          <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-8 h-full">
            <label className="block text-white text-sm font-medium mb-4">
              Playlist Cover
            </label>

            {coverPreview ? (
              <div className="space-y-4">
                <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-purple-500/30">
                  <img
                    src={coverPreview}
                    alt="Playlist cover"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="cursor-pointer block">
                  <div className="border border-neutral-700 hover:border-purple-500 rounded-lg p-3 text-center bg-neutral-900/60">
                    <p className="text-white text-sm">Change Cover</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer block h-full">
                <div className="w-full h-64 border-2 border-dashed border-neutral-700 rounded-xl p-6 bg-neutral-900/30 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mb-4">
                    <Image className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-white text-sm font-medium mb-1">
                    Upload Playlist Cover
                  </p>
                  <p className="text-neutral-400 text-xs">
                    PNG, JPG up to 5MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>
            )}

  
            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-6 w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "bg-purple-600/60 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-500"
              } text-white transition-colors`}
            >
              {isSubmitting ? "Creating Playlist..." : "Create Playlist"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
