import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, updateLocalUser } = useContext(AuthContext);
  const [checking, setChecking] = useState(false);

  // if user exists but role is missing, try to fetch profile once to populate role
  useEffect(() => {
    let mounted = true;
    const needsRefresh = user && role && ((!(user.role)) || ((user.role || '').toLowerCase() !== (role || '').toLowerCase()));
    if (needsRefresh) {
      setChecking(true);
      import('../services/userService').then(m => m.default.getProfile()).then((data) => {
        if (!mounted) return;
        if (updateLocalUser) updateLocalUser({ role: (data.role || '').toLowerCase(), username: data.username, name: `${data.firstName || ''} ${data.lastName || ''}`.trim() });
      }).catch(() => {
        // ignore
      }).finally(() => { if (mounted) setChecking(false); });
    }
    return () => { mounted = false; };
  }, [user, role, updateLocalUser]);

  if (!user) return <Navigate to="/login" />;
  if (checking) return null;

  if (role) {
    const userRole = (user.role || "").toLowerCase();
    const required = (role || "").toLowerCase();
    if (userRole !== required) return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;