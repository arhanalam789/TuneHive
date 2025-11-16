import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  songurl: { type: String, required: true },
  imageurl: { type: String },
}, { timestamps: true });

const Song = mongoose.model("Song", songSchema);

export default Song;