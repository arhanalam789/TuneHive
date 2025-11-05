import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login_page';
import Signup from './pages/Signup_page';
import Home from './pages/Home';
import ForgotPassword from './pages/ResetPasswordPages/forgot_password';
import VerifyOpt from './pages/ResetPasswordPages/Verify_otp';
import Resetpassword from './pages/ResetPasswordPages/reset_password';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Home />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-otp' element={<VerifyOpt />} />
        <Route path='/reset-password' element={<Resetpassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
