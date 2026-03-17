import { useState } from "react";
import { Link } from "react-router-dom";
import userService from "../services/userService";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [previewResetLink, setPreviewResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPreviewResetLink("");

    if (!identifier.trim()) {
      setError("Please enter your email or username.");
      return;
    }

    try {
      setLoading(true);
      const res = await userService.forgotPassword(identifier.trim());
      setSuccess(res.message || "If an account exists, a reset link has been sent.");
      if (res.previewResetLink) {
        setPreviewResetLink(res.previewResetLink);
      }
      setIdentifier("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-colors">
      <div className="w-full max-w-md bg-gray-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-50 text-center mb-4">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-600 dark:text-slate-300 text-center mb-6">
          Enter your email or username and we will send a secure reset link.
        </p>

        {success && (
          <div className="mb-4 text-xs sm:text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-950 p-3 rounded-lg">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 text-xs sm:text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 p-3 rounded-lg">
            {error}
          </div>
        )}

        {previewResetLink && (
          <div className="mb-4 text-xs sm:text-sm text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 p-3 rounded-lg break-all">
            Development reset link: <a className="underline" href={previewResetLink}>{previewResetLink}</a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-200 mb-1.5">
              Email or Username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or username"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-gray-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-indigo-600 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-900 dark:hover:bg-indigo-700 transition text-sm sm:text-base disabled:opacity-60"
          >
            {loading ? "Generating..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-slate-300 mt-5">
          Remembered your password?{" "}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
