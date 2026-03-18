import { createContext, useEffect, useState } from "react";
import API from "../api/axiosClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // ensure we have the full profile (including id) when a token exists
  useEffect(() => {
    const ensureProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const stored = JSON.parse(localStorage.getItem('user')) || user;
      const storedId = stored?.id || stored?._id;
      const hasRealId = Boolean(storedId && storedId !== 'temp' && storedId !== 'undefined' && storedId !== 'null');
      if (stored && hasRealId) {
        // already have a valid id
        setUser(stored);
        return;
      }
      try {
        const res = await API.get('/users/me');
        const profile = res.data;
        const merged = {
          ...(stored || {}),
          id: profile._id,
          _id: profile._id,
          username: profile.username,
          role: (profile.role || '').toLowerCase(),
          token
        };
        localStorage.setItem('user', JSON.stringify(merged));
        setUser(merged);
      } catch (e) {
        // failed to fetch profile; clear stored user to avoid inconsistent state
        console.error('Failed to fetch user profile during init', e);
        localStorage.removeItem('user');
        // keep token so other flows can handle re-auth if needed
        setUser(null);
      }
    };
    ensureProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials) => {
    const res = await API.post('/users/login', credentials);
    const { token, role, username } = res.data;
    localStorage.setItem('token', token);

    // Always resolve full profile to avoid temporary/invalid ids in downstream API calls.
    let resolvedId = res.data._id || res.data.id || null;
    try {
      const profileRes = await API.get('/users/me');
      resolvedId = profileRes?.data?._id || resolvedId;
    } catch (e) {
      // Keep fallback id from login response if /users/me is temporarily unavailable.
    }

    const storedUser = {
      id: resolvedId,
      _id: resolvedId,
      username,
      role: (role || '').toLowerCase(),
      token
    };
    localStorage.setItem('user', JSON.stringify(storedUser));
    setUser(storedUser);
    return storedUser;
  };

  const signup = async (payload) => {
    const res = await API.post('/users', payload);
    const { token, role, username } = res.data;

    if (token) {
      localStorage.setItem('token', token);
      // Use backend id if present; ensureProfile will resolve via /users/me if not.
      const resolvedId = res.data._id || res.data.id || 'temp';
      const storedUser = { id: resolvedId, _id: resolvedId, username, role: (role || '').toLowerCase(), token };
      localStorage.setItem('user', JSON.stringify(storedUser));
      setUser(storedUser);
      return storedUser;
    }

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateLocalUser = (updates) => {
    const current = JSON.parse(localStorage.getItem('user')) || user || {};
    const merged = { ...current, ...updates };
    localStorage.setItem('user', JSON.stringify(merged));
    setUser(merged);
    return merged;
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated, updateLocalUser }}>
      {children}
    </AuthContext.Provider>
  );
};