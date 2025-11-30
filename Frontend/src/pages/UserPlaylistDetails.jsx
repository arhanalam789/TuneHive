import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader2, Music, Play, Clock } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";

export default function UserPlaylistDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();
    const API_URL = import.meta.env.VITE_API_URL || "https://tunehive-nw51.onrender.com";

    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/adminpower/playlist/${id}`);
                if (res.data.success) {
                    setPlaylist(res.data.playlist);
                }
            } catch (error) {
                console.error("Failed to fetch playlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [API_URL, id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <p className="mb-4">Playlist not found</p>
                <button onClick={() => navigate("/")} className="text-purple-400 hover:underline">
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans pb-24">
            {/* Header */}
            <div className="relative bg-gradient-to-b from-purple-900/50 to-black p-8 pt-20">
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-6 left-6 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="flex flex-col md:flex-row gap-8 items-end max-w-7xl mx-auto">
                    <div className="w-52 h-52 shadow-2xl shadow-black/50 rounded-lg overflow-hidden bg-neutral-800 flex items-center justify-center shrink-0">
                        {playlist.coverImage ? (
                            <img src={playlist.coverImage} alt={playlist.title} className="w-full h-full object-cover" />
                        ) : (
                            <Music className="w-20 h-20 text-neutral-600" />
                        )}
                    </div>

                    <div className="flex-1 mb-2">
                        <p className="text-sm font-medium uppercase tracking-wider mb-2">Playlist</p>
                        <h1 className="text-4xl md:text-7xl font-bold mb-6">{playlist.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-neutral-300">
                            <span className="font-semibold text-white">TuneHive</span>
                            <span>•</span>
                            <span>{playlist.songs?.length || 0} songs</span>
                        </div>
                        {playlist.description && (
                            <p className="text-neutral-400 mt-4 max-w-2xl">{playlist.description}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Songs List */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Play Button */}
                <div className="mb-8">
                    <button
                        onClick={() => playlist.songs?.[0] && playSong(playlist.songs[0], playlist.songs)}
                        className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center hover:scale-105 hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/20"
                    >
                        <Play className="w-7 h-7 fill-current ml-1" />
                    </button>
                </div>

                <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 text-sm text-neutral-400 border-b border-white/10 mb-4 uppercase tracking-wider">
                    <span>#</span>
                    <span>Title</span>
                    <span>Album</span>
                    <Clock className="w-4 h-4" />
                </div>

                <div className="space-y-2">
                    {playlist.songs?.map((song, index) => (
                        <div
                            key={song._id}
                            onClick={() => playSong(song, playlist.songs)}
                            className={`group grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-3 rounded-md hover:bg-white/10 cursor-pointer transition-colors items-center ${currentSong?._id === song._id ? 'text-purple-400' : 'text-neutral-300'}`}
                        >
                            <span className="w-6 text-center group-hover:hidden">{index + 1}</span>
                            <span className="w-6 text-center hidden group-hover:block">
                                <Play className="w-4 h-4 fill-current inline" />
                            </span>

                            <div className="flex items-center gap-4 overflow-hidden">
                                <img src={song.imageurl} alt={song.title} className="w-10 h-10 rounded object-cover bg-neutral-800 shrink-0" />
                                <div className="flex flex-col truncate">
                                    <span className={`font-medium truncate ${currentSong?._id === song._id ? 'text-purple-400' : 'text-white'}`}>{song.title}</span>
                                    <span className="text-xs text-neutral-400 truncate group-hover:text-white">{song.artist}</span>
                                </div>
                            </div>

                            <span className="truncate text-neutral-400 group-hover:text-white">{song.album || "-"}</span>

                            <span className="text-sm tabular-nums">3:45</span> {/* Placeholder duration */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
