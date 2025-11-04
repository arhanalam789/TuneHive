import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from '../src/pages/Login';
import Login from 'Frontend/src/pages/Login.jsx';
import Signup from '../src/pages/Signup';
import Home from './pages/Home';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
