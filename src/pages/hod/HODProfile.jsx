import { useState, useContext, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import {
  User,
  Mail,
  Phone,
  Building,
  ShieldCheck,
  Edit,
  Lock,
} from "lucide-react";

const HODProfile = () => {
  const { user, updateLocalUser } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    department: "",
    designation: "",
    username: user?.username || '',
    courses: []
  });

  useEffect(() => {
    let mounted = true;
    import("../../services/userService").then(({ default: userService }) => {
      userService.getProfile().then((data) => {
        if (!mounted) return;
        setProfile({
          fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          department: data.department || '',
          designation: data.designation || '',
          username: data.username || '',
          courses: data.courses || []
        });
        if (data.username) updateLocalUser({ username: data.username });
      }).catch(() => {});
    });
    return () => { mounted = false };
  }, []);

  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  return (
    <DashboardLayout role="hod">

      <div className="space-y-10">

        {/* PAGE HEADER */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-100">
            Profile
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Manage your personal and professional information
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT PROFILE CARD */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-8 text-center transition-colors">

            <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-semibold shadow-md">
              {getInitials(profile.fullName)}
            </div>

            <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-slate-100">
              {profile.fullName}
            </h2>

            <p className="text-gray-500 dark:text-slate-400 mt-1">
              {profile.designation}
            </p>

            <span className="inline-block mt-4 px-4 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-sm rounded-full">
              Active
            </span>

            <div className="mt-8 space-y-4">

              <button
                onClick={() => setShowEdit(true)}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Edit size={16} />
                Edit Profile
              </button>

              <button
                onClick={() => setShowPassword(true)}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Lock size={16} />
                Change Password
              </button>

            </div>
          </div>

          {/* RIGHT INFORMATION CARD */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-8 space-y-8 transition-colors">

            <SectionTitle title="Personal Information" />

              <InfoRow icon={<User size={18} />} label="Full Name" value={profile.fullName} />
              <InfoRow icon={<Mail size={18} />} label="Email Address" value={profile.email} />
              <InfoRow icon={<Phone size={18} />} label="Phone Number" value={profile.phone} />
              <InfoRow icon={<Building size={18} />} label="Department" value={profile.department} />
              <InfoRow icon={<ShieldCheck size={18} />} label="Role" value="Head of Department" />

              <div>
                <SectionTitle title="Courses" />
                <div className="flex flex-wrap gap-3 mt-4">
                  {(profile.courses || []).map((course, index) => (
                    <span key={index} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-sm font-medium rounded-lg">
                      {course}
                    </span>
                  ))}
                </div>
              </div>

          </div>
        </div>

        {showEdit && (
          <EditModal
            profile={profile}
            setProfile={setProfile}
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

export default HODProfile;



/* SECTION TITLE */

const SectionTitle = ({ title }) => (
  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 border-b border-gray-200 dark:border-slate-700 pb-3">
    {title}
  </h3>
);



/* INFO ROW */

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 rounded-xl p-4 hover:shadow-sm transition-colors">

    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-lg flex items-center justify-center transition-colors">
      {icon}
    </div>

    <div>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        {label}
      </p>
      <p className="font-medium text-gray-900 dark:text-slate-100">
        {value}
      </p>
    </div>

  </div>
);



/* EDIT PROFILE MODAL */

const EditModal = ({ profile, setProfile, close }) => {
  const [form, setForm] = useState(profile);
  const [errorMsg, setErrorMsg] = useState('');
  const { updateLocalUser } = useContext(AuthContext);

  useEffect(() => {
    const mapped = {
      ...profile,
      courses: Array.isArray(profile.courses) ? profile.courses.join(', ') : (profile.courses || '')
    };
    setForm(mapped);
  }, [profile]);

  const handleSave = async () => {
    try {
      setErrorMsg('');
      
      // Validate fullName
      if (!form.fullName || !form.fullName.trim()) {
        setErrorMsg('Full name is required');
        return;
      }
      
      const userService = (await import('../../services/userService')).default;
      const names = (form.fullName || '').trim().split(' ');
      const payload = {
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        phone: form.phone || undefined,
        department: form.department || undefined,
        designation: form.designation || undefined,
        username: form.username || undefined,
        email: form.email || undefined
      };

      // handle courses as array when provided as comma-separated string
      if (form.courses !== undefined) {
        payload.courses = typeof form.courses === 'string'
          ? form.courses.split(',').map(s => s.trim()).filter(Boolean)
          : form.courses;
      }

      const updated = await userService.updateProfile(payload);

      const mapped = {
        fullName: `${updated.firstName || ''} ${updated.lastName || ''}`.trim(),
        email: updated.email || '',
        phone: updated.phone || '',
        department: updated.department || '',
        designation: updated.designation || '',
        username: updated.username || '',
        courses: updated.courses || []
      };

      setProfile(mapped);
      if (updateLocalUser) updateLocalUser({ username: updated.username, name: `${updated.firstName || ''} ${updated.lastName || ''}`.trim(), email: updated.email });
      close();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-lg p-8 space-y-6 shadow-xl transition-colors">

        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          Edit Profile
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
            placeholder="Full Name"
          />

          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
            placeholder="Phone"
          />

          <input
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
            placeholder="Department"
          />

          <input
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
            placeholder="Designation"
          />

          <label className="text-sm text-gray-500 dark:text-slate-400">Courses (comma separated)</label>
          <input
            value={form.courses}
            onChange={(e) => setForm({ ...form, courses: e.target.value })}
            className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
            placeholder="e.g. Algorithms, Database Systems"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">

          <button
            onClick={close}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>

        </div>

      </div>
    </div>
  );
};



/* PASSWORD MODAL */

const PasswordModal = ({ close }) => {
  const toast = useToast();
  const [form, setForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleSubmit = () => {
    if (form.newPass !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password changed successfully!");
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-lg p-8 space-y-6 shadow-xl transition-colors">

        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          Change Password
        </h2>

        <input
          type="password"
          placeholder="Current Password"
          className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
          onChange={(e) =>
            setForm({ ...form, current: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
          onChange={(e) =>
            setForm({ ...form, newPass: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
          onChange={(e) =>
            setForm({ ...form, confirm: e.target.value })
          }
        />

        <div className="flex justify-end gap-3 pt-4">

          <button
            onClick={close}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Update Password
          </button>

        </div>

      </div>
    </div>
  );
};