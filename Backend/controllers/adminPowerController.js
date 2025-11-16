import { PutObjectCommand } from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import User from "../models/userModel.js";

import s3 from "../config/s3.js";
import Song from "../models/songModel.js";
import Playlist from "../models/playlistModel.js";
export const addSong = async (req, res) => {
  try {
    const { title, artist, album } = req.body;

    if (!req.files?.audio?.[0] || !req.files?.image?.[0]) {
      return res.status(400).json({ success: false, message: "Audio & image required" });
    }

    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];


    const audioKey = `songs/${Date.now()}-${audioFile.originalname}`;
    const imageKey = `images/${Date.now()}-${imageFile.originalname}`;
    const existingSong = await Song.findOne({ title, artist });

      if (existingSong) {
        return res.status(400).json({
          success: false,
          message: "This song already exists in the database",
        });
      }

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: audioKey,
        Body: audioFile.buffer,
        ContentType: audioFile.mimetype,
      })
    );

  
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
        Body: imageFile.buffer,
        ContentType: imageFile.mimetype,
      })
    );

    const songurl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${audioKey}`;
    const imageurl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;

    const newSong = await Song.create({
      title,
      artist,
      album,
      songurl,
      imageurl,
    });

    return res.status(201).json({ success: true, message: "Song uploaded", song: newSong });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};


export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, songs });
  } catch (err) {
    console.error("Error fetching songs:", err);
    res.status(500).json({ success: false, message: "Failed to fetch songs" });
  }
};


export const addPlaylist = async (req, res) => {
  try {
    const { title, description, songs } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Playlist title is required",
      });
    }


    let songIds = [];
    if (songs) {
      try {
        songIds = JSON.parse(songs); 
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Invalid songs format",
        });
      }
    }

  
    if (songIds.length > 0) {
      const existingSongs = await Song.find({ _id: { $in: songIds } });
      if (existingSongs.length !== songIds.length) {
        return res.status(400).json({
          success: false,
          message: "One or more songs are invalid",
        });
      }
    }


    let coverImageUrl = null;

    if (req.file) {
      const file = req.file;
      const key = `playlist-covers/${Date.now()}-${file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      coverImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    const newPlaylist = await Playlist.create({
      title,
      description,
      coverImage: coverImageUrl,
      songs: songIds,
    });

    return res.status(201).json({
      success: true,
      message: "Playlist created successfully!",
      playlist: newPlaylist,
    });
  } catch (error) {
    console.error("❌ Error creating playlist:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating playlist",
    });
  }
};



export const getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find()
      .populate("songs") // full song details chahiye to
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      playlists,
    });
  } catch (error) {
    console.error("❌ Error fetching playlists:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch playlists",
    });
  }
};


export const getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;

    const playlist = await Playlist.findById(id).populate("songs");

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      playlist,
    });
  } catch (error) {
    console.error("❌ Error fetching playlist:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching playlist",
    });
  }
};


export const updatePlaylistSongs = async (req, res) => {
  try {
    const { id } = req.params;
    const { songs } = req.body; // songs: array of songIds

    if (!Array.isArray(songs)) {
      return res.status(400).json({
        success: false,
        message: "Songs must be an array of song IDs",
      });
    }

    const playlist = await Playlist.findById(id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    const existingSongs = await Song.find({ _id: { $in: songs } });
    if (existingSongs.length !== songs.length) {
      return res.status(400).json({
        success: false,
        message: "One or more songs are invalid",
      });
    }

    playlist.songs = songs;
    await playlist.save();

    const updated = await Playlist.findById(id).populate("songs");

    return res.status(200).json({
      success: true,
      message: "Playlist updated successfully",
      playlist: updated,
    });
  } catch (error) {
    console.error("❌ Error updating playlist songs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating playlist",
    });
  }
};


export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.json({ success: false });

    const getKey = (url) => url.split(".amazonaws.com/")[1];

    const audioKey = getKey(song.songurl);
    const imageKey = getKey(song.imageurl);

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: audioKey
      })
    );

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey
      })
    );

    await Song.findByIdAndDelete(song._id);

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
};

export const editSong = async (req, res) => {
  try {
    await Song.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      artist: req.body.artist,
      album: req.body.album
    });

    res.json({ success: true });
  } catch {
    res.json({ success: false });
  }
};


export const getDashboardStats = async (req, res) => {
  try {
    const totalSongs = await Song.countDocuments();
    const totalPlaylists = await Playlist.countDocuments();
    const activeUsers = await User.countDocuments();

    return res.json({
      success: true,
      totalSongs,
      totalPlaylists,
      activeUsers
    });
  } catch (err) {
    return res.json({ success: false });
  }
};