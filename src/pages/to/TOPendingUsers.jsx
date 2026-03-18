import { CheckCircle2, XCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import toService from "../../services/toService";

const TOPendingUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    roleOverride: '',
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    department: '',
    designation: '',
    batch: '',
    semester: '',
    courses: ''
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await toService.getPendingUsers();
      setUsers(data || []);
      // let dashboard know we have latest list (maybe after navigation)
      window.dispatchEvent(new Event('toDashboardChange'));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load pending users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const prepareApprove = (user) => {
    const firstName = user.firstName || user.name?.split(' ')[0] || '';
    const lastName = user.lastName || user.name?.split(' ').slice(1).join(' ') || '';

    setEditingUser(user);
    setForm({
      roleOverride: user.requestedRole || '',
      firstName,
      lastName,
      email: user.email,
      username: user.username || '',
      department: user.department || '',
      designation: user.designation || '',
      batch: user.batch || '',
      semester: user.semester || '',
      courses: Array.isArray(user.courses) ? user.courses.join(', ') : ''
    });
  };

  const handleApprove = async () => {
    if (!editingUser) return;
    try {
      setActionLoading(true);
      setError('');
      setSuccess('');

      if (!form.roleOverride) {
        setError('Please select a final role before approval.');
        return;
      }

      const courses = form.courses
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        role: form.roleOverride,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        department: form.department,
        designation: form.designation,
        batch: form.batch,
        semester: form.semester,
        courses,
      };
      await toService.approveUser(editingUser.id, payload);
      setSuccess(`${payload.firstName || editingUser.name} approved successfully.`);
      setEditingUser(null);
      await loadUsers();
      window.dispatchEvent(new Event('toDashboardChange'));
    } catch (err) {
      setError(err?.response?.data?.message || 'Approve failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveDetails = async () => {
    if (!editingUser) return;

    try {
      setActionLoading(true);
      setError('');
      setSuccess('');

      const courses = form.courses
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        role: form.roleOverride,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        department: form.department,
        designation: form.designation,
        batch: form.batch,
        semester: form.semester,
        courses,
      };

      await toService.updatePendingUser(editingUser.id, payload);
      setSuccess('Pending user details updated in database.');
      await loadUsers();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save details');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(true);
      setError('');
      setSuccess('');
      await toService.rejectUser(id);
      setSuccess('User rejected successfully.');
      await loadUsers();
      window.dispatchEvent(new Event('toDashboardChange'));
    } catch (err) {
      setError(err?.response?.data?.message || 'Reject failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout role="to">
      <div className="space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
            Pending User Approvals
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Review and approve newly registered users
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-5 flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Pending Users for Approval</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-1">{loading ? '—' : users.length}</h2>
          </div>
          <Users className="text-indigo-600" />
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3">
            {success}
          </div>
        ) : null}

        {/* USERS LIST */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-8 space-y-6 transition-colors">

          {loading ? (
            <p className="text-gray-500 dark:text-slate-400">Loading users...</p>
          ) : users.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-slate-400">
              <Users size={40} className="mx-auto mb-3 text-gray-300" />
              No pending users found.
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 rounded-xl p-6 space-y-6 hover:shadow-sm transition-colors"
              >

                {/* USER INFO */}
                <div className="grid md:grid-cols-2 gap-6">

                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Full Name
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-slate-100">
                      {user.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Email Address
                    </p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {user.email}
                    </p>
                  </div>

                  <div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Requested Role</p>
                  <span className="inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">
                      {user.requestedRole || 'student'}
                  </span>
                </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Username</p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">{user.username || '-'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Registered Date
                    </p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {user.registeredDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Department</p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">{user.department || '-'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Designation</p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">{user.designation || '-'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">Batch / Semester</p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">{user.batch || '-'} / {user.semester || '-'}</p>
                  </div>

                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-4 pt-4 border-t">

                  <button
                    onClick={() => prepareApprove(user)}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(user.id)}
                    disabled={actionLoading}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto transition-colors">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Review Pending User</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Edit user details and select final role before approval</p>
            </div>
            <div className="px-6 py-6 space-y-5">
              
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 border-b border-gray-200 dark:border-slate-700 pb-2">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={e => setForm({ ...form, firstName: e.target.value })}
                      className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={e => setForm({ ...form, lastName: e.target.value })}
                      className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 border-b border-gray-200 dark:border-slate-700 pb-2">Account Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.username}
                      onChange={e => setForm({ ...form, username: e.target.value })}
                      className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter username"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Final Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.roleOverride}
                    onChange={e => setForm({ ...form, roleOverride: e.target.value })}
                    className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="">-- Select role --</option>
                    <option value="STUDENT">Student</option>
                    <option value="LECTURER">Lecturer</option>
                    <option value="HOD">HOD</option>
                    <option value="TO">TO</option>
                  </select>
                </div>
              </div>

              {/* Academic/Professional Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 border-b border-gray-200 dark:border-slate-700 pb-2">Additional Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Department</label>
                    <input
                      type="text"
                      value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })}
                      className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="e.g., Computer Engineering"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Designation</label>
                    <input
                      type="text"
                      value={form.designation}
                      onChange={e => setForm({ ...form, designation: e.target.value })}
                      className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="e.g., Senior Lecturer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Batch</label>
                    <input
                      type="text"
                      value={form.batch}
                      onChange={e => setForm({ ...form, batch: e.target.value })}
                      className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="e.g., E22"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Semester</label>
                    <input
                      type="text"
                      value={form.semester}
                      onChange={e => setForm({ ...form, semester: e.target.value })}
                      className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="e.g., 6st Semester"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Courses</label>
                  <input
                    type="text"
                    value={form.courses}
                    onChange={e => setForm({ ...form, courses: e.target.value })}
                    className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Software engineering, Machine Learning (comma-separated)"
                  />
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Enter course codes separated by commas</p>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700 px-6 py-4 rounded-b-2xl flex gap-3 justify-end transition-colors">
              <button
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setEditingUser(null)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={handleSaveDetails}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Details'
                )}
              </button>
              <button
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={handleApprove}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Approve
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TOPendingUsers;