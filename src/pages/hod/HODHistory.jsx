import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import hodService from "../../services/hodService";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
} from "lucide-react";

const HODHistory = () => {
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("approved");
  const [counts, setCounts] = useState({ approved: 0, rejected: 0, all: 0 });
  const [loading, setLoading] = useState(true);

  const mapStatusToApi = (tab) => {
    const map = { approved: 'APPROVED', rejected: 'REJECTED', all: 'ALL' };
    return map[tab] || 'ALL';
  };

  useEffect(() => {
    const refresh = async () => {
      await Promise.all([fetchCounts(), fetchByTab(activeTab)]);
    };

    refresh();

    const interval = setInterval(refresh, 15000);
    window.addEventListener('focus', refresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', refresh);
    };
  }, [activeTab]);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const all = await hodService.getRequests('ALL');
      const approved = all.filter(i => i.status === 'approved').length;
      const rejected = all.filter(i => i.status === 'rejected').length;
      setCounts({ approved, rejected, all: all.length });
      // if current tab is 'all', populate history
      if (activeTab === 'all') setHistory(all || []);
    } catch (err) {
      console.error('Failed to fetch counts');
    } finally {
      setLoading(false);
    }
  };

  const fetchByTab = async (tab) => {
    try {
      setLoading(true);
      const status = mapStatusToApi(tab);
      const data = await hodService.getRequests(status);
      setHistory(data || []);
    } catch (err) {
      console.error('Failed to fetch history for tab', tab, err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = activeTab === "all" ? history : history.filter((item) => item.status === activeTab);

  return (
    <DashboardLayout role="hod">
      <div className="space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-100">
            Approval History
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            View all approved and rejected booking decisions
          </p>
        </div>

        {/* SUMMARY STATUS TABS */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 transition-colors">

          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
            Booking Decisions
          </h2>

          <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
            Review historical booking approvals and rejections
          </p>

          <div className="flex gap-6">

            <StatusTab
              label="Approved"
              count={counts.approved}
              active={activeTab === "approved"}
              onClick={() => setActiveTab("approved")}
              activeColor="bg-green-100 text-green-700 border-green-200"
            />

            <StatusTab
              label="Rejected"
              count={counts.rejected}
              active={activeTab === "rejected"}
              onClick={() => setActiveTab("rejected")}
              activeColor="bg-red-100 text-red-700 border-red-200"
            />

            <StatusTab
              label="All"
              count={counts.all}
              active={activeTab === "all"}
              onClick={() => setActiveTab("all")}
              activeColor="bg-indigo-100 text-indigo-700 border-indigo-200"
            />

          </div>

        </div>

        {/* HISTORY LIST */}
        {loading ? (
          <p className="text-gray-500 dark:text-slate-400">Loading history...</p>
        ) : filteredData.length === 0 ? (
          <p className="text-gray-500 dark:text-slate-400">
            No records available.
          </p>
        ) : (
          <div className="space-y-6">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-6 transition-colors"
              >

                {/* TOP ROW */}
                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                      {item.courseName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      Booking ID: #{item.id}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1 text-xs rounded-full font-medium
                      ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {item.status.charAt(0).toUpperCase() +
                      item.status.slice(1)}
                  </span>

                </div>

                {/* DETAILS GRID */}
                <div className="grid md:grid-cols-4 gap-6 mt-6 text-sm">

                  <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                    <MapPin size={16} />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Hall</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100">
                        {item.hallName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                    <Calendar size={16} />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Date</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100">
                        {item.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                    <Clock size={16} />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Time</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100">
                        {item.startTime} - {item.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                    <Users size={16} />
                    <div>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Students</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100">
                        {item.students}
                      </p>
                    </div>
                  </div>

                </div>

                {/* DECISION INFO */}
                <div className="mt-4 text-xs text-gray-400 dark:text-slate-500">
                  Decision Date: {item.decisionDate}
                </div>

                {item.status === "rejected" && item.rejectionReason && (
                  <div className="mt-3 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 px-3 py-2">
                    <p className="text-xs font-medium text-red-800 dark:text-red-200">Reason</p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">{item.rejectionReason}</p>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default HODHistory;


const StatusTab = ({
  label,
  count,
  active,
  onClick,
  activeColor,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-between px-6 py-3 rounded-xl border transition
        ${
          active
            ? `${activeColor}`
            : "bg-gray-50 dark:bg-slate-900/60 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700"
        }`}
    >
      <span className="font-medium">{label}</span>

      <span className="ml-4 px-3 py-1 text-xs rounded-full bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 shadow-sm transition-colors">
        {count}
      </span>
    </button>
  );
};