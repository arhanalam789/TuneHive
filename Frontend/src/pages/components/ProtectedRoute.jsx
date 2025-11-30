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
