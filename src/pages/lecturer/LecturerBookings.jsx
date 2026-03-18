import { useState, useMemo, useEffect, useContext } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import lecturerService from "../../services/lecturerService";

const LecturerBookings = () => {

  // bookings will be loaded from the backend; initialize empty
  const [bookings, setBookings] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const data = await lecturerService.getRecentBookings(user.id);
        setBookings(data || []);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      }
    };
    load();
  }, [user]);

  /* FILTER STATE */
  const [activeFilter, setActiveFilter] = useState("Pending");

  /*  COUNTS  */
  const counts = {
    Pending: bookings.filter(b => b.status === "Pending").length,
    Approved: bookings.filter(b => b.status === "Approved").length,
    Rejected: bookings.filter(b => b.status === "Rejected").length,
  };

  /* FILTERED BOOKINGS */
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => b.status === activeFilter);
  }, [bookings, activeFilter]);

  /* STATUS BADGE STYLE  */
  const badgeStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300";
      case "Rejected":
        return "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300";
      default:
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300";
    }
  };

  const tabStyle = (status) => {
    const base =
      "flex justify-between items-center px-6 py-4 rounded-xl cursor-pointer transition font-medium";

    if (activeFilter === status) {
      switch (status) {
        case "Approved":
          return `${base} bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-200`;
        case "Rejected":
          return `${base} bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200`;
        default:
          return `${base} bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200`;
      }
    }

    return `${base} bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200`;
  };

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-100">
            My Bookings
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Manage and track your lecture hall booking requests
          </p>
        </div>

        {/* FILTER SECTION */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 transition-colors">

          <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-2">
            Booking Requests
          </h2>

          <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
            View all your booking requests and their status
          </p>

          <div className="grid md:grid-cols-3 gap-6">

            <div
              onClick={() => setActiveFilter("Pending")}
              className={tabStyle("Pending")}
            >
              <span>Pending</span>
              <span className="bg-yellow-200 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 text-sm px-3 py-1 rounded-full">
                {counts.Pending}
              </span>
            </div>

            <div
              onClick={() => setActiveFilter("Approved")}
              className={tabStyle("Approved")}
            >
              <span>Approved</span>
              <span className="bg-green-200 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-sm px-3 py-1 rounded-full">
                {counts.Approved}
              </span>
            </div>

            <div
              onClick={() => setActiveFilter("Rejected")}
              className={tabStyle("Rejected")}
            >
              <span>Rejected</span>
              <span className="bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-300 text-sm px-3 py-1 rounded-full">
                {counts.Rejected}
              </span>
            </div>

          </div>
        </div>

        {/* BOOKINGS LIST */}
        <div className="space-y-8">

          {filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 transition-colors">
              No {activeFilter.toLowerCase()} bookings found.
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 hover:shadow-md transition-colors"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                      {booking.subject}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      Booking ID: {booking.id}
                    </p>
                  </div>

                  <span
                    className={`text-sm px-4 py-1 rounded-full ${badgeStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-4 gap-8">

                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-gray-400 dark:text-slate-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Hall</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{booking.hall}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarDays size={18} className="text-gray-400 dark:text-slate-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Date</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{booking.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-gray-400 dark:text-slate-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Time</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{booking.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users size={18} className="text-gray-400 dark:text-slate-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-slate-400">Students</p>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{booking.students}</p>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}

        </div>

      </div>
    </DashboardLayout>
  );
};

export default LecturerBookings;