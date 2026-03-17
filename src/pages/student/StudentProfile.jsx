import { useState, useContext, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import studentService from "../../services/studentService";
import { User, Mail, Phone, Building, Lock, Edit, X } from "lucide-react";

const StudentProfile = () => {
  const { user, updateLocalUser } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!user) return;

    let mounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await studentService.getProfile();
        if (!mounted) return;
        const mapped = {
          fullName: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          department: data.department || '',
          batch: data.batch || '',
          role: (data.role || '').toLowerCase(),
          username: data.username || ''
        };
        setProfile(mapped);
      } catch {
        if (!mounted) return;
        setError("Failed to load profile.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchProfile();
    return () => { mounted = false };
  }, [user]);

  const handleProfileUpdate = async (payload, close) => {
    try {
      const updated = await studentService.updateProfile(payload);
      // map backend response to UI shape
      const mapped = {
        fullName: `${updated.firstName || ''} ${updated.lastName || ''}`.trim() || updated.username || '',
        email: updated.email || '',
        phone: updated.phone || '',
        department: updated.department || '',
        batch: updated.batch || '',
        username: updated.username || ''
      };
      setProfile(mapped);
      // update auth local user display if available
      if (updateLocalUser) updateLocalUser({ name: mapped.fullName, email: mapped.email, username: mapped.username });
      if (close) close();
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-12">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Profile</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">View and manage your profile information</p>
        </div>

        {loading && <p className="text-gray-500 dark:text-slate-400">Loading profile...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && profile && (
          <div className="grid lg:grid-cols-3 gap-10">

            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center transition-colors">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-semibold">
                {profile.fullName?.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()}
              </div>

              <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-slate-100">{profile.fullName}</h2>
              <p className="text-gray-500 dark:text-slate-400 mt-1">{profile.role}</p>
              <span className="mt-3 px-4 py-1 text-sm rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300">Active</span>

              <div className="w-full mt-8 space-y-4">
                <button onClick={() => setShowEdit(true)} className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <Edit size={16} /> Edit Profile
                </button>
                <button onClick={() => setShowPassword(true)} className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <Lock size={16} /> Change Password
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-10 space-y-6 transition-colors">
              <SectionTitle title="Personal Information" />

              <InfoRow icon={<User size={18} />} label="Full Name" value={profile.fullName} />
              <InfoRow icon={<Mail size={18} />} label="Email Address" value={profile.email} />
              <InfoRow icon={<Phone size={18} />} label="Phone Number" value={profile.phone} />
              <InfoRow icon={<Building size={18} />} label="Department" value={profile.department} />

              <div>
                <SectionTitle title="Academic" />
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <StaticField label="Batch" value={profile.batch} />
                </div>
              </div>

            </div>

          </div>
        )}

        {showEdit && (
          <EditProfileModal profile={profile} close={() => setShowEdit(false)} onSave={handleProfileUpdate} />
        )}

        {showPassword && (
          <ChangePasswordModal close={() => setShowPassword(false)} />
        )}

      </div>
    </DashboardLayout>
  );
};

/* SMALL COMPONENTS */
const SectionTitle = ({ title }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
    <div className="mt-2 h-px bg-gray-100 dark:bg-slate-700"></div>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 rounded-xl px-6 py-5 transition-colors">

    <div className="w-11 h-11 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-slate-300 transition-colors">
      {icon}
    </div>

    <div>
      <p className="text-sm text-gray-500 dark:text-slate-400">{label}</p>
      <p className="text-gray-900 dark:text-slate-100 font-medium mt-1">{value}</p>
    </div>

  </div>
);

const StaticField = ({ label, value }) => (
  <div>
    <label className="block text-sm text-gray-500 dark:text-slate-400 mb-1">{label}</label>
    <div className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-900/50 text-gray-900 dark:text-slate-100 transition-colors">{value}</div>
  </div>
);

/* EDIT MODAL */
const EditProfileModal = ({ profile, setProfile: _unused, close, onSave }) => {
  const [form, setForm] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const names = (profile?.fullName || '').split(' ');
    setForm({
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      department: profile?.department || '',
      batch: profile?.batch || '',
      username: profile?.username || ''
    });
  }, [profile]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev };
  }, []);

  const handleSubmit = async () => {
    try {
      setErrorMsg("");
      if (!form.firstName || !form.firstName.trim()) {
        setErrorMsg('First name is required');
        return;
      }

      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName ? form.lastName.trim() : '',
        email: form.email || undefined,
        phone: form.phone || undefined,
        department: form.department || undefined,
        batch: form.batch || undefined,
        
        username: form.username || undefined,
      };

      await onSave(payload, close);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative transition-colors">

        <button onClick={close} className="absolute right-6 top-6 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors">
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Edit Profile</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500 dark:text-slate-400">First Name</label>
            <input value={form.firstName || ''} onChange={(e) => setForm({...form, firstName: e.target.value})} className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="text-sm text-gray-500 dark:text-slate-400">Last Name</label>
            <input value={form.lastName || ''} onChange={(e) => setForm({...form, lastName: e.target.value})} className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-slate-400">Email Address</label>
          <input value={form.email || ''} onChange={(e)=> setForm({...form, email: e.target.value})} className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" />
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-slate-400">Username</label>
          <input value={form.username || ''} onChange={(e)=> setForm({...form, username: e.target.value})} className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" />
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-slate-400">Phone</label>
          <input value={form.phone || ''} onChange={(e)=> setForm({...form, phone: e.target.value})} className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" />
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-slate-400">Department</label>
          <input value={form.department || ''} onChange={(e)=> setForm({...form, department: e.target.value})} className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm text-gray-500 dark:text-slate-400">Batch</label>
            <input value={form.batch || ''} onChange={(e)=> setForm({...form, batch: e.target.value})} className="mt-2 w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button onClick={close} className="px-5 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <div className="flex-1 text-left">{errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}</div>
          <button onClick={handleSubmit} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition">Save Changes</button>
        </div>

      </div>
    </div>
  );
};

/* PASSWORD MODAL */
const ChangePasswordModal = ({ close }) => {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });

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

        <button onClick={close} className="absolute right-6 top-6 text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors"><X size={18} /></button>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Change Password</h2>

        {["Current Password", "New Password", "Confirm Password"].map((label, index) => (
          <input key={index} type="password" placeholder={label} className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors" onChange={(e) => setForm({...form, [index===0? 'current' : index===1? 'newPass' : 'confirm']: e.target.value})} />
        ))}

        <div className="flex justify-end gap-4 pt-4">
          <button onClick={close} className="px-5 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition">Update Password</button>
        </div>

      </div>
    </div>
  );
};

export default StudentProfile;
