import {
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import toService from "../../services/toService";

const TODashboard = () => {
  const [summary, setSummary] = useState({
    pendingUsers: 0,
    approvedToday: 0,
    totalUsers: 0,
    monthlyGrowth: 0,
    monthlyGrowthAmount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await toService.getDashboardSummary();
        if (!mounted) return;
        setSummary({
          pendingUsers: data.pendingUsers ?? 0,
          approvedToday: data.approvedToday ?? 0,
          totalUsers: data.totalUsers ?? 0,
          monthlyGrowth: data.monthlyGrowth ?? 0,
          monthlyGrowthAmount: data.monthlyGrowthAmount ?? 0,
        });
      } catch (e) {
        // keep defaults
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const handleDashboardChange = () => {
      load();
    };

    load();
    window.addEventListener("toDashboardChange", handleDashboardChange);

    return () => {
      mounted = false;
      window.removeEventListener("toDashboardChange", handleDashboardChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout role="to">
      <div className="space-y-10">


        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">TO Dashboard</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">Manage user approvals and system activities</p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-4 gap-6">

          <SummaryCard
            title="Pending Users"
            value={loading ? '—' : summary.pendingUsers}
            icon={<Clock className="text-yellow-600" />}
            bg="bg-yellow-50"
          />

          <SummaryCard
            title="Approved Today"
            value={loading ? '—' : summary.approvedToday}
            icon={<CheckCircle2 className="text-green-600" />}
            bg="bg-green-50"
          />

          <SummaryCard
            title="Total Users"
            value={loading ? '—' : summary.totalUsers}
            icon={<Users className="text-indigo-600" />}
            bg="bg-indigo-50"
          />

          <SummaryCard
            title="Monthly Growth"
            value={loading ? '—' : `${summary.monthlyGrowthAmount}`}
            subtitle={loading ? '' : `${summary.monthlyGrowth}% vs last month`}
            icon={<TrendingUp className="text-purple-600" />}
            bg="bg-purple-50"
          />

        </div>

      </div>
    </DashboardLayout>
  );
};

export default TODashboard;


/* SUMMARY CARD */

const SummaryCard = ({ title, value, icon, bg, subtitle }) => (
  <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 flex justify-between items-center shadow-sm hover:shadow-md transition-colors">
    <div>
      <p className="text-sm text-gray-500 dark:text-slate-400">{title}</p>
      <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-slate-100">{value}</h3>
      {subtitle ? <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{subtitle}</p> : null}
    </div>
    <div className={`${bg} w-14 h-14 rounded-xl flex items-center justify-center`}>
      {icon}
    </div>
  </div>
);