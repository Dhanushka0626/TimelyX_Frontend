import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/axiosClient";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const completeOAuthLogin = async () => {
      const token = searchParams.get("token");
      const roleFromQuery = (searchParams.get("role") || "").toLowerCase();
      const username = searchParams.get("username") || "";
      const oauthError = searchParams.get("oauthError");

      if (oauthError) {
        navigate(`/login?oauthError=${encodeURIComponent(oauthError)}`);
        return;
      }

      if (!token) {
        navigate("/login?oauthError=Missing%20OAuth%20token");
        return;
      }

      localStorage.setItem("token", token);

      let resolvedRole = roleFromQuery;
      let resolvedId = null;
      let resolvedUsername = username;

      try {
        const profileRes = await API.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profile = profileRes?.data || {};
        resolvedRole = (profile.role || roleFromQuery || "").toLowerCase();
        resolvedId = profile._id || profile.id || null;
        resolvedUsername = profile.username || resolvedUsername;
      } catch (error) {
        // If profile fetch fails, proceed with available token payload data.
      }

      const storedUser = {
        id: resolvedId,
        _id: resolvedId,
        username: resolvedUsername,
        role: resolvedRole,
        token,
      };

      localStorage.setItem("user", JSON.stringify(storedUser));

      if (resolvedRole === "pending") {
        navigate("/pending");
      } else if (resolvedRole) {
        navigate(`/${resolvedRole}`);
      } else {
        navigate("/");
      }
    };

    completeOAuthLogin();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 flex items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-md bg-gray-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-50 mb-3">
          Completing sign in
        </h1>
        <p className="text-sm text-gray-600 dark:text-slate-300">
          Please wait while we securely sign you in...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
