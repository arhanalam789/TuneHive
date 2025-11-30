import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login_page';
import Signup from './pages/Signup_page';
import Home from './pages/Home';
import ForgotPassword from './pages/ResetPasswordPages/forgot_password';
import VerifyOpt from './pages/ResetPasswordPages/Verify_otp';
import Resetpassword from './pages/ResetPasswordPages/reset_password';
import Admin_Login from './pages/Admin_Login';
import Admin_Home from './pages/Admin_Home';
import ProtectedRoute from './pages/components/ProtectedRoute';
import AddSong from './pages/AdminPower/AddSong';
import AllSong from './pages/AdminPower/AllSong';
import AddPlaylist from './pages/AdminPower/AddPlaylist';
import AllPlaylists from './pages/AdminPower/AllPlayLists';
import PlaylistDetails from './pages/AdminPower/PlaylistDetails';
import { PlayerProvider } from './context/PlayerContext';
import MusicPlayer from './components/MusicPlayer';
import UserPlaylistDetails from './pages/UserPlaylistDetails';

const App = () => {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOpt />} />
          <Route path="/reset-password" element={<Resetpassword />} />
          <Route path="/admin-login" element={<Admin_Login />} />


          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlist/:id"
            element={
              <ProtectedRoute>
                <UserPlaylistDetails />
              </ProtectedRoute>
            }
          />


          <Route
            path="/admin-home"
            element={
              <ProtectedRoute>
                <Admin_Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-home/add-song"
            element={
              <ProtectedRoute>
                <AddSong />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-home/all-song"
            element={
              <ProtectedRoute>
                <AllSong />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-home/add-playlist"
            element={
              <ProtectedRoute>
                <AddPlaylist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-home/all-playlists"
            element={
              <ProtectedRoute>
                <AllPlaylists />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-home/playlist/:id"
            element={
              <ProtectedRoute>
                <PlaylistDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
        <MusicPlayer />
      </BrowserRouter>
    </PlayerProvider>
  );
};


export default App;
