import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("matla_token");
  const userStr = localStorage.getItem("matla_user");

  // 1. Check if user is logged in
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch {
    // If somehow localStorage is corrupted, force login
    localStorage.removeItem("matla_token");
    localStorage.removeItem("matla_user");
    return <Navigate to="/login" replace />;
  }

  // 2. Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on their actual role if they try to access something forbidden
    if (user.role === "STUDENT") {
      return <Navigate to="/student" replace />;
    } else if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "DOSEN") {
      return <Navigate to="/dosen" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // 3. Authorized, render children
  return children;
};

export default ProtectedRoute;
