import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  BookOpen,
  Bell,
  TrendingUp,
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import lecturerService from "../../services/lecturerService";
import DashboardCard from "../../components/lecturer/DashboardCard";
import BookingItem from "../../components/lecturer/BookingItem";
import DashboardLayout from "../../layouts/DashboardLayout";

const LecturerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    pendingRequests: 0,
    approvedBookings: 0,
    activeNotices: 0,
    monthlyBookings: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const summaryData =
          await lecturerService.getDashboardSummary(user.id);

        const bookingData =
          await lecturerService.getRecentBookings(user.id);

        setSummary(summaryData || summary);
        setRecentBookings(bookingData || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-10">


        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Lecturer Dashboard</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">Overview of your lecture hall bookings and activity.</p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">

          <DashboardCard
            title="Pending Requests"
            value={loading ? "—" : summary.pendingRequests}
            icon={<CalendarDays className="w-5 h-5 text-yellow-600" />}
            bg="bg-yellow-100"
          />

          <DashboardCard
            title="Approved Bookings"
            value={loading ? "—" : summary.approvedBookings}
            icon={<BookOpen className="w-5 h-5 text-green-600" />}
            bg="bg-green-100"
          />

          <DashboardCard
            title="Active Notices"
            value={loading ? "—" : summary.activeNotices}
            icon={<Bell className="w-5 h-5 text-blue-600" />}
            bg="bg-blue-100"
          />

          <DashboardCard
            title="This Month"
            value={loading ? "—" : summary.monthlyBookings}
            icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
            bg="bg-purple-100"
          />

        </div>

      </div>
    </DashboardLayout>
  );
};

export default LecturerDashboard;