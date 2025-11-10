import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export default   function ProtectedRoute({ children }) {
// Set a test cookie to check if cookies are enabled
  const token =  Cookies.get('token');
  console.log("ProtectedRoute token:", token);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (!token) {
    return <Navigate to={isAdminRoute ? '/admin-login' : '/login'} replace />;
  }
  return children;
}
