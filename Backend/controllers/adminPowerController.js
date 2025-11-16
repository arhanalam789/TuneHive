import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import Song from "../models/songModel.js";

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