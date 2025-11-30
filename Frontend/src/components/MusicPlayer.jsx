import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Mic2, ListMusic, MonitorSpeaker, Maximize2 } from 'lucide-react';

const MusicPlayer = () => {
    const { currentSong, isPlaying, togglePlay, playNext, playPrevious, audioRef } = usePlayer();
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(75);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', updateProgress);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', updateProgress);
        };
    }, [audioRef, currentSong]);

    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (!audio) return;
        const seekTime = (e.target.value / 100) * duration;
        audio.currentTime = seekTime;
        setProgress(seekTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100;
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [audioRef, volume]);

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} `;
    };

    const location = useLocation();
    const hidePlayerRoutes = [
        '/login',
        '/signup',
        '/forgot-password',
        '/verify-otp',
        '/reset-password',
        '/admin-login'
    ];

    const isAdminPage = location.pathname.startsWith('/admin');

    if (hidePlayerRoutes.includes(location.pathname) || isAdminPage) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 px-4 py-3 z-50 flex items-center justify-between h-20">
            <div className="flex items-center gap-4 w-[30%] min-w-0">
                <div className="w-14 h-14 rounded overflow-hidden bg-neutral-800 shrink-0">
                    {currentSong ? (
                        <img
                            src={currentSong.imageurl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300"}
                            alt={currentSong.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-500">
                            <ListMusic className="w-6 h-6" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-center overflow-hidden min-w-0">
                    <h4 className="text-white font-medium text-sm truncate">
                        {currentSong?.title || "No song playing"}
                    </h4>
                    <p className="text-neutral-400 text-xs truncate">
                        {currentSong?.artist || "Select a song"}
                    </p>
                </div>
                <button className="text-neutral-400 hover:text-white ml-2 hidden md:block">
                    <div className="w-4 h-4 border border-neutral-400 rounded-full flex items-center justify-center text-[10px]">+</div>
                </button>
            </div>

            <div className="flex flex-col items-center w-[40%] max-w-xl">
                <div className="flex items-center gap-6 mb-1">
                    <button className="text-neutral-400 hover:text-white transition-colors">
                        <Shuffle className="w-4 h-4" />
                    </button>
                    <button onClick={playPrevious} className="text-neutral-400 hover:text-white transition-colors">
                        <SkipBack className="w-5 h-5 fill-current" />
                    </button>
                    <button
                        onClick={togglePlay}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        {isPlaying ? (
                            <Pause className="w-5 h-5 text-black fill-current" />
                        ) : (
                            <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                        )}
                    </button>
                    <button onClick={playNext} className="text-neutral-400 hover:text-white transition-colors">
                        <SkipForward className="w-5 h-5 fill-current" />
                    </button>
                    <button className="text-neutral-400 hover:text-white transition-colors">
                        <Repeat className="w-4 h-4" />
                    </button>
                </div>

                <div className="w-full flex items-center gap-2 text-xs text-neutral-400 font-medium">
                    <span>{formatTime(progress)}</span>
                    <div className="flex-1 h-1 bg-neutral-600 rounded-full relative group cursor-pointer">
                        <div
                            className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-green-500"
                            style={{ width: `${(progress / duration) * 100}% ` }}
                        />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={(progress / duration) * 100 || 0}
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="hidden md:flex items-center justify-end gap-3 w-[30%]">
                <button className="text-neutral-400 hover:text-white">
                    <div className="w-5 h-5 border-2 border-green-500 rounded flex items-center justify-center">
                        <div className="w-1.5 h-2 bg-green-500" />
                    </div>
                </button>
                <button className="text-neutral-400 hover:text-white">
                    <Mic2 className="w-4 h-4" />
                </button>
                <button className="text-neutral-400 hover:text-white">
                    <ListMusic className="w-4 h-4" />
                </button>
                <button className="text-neutral-400 hover:text-white">
                    <MonitorSpeaker className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 w-24 group">
                    <Volume2 className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                    <div className="flex-1 h-1 bg-neutral-600 rounded-full relative cursor-pointer">
                        <div
                            className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-green-500"
                            style={{ width: `${volume}% ` }}
                        />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
                <button className="text-neutral-400 hover:text-white">
                    <Maximize2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default MusicPlayer;
