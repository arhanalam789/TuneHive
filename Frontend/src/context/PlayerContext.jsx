import React, { createContext, useContext, useState, useRef } from 'react';

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const audioRef = useRef(null);

    const playSong = (song, songList = null) => {
        if (!song?.songurl) {
            console.error("Song URL missing");
            return;
        }

        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        if (songList && songList.length > 0) {
            setPlaylist(songList);
            const index = songList.findIndex(s => s._id === song._id);
            setCurrentIndex(index !== -1 ? index : 0);
        }

        if (currentSong?._id === song._id) {
            togglePlay();
            return;
        }

        audioRef.current.src = song.songurl;
        audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => console.error("Playback failed:", e));
        setCurrentSong(song);
    };

    const playNext = () => {
        if (playlist.length === 0) return;
        const nextIndex = (currentIndex + 1) % playlist.length;
        setCurrentIndex(nextIndex);
        playSong(playlist[nextIndex]);
    };

    const playPrevious = () => {
        if (playlist.length === 0) return;
        const prevIndex = currentIndex - 1 < 0 ? playlist.length - 1 : currentIndex - 1;
        setCurrentIndex(prevIndex);
        playSong(playlist[prevIndex]);
    };

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error("Playback failed:", e));
        }
    };

    const pauseSong = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <PlayerContext.Provider value={{
            currentSong,
            isPlaying,
            playSong,
            playNext,
            playPrevious,
            togglePlay,
            pauseSong,
            audioRef,
            playlist,
            currentIndex
        }}>
            {children}
        </PlayerContext.Provider>
    );
};
