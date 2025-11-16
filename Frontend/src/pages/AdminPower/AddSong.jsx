import { Music, Upload, Image, Disc, ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AddSong() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "https://tunehive-nw51.onrender.com";
  
  const [songTitle, setSongTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [songAlbum, setSongAlbum] = useState('');
  const [songImage, setSongImage] = useState(null);
  const [songFile, setSongFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSongImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSongFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSongFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!artistName || !songTitle) {
      toast.error('Artist name and song title are required!');
      return;
    }

    if (!songFile) {
      toast.error('Please upload an audio file!');
      return;
    }

    if (!songImage) {
      toast.error('Please upload a cover image!');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('title', songTitle);
    formData.append('artist', artistName);
    formData.append('album', songAlbum || 'Unknown Album');
    formData.append('audio', songFile);
    formData.append('image', songImage);

    try {
      const res = await axios.post(
        `${API_URL}/api/adminpower/upload-song`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success('Song uploaded successfully! 🎵');
        setSongTitle('');
        setArtistName('');
        setSongAlbum('');
        setSongImage(null);
        setSongFile(null);
        setImagePreview(null);
        setTimeout(() => {
          navigate('/admin-home');
        }, 1500);
      } else {
        toast.error(res.data.message || 'Failed to upload song');
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(error.response.data.message || 'Invalid data provided');
        } else if (error.response.status === 401) {
          toast.error('Unauthorized! Please login again');
          setTimeout(() => navigate('/admin-login'), 1500);
        } else if (error.response.status === 500) {
          toast.error('Server error. Please try again later');
        } else {
          toast.error('Something went wrong!');
        }
      } else {
        toast.error('Cannot connect to server. Check your network');
      }
    } finally {
      setUploading(false);
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
            onClick={() => navigate('/admin-home')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
            disabled={uploading}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-white text-4xl font-bold mb-3">Add a New Song</h2>
          <p className="text-neutral-400 text-lg">Upload and manage your music library</p>
        </div>

        {uploading && (
          <div className="mb-8 rounded-xl border border-purple-500/50 bg-purple-600/10 p-6">
            <div className="flex items-center gap-4">
              <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
              <div className="flex-1">
                <p className="text-white font-semibold mb-1">Uploading your song...</p>
                <p className="text-neutral-400 text-sm">Please wait while we process your files</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Artist Name *
                  </label>
                  <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter artist name"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Song Title *
                  </label>
                  <input
                    type="text"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter song title"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Album Name
                  </label>
                  <input
                    type="text"
                    value={songAlbum}
                    onChange={(e) => setSongAlbum(e.target.value)}
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter album name (optional)"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Audio File *
                  </label>
                  <label className={`cursor-pointer block group ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="border-2 border-dashed border-neutral-700 rounded-xl p-8 bg-neutral-900/30 group-hover:border-purple-500/50 transition-all">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-600/20 transition-colors">
                          <Music className="w-8 h-8 text-purple-400" strokeWidth={1.5} />
                        </div>
                        <p className="text-white text-sm mb-1">
                          {songFile ? songFile.name : 'Click to upload audio file'}
                        </p>
                        <p className="text-neutral-400 text-xs">MP3, WAV, FLAC up to 50MB</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleSongFileChange}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-black p-8 h-full">
              <label className="block text-white text-sm font-medium mb-4">
                Song Cover Image *
              </label>

              {imagePreview ? (
                <div className="relative">
                  <div className="w-full h-64 rounded-xl overflow-hidden border-2 border-purple-500/30 mb-4">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <label className={`cursor-pointer block ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="border border-neutral-700 hover:border-purple-500 rounded-lg p-3 text-center bg-neutral-900/50 hover:bg-neutral-900 transition-colors">
                      <p className="text-white text-sm">Change Image</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className={`cursor-pointer block ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="w-full h-64 border-2 border-dashed border-neutral-700 rounded-xl p-6 bg-neutral-900/30 hover:border-purple-500/50 transition-all flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                        <Image className="w-8 h-8 text-purple-400" strokeWidth={1.5} />
                      </div>
                      <p className="text-white text-sm font-medium mb-1">Upload Cover</p>
                      <p className="text-neutral-400 text-xs">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-colors"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Song
              </>
            )}
          </button>
          <button
            onClick={() => navigate('/admin-home')}
            disabled={uploading}
            className="sm:w-40 border border-neutral-700 hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                <Music className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-neutral-400 text-sm mb-1">Supported Formats</p>
                <p className="text-white font-semibold">MP3, WAV, FLAC</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                <Image className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-neutral-400 text-sm mb-1">Image Formats</p>
                <p className="text-white font-semibold">PNG, JPG, WEBP</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                <Disc className="w-6 h-6 text-purple-400" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-neutral-400 text-sm mb-1">Max File Size</p>
                <p className="text-white font-semibold">50MB per song</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}