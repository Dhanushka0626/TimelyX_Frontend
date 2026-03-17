import { useState, useContext, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  Building,
  Award,
  BookOpen,
  Lock,
  Edit,
  X,
} from "lucide-react";

const LecturerProfile = () => {
  const { user } = useContext(AuthContext);

  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    department: "",
    designation: "",
    courses: [],
  });

  const { updateLocalUser } = useContext(AuthContext);

  useEffect(() => {
    // attempt to load profile from backend
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
          courses: data.courses || [],
          username: data.username || ''
        });
        // update auth stored username if different
        if (data.username) updateLocalUser({ username: data.username });
      }).catch(() => {});
    });
    return () => { mounted = false };
  }, []);

  const getInitials = (name) =>
    name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-12">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-100">
            Profile
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Manage your personal and professional information
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT PROFILE CARD */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center transition-colors">

            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-semibold">
              {getInitials(profile.fullName)}
            </div>

            <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-slate-100">
              {profile.fullName}
            </h2>

            <p className="text-gray-500 dark:text-slate-400 mt-1">
              {profile.designation}
            </p>

            <span className="mt-3 px-4 py-1 text-sm rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300">
              Active
            </span>

            <div className="w-full mt-8 space-y-4">

              <button
                onClick={() => setShowEdit(true)}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Edit size={16} />
                Edit Profile
              </button>

              <button
                onClick={() => setShowPassword(true)}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Lock size={16} />
                Change Password
              </button>

            </div>
          </div>

          {/* RIGHT INFORMATION */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-10 space-y-10 transition-colors">

            <SectionTitle title="Personal Information" />

            <InfoRow icon={<User size={18} />} label="Full Name" value={profile.fullName} />
            <InfoRow icon={<Mail size={18} />} label="Email Address" value={profile.email} />
            <InfoRow icon={<Phone size={18} />} label="Phone Number" value={profile.phone} />
            <InfoRow icon={<Building size={18} />} label="Department" value={profile.department} />
            <InfoRow icon={<Award size={18} />} label="Designation" value={profile.designation} />

            {/* COURSES */}
            <div>
              <SectionTitle title="Courses Teaching" />
              <div className="flex flex-wrap gap-3 mt-4">
                {profile.courses.map((course, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-sm font-medium rounded-lg"
                  >
                    <BookOpen size={14} />
                    {course}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {showEdit && (
          <EditProfileModal
            profile={profile}
            setProfile={setProfile}
            close={() => setShowEdit(false)}
          />
        )}

        {showPassword && (
          <ChangePasswordModal close={() => setShowPassword(false)} />
        )}

      </div>
    </DashboardLayout>
  );
};

/* COMPONENTS  */

const SectionTitle = ({ title }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
      {title}
    </h3>
    <div className="mt-2 h-px bg-gray-100 dark:bg-slate-700"></div>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 rounded-xl px-6 py-5 transition-colors">

    <div className="w-11 h-11 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-slate-300 transition-colors">
      {icon}
    </div>

    <div>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        {label}
      </p>
      <p className="text-gray-900 dark:text-slate-100 font-medium mt-1">
        {value}
      </p>
    </div>

  </div>
);

/* EDIT MODAL */

const EditProfileModal = ({ profile, setProfile, close }) => {
  const [form, setForm] = useState(profile);
  const [errorMsg, setErrorMsg] = useState("");
  const { updateLocalUser } = useContext(AuthContext);

  useEffect(() => {
    // ensure courses are a comma separated string in the form
    const names = (profile.fullName || '').split(' ');
    const mapped = {
      ...profile,
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      courses: Array.isArray(profile.courses) ? profile.courses.join(', ') : (profile.courses || ''),
    };
    setForm(mapped);
  }, [profile]);

  // prevent background scrolling while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev };
  }, []);

  const handleSubmit = async () => {
    try {
      setErrorMsg("");
      // client-side validation
      if (!form.firstName || !form.firstName.trim()) {
        setErrorMsg('First name is required');
        return;
      }
      // send update to backend
      const userService = (await import('../../services/userService')).default;
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName ? form.lastName.trim() : '',
        phone: form.phone,
        username: form.username || undefined,
        email: form.email || undefined,
        department: form.department || undefined,
        designation: form.designation || undefined,
        courses: (typeof form.courses === 'string' ? form.courses.split(',').map(s=>s.trim()).filter(Boolean) : form.courses)
      };

      const updated = await userService.updateProfile(payload);
      // map updated back to UI fields
      setProfile({
        fullName: `${updated.firstName || ''} ${updated.lastName || ''}`.trim(),
        email: updated.email || '',
        phone: updated.phone || '',
        department: updated.department || '',
        designation: updated.designation || '',
        courses: updated.courses || [],
        username: updated.username || ''
      });

      updateLocalUser({ username: updated.username, name: `${updated.firstName || ''} ${updated.lastName || ''}`.trim(), email: updated.email });

      close();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative transition-colors">

        <button
          onClick={close}
          className="absolute right-6 top-6 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          Edit Profile
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500 dark:text-slate-400">First Name</label>
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 dark:text-slate-400">Last Name</label>
            <input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-slate-400">Email Address</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-slate-400">Username</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-slate-400">Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-slate-400">Department</label>
          <input
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-slate-400">Designation</label>
          <input
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-slate-400">Courses (comma separated)</label>
          <input
            value={form.courses}
            onChange={(e) => setForm({ ...form, courses: e.target.value })}
            className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={close}
            className="px-5 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <div className="flex-1 text-left">
            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
          </div>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

/* PASSWORD MODAL */

const ChangePasswordModal = ({ close }) => {
  const [form, setForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleSubmit = () => {
    if (form.newPass !== form.confirm) {
      alert("Passwords do not match");
      return;
    }
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-10 w-full max-w-xl space-y-6 relative transition-colors">

        <button
          onClick={close}
          className="absolute right-6 top-6 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          Change Password
        </h2>

        {["Current Password", "New Password", "Confirm Password"].map((label, index) => (
          <input
            key={index}
            type="password"
            placeholder={label}
            className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
            onChange={(e) =>
              setForm({
                ...form,
                [index === 0 ? "current" : index === 1 ? "newPass" : "confirm"]:
                  e.target.value,
              })
            }
          />
        ))}

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={close}
            className="px-5 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition"
          >
            Update Password
          </button>
        </div>

      </div>
    </div>
  );
};

export default LecturerProfile;