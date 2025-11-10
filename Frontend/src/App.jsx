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

const App = () => {
  return (
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
          path="/admin-home"
          element={
            <ProtectedRoute>
              <Admin_Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
