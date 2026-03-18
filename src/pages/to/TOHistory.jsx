import { useEffect, useState } from "react";
import { Search, Calendar, CheckCircle2, XCircle, UserCheck, UserX, Filter } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import toService from "../../services/toService";

const TOHistory = () => {
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [stats, setStats] = useState({ approved: 0, rejected: 0, total: 0 });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await toService.getHistory();
      setHistory(data || []);
      setFiltered(data || []);
      
      // Calculate stats
      const approved = data.filter(item => item.status === 'approved').length;
      const rejected = data.filter(item => item.status === 'rejected').length;
      setStats({ approved, rejected, total: data.length });
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  /* FILTER LOGIC  */

  useEffect(() => {
    let data = [...history];

    if (search) {
      data = data.filter((item) =>
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase()) ||
        item.username?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((item) => item.status === statusFilter);
    }

    if (roleFilter !== "all") {
      data = data.filter((item) => item.role === roleFilter);
    }

    if (fromDate) {
      data = data.filter((item) => item.date >= fromDate);
    }

    if (toDate) {
      data = data.filter((item) => item.date <= toDate);
    }

    setFiltered(data);
  }, [search, statusFilter, roleFilter, fromDate, toDate, history]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setRoleFilter("all");
    setFromDate("");
    setToDate("");
  };

  return (
    <DashboardLayout role="to">
      <div className="space-y-6">

        {/* HEADER  */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
            User Approval History
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            View all approved and rejected user registrations
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">Total Decisions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.approved}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <UserCheck className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-slate-400 font-medium">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.rejected}</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <UserX className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* FILTER SECTION */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 transition-colors">
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600 dark:text-slate-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Filters</h3>
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="grid md:grid-cols-5 gap-4">

            {/* SEARCH */}
            <div className="relative md:col-span-2">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or username"
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* STATUS FILTER */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* ROLE FILTER */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <option value="all">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="LECTURER">Lecturer</option>
              <option value="HOD">HOD</option>
              <option value="TO">TO</option>
              <option value="REJECTED">Rejected</option>
            </select>

            {/* FROM DATE */}
            <div className="md:col-span-1">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="From date"
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

          </div>

          <div className="grid md:grid-cols-5 gap-4 mt-4">
            
            <div className="md:col-span-1 md:col-start-5">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="To date"
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

          </div>

        </div>

        {/* HISTORY LIST  */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm transition-colors">
          
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              History Records ({filtered.length})
            </h3>
          </div>

          <div className="p-6 space-y-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
                <p className="text-gray-500 dark:text-slate-400 mt-3">Loading history...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No history records found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 rounded-xl p-5 hover:shadow-md transition-colors"
                >
                  <div className="flex justify-between items-start">
                    
                    {/* LEFT SIDE - User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-full ${
                          item.status === "approved" 
                            ? "bg-green-100" 
                            : "bg-red-100"
                        }`}>
                          {item.status === "approved" ? (
                            <CheckCircle2 size={20} className="text-green-600" />
                          ) : (
                            <XCircle size={20} className="text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-slate-100 text-lg">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            {item.email} {item.username && `• @${item.username}`}
                          </p>
                        </div>
                      </div>

                      <div className="ml-14 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-gray-700 dark:text-slate-300">Role:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.role === 'REJECTED' 
                              ? 'bg-red-100 text-red-700'
                              : item.role === 'STUDENT'
                              ? 'bg-blue-100 text-blue-700'
                              : item.role === 'LECTURER'
                              ? 'bg-purple-100 text-purple-700'
                              : item.role === 'HOD'
                              ? 'bg-orange-100 text-orange-700'
                              : item.role === 'TO'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.role}
                          </span>
                          {item.requestedRole && item.role !== item.requestedRole && (
                            <span className="text-xs text-gray-500 dark:text-slate-400">
                              (requested: {item.requestedRole})
                            </span>
                          )}
                        </div>

                        {(item.department || item.designation) && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                            {item.department && (
                              <>
                                <span className="font-medium">Department:</span>
                                <span>{item.department}</span>
                              </>
                            )}
                            {item.department && item.designation && <span>•</span>}
                            {item.designation && (
                              <>
                                <span className="font-medium">Designation:</span>
                                <span>{item.designation}</span>
                              </>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                          <Calendar size={14} />
                          <span>Decision date: {item.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT SIDE - Status Badge */}
                    <div>
                      <span
                        className={`px-4 py-2 text-sm font-semibold rounded-lg ${
                          item.status === "approved"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default TOHistory;