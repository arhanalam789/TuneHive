// import { Navigate, useLocation } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// export default function ProtectedRoute({ children }) {
//   const [isAuth, setIsAuth] = useState(null);
//   const location = useLocation();
//   const isAdminRoute = location.pathname.startsWith('/admin');
//   const API_URL = import.meta.env.VITE_API_URL || "https://tunehive-nw51.onrender.com";

//   useEffect(() => {
//     const verifyAuth = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/api/adminauth/verify`, {
//           withCredentials: true, 
//         });

//         if (res.data.success) {
//           setIsAuth(true);
//         } else {
//           setIsAuth(false);
//         }
//       } catch (err) {
//         setIsAuth(false);
//       }
//     };
//     verifyAuth();
//   }, [API_URL]);

//   if (isAuth === null) return null; 

//   if (!isAuth) {
//     return <Navigate to={isAdminRoute ? '/admin-login' : '/login'} replace />;
//   }

//   return children;
// }

import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!adminToken) return <Navigate to="/admin-login" replace />;
    return children;
  }

  if (!userToken) return <Navigate to="/login" replace />;

  return children;
}

