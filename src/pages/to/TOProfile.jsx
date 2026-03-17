import { useState, useContext, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import userService from "../../services/userService";
import { useToast } from "../../hooks/useToast";
import {
  User,
  Mail,
  Phone,
  Edit3,
  Lock,
  Save,
  Building,
  Briefcase,
} from "lucide-react";

const TOProfile = () => {
  const toast = useToast();
  const { user, setUser } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
    department: "",
    designation: "",
  });

  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfile({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        username: data.username || "",
        phone: data.phone || "",
        department: data.department || "",
        designation: data.designation || "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "TO";
  };

  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || "TO User";

  return (
    <DashboardLayout role="to">
      <div className="space-y-6">


        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
            Profile
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Manage your account information and settings
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="text-gray-500 dark:text-slate-400 mt-3">Loading profile...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">

            {/* LEFT PROFILE CARD */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-8 text-center transition-colors">

              <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center text-3xl font-semibold shadow-lg">
                {getInitials(profile.firstName, profile.lastName)}
              </div>

              <h2 className="mt-5 text-xl font-semibold text-gray-900 dark:text-slate-100">
                {fullName}
              </h2>

              <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm">
                {profile.designation || "Technical Officer"}
              </p>

              <span className="inline-block mt-4 px-4 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                Active
              </span>

              <div className="mt-8 space-y-3">

                <button
                  onClick={() => setShowEdit(true)}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-indigo-700 transition"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>

                <button
                  onClick={() => setShowPassword(true)}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Lock size={16} />
                  Change Password
                </button>

              </div>

            </div>

            {/* RIGHT DETAILS */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-8 space-y-6 transition-colors">

              <SectionTitle title="Personal Information" />

              <div className="grid md:grid-cols-2 gap-4">
                <InfoRow
                  icon={<User size={18} />}
                  label="First Name"
                  value={profile.firstName || "Not set"}
                />
                <InfoRow
                  icon={<User size={18} />}
                  label="Last Name"
                  value={profile.lastName || "Not set"}
                />
              </div>

              <InfoRow
                icon={<Mail size={18} />}
                label="Email Address"
                value={profile.email || "Not set"}
              />

              <InfoRow
                icon={<User size={18} />}
                label="Username"
                value={profile.username || "Not set"}
              />

              <InfoRow
                icon={<Phone size={18} />}
                label="Phone Number"
                value={profile.phone || "Not set"}
              />

              <SectionTitle title="Professional Information" />

              <InfoRow
                icon={<Building size={18} />}
                label="Department"
                value={profile.department || "Not set"}
              />

              <InfoRow
                icon={<Briefcase size={18} />}
                label="Designation"
                value={profile.designation || "Not set"}
              />

            </div>
          </div>
        )}

        {/* MODALS */}

        {showEdit && (
          <EditModal
            profile={profile}
            onSave={loadProfile}
            close={() => setShowEdit(false)}
          />
        )}

        {showPassword && (
          <PasswordModal close={() => setShowPassword(false)} />
        )}

      </div>
    </DashboardLayout>
  );
};

export default TOProfile;


const SectionTitle = ({ title }) => (
  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 border-b border-gray-200 dark:border-slate-700 pb-3 mb-4">
    {title}
  </h3>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 rounded-xl p-4 hover:shadow-sm transition-colors">
    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-300 transition-colors">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wide font-medium mb-1">
        {label}
      </p>
      <p className="font-medium text-gray-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  </div>
);


const EditModal = ({ profile, onSave, close }) => {
  const toast = useToast();
  const [form, setForm] = useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    username: profile.username || "",
    phone: profile.phone || "",
    department: profile.department || "",
    designation: profile.designation || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    
    if (!form.firstName.trim()) {
      setError("First name is required");
      return;
    }

    try {
      setSaving(true);
      await userService.updateProfile(form);
      toast.success("Profile updated successfully!");
      onSave(); // Reload profile data
      close();
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError(error.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transition-colors">

        {/* HEADER */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            Edit Profile
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Update your personal information
          </p>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 space-y-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter department"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <input
              type="text"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter designation"
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700 px-6 py-4 rounded-b-2xl flex gap-3 justify-end transition-colors">
          <button
            onClick={close}
            disabled={saving}
            className="px-5 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};


const PasswordModal = ({ close }) => {
  const toast = useToast();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      setSaving(true);
      await userService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password changed successfully!");
      close();
    } catch (error) {
      console.error("Failed to change password:", error);
      setError(error.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl transition-colors">

        {/* HEADER */}
        <div className="border-b border-gray-200 dark:border-slate-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            Change Password
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Enter your current password and choose a new one
          </p>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 space-y-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter new password (min 6 characters)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Confirm new password"
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700 px-6 py-4 flex gap-3 justify-end rounded-b-2xl transition-colors">
          <button
            onClick={close}
            disabled={saving}
            className="px-5 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Updating...
              </>
            ) : (
              <>
                <Lock size={18} />
                Update Password
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};