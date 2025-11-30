import User from "../models/userModel.js";
import Song from "../models/songModel.js";

export const toggleLikeSong = async (req, res) => {
    try {
        const { songId } = req.body;
        const userId = req.userId; // From auth middleware

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const songIndex = user.likedSongs.indexOf(songId);
        let isLiked = false;

        if (songIndex === -1) {
            user.likedSongs.push(songId);
            isLiked = true;
        } else {

            user.likedSongs.splice(songIndex, 1);
            isLiked = false;
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: isLiked ? "Added to Liked Songs" : "Removed from Liked Songs",
            isLiked,
            likedSongs: user.likedSongs
        });
    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getLikedSongs = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate("likedSongs");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            likedSongs: user.likedSongs
        });
    } catch (error) {
        console.error("Error fetching liked songs:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
