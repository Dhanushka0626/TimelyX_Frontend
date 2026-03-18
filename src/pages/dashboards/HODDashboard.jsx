import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Calendar,
} from "lucide-react";

import hodService from "../../services/hodService";

const HODDashboard = () => {

  const [summary, setSummary] = useState({ pending: 0, approvedToday: 0, rejected: 0, totalMonth: 0 });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const s = await hodService.getDashboardSummary();
      const p = await hodService.getPendingRequests();
      setSummary(s || { pending: 0, approvedToday: 0, rejected: 0, totalMonth: 0 });
      setPendingRequests(p || []);
    } catch (err) {
      console.error("Failed to load HOD data", err);
    } finally {
      setLoading(false);
    }
  }
  

  /* ACTION HANDLERS */
  const handleApprove = async (requestId) => {
    try {
      await hodService.updateRequestStatus(requestId, "APPROVED");
      loadData();
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await hodService.updateRequestStatus(requestId, "REJECTED");
      loadData();
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  return (
    <DashboardLayout role="hod">
      <div className="space-y-10">


        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
            HOD Dashboard
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            Manage and approve lecture hall booking requests.
          </p>
        </div>

        {/*  SUMMARY CARDS */}
        <div className="grid md:grid-cols-4 gap-6">

          <SummaryCard
            title="Pending Approvals"
            value={summary.pending}
            icon={<Clock className="text-yellow-600" />}
            bg="bg-yellow-50"
          />

          <SummaryCard
            title="Approved Today"
            value={summary.approvedToday}
            icon={<CheckCircle2 className="text-green-600" />}
            bg="bg-green-50"
          />

          <SummaryCard
            title="Rejected"
            value={summary.rejected}
            icon={<XCircle className="text-red-600" />}
            bg="bg-red-50"
          />

          <SummaryCard
            title="Total This Month"
            value={summary.totalMonth}
            icon={<TrendingUp className="text-indigo-600" />}
            bg="bg-indigo-50"
          />

        </div>

        {/* PENDING APPROVAL SECTION */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-8 space-y-6 transition-colors">

          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              Pending Approval Requests
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">
              Review and approve lecture hall booking requests
            </p>
          </div>

          <div className="mb-4" />

          {pendingRequests.map((req) => (
            <div
              key={req.requestId || req._id || req.id}
              className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/40 rounded-xl p-6 space-y-6 hover:shadow-sm transition-colors"
            >

              {/* TOP ROW */}
              <div className="flex justify-between items-start">

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    {req.subject || req.courseName || "Class"}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                    Request ID: {(req.requestId || req._id || req.id).toString().slice(-8)}
                  </p>
                </div>

                <span className="px-4 py-1 text-sm rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 font-medium">
                  {req.status || req.requestStatus || "PENDING"}
                </span>

              </div>

              {/* DETAILS GRID */}
              <div className="grid md:grid-cols-3 gap-6">

                <div className="space-y-4">

                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Lecturer
                    </p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {req.lecturerName || (typeof req.lecturer === "object"
                        ? `${req.lecturer.firstName || ""} ${req.lecturer.lastName || ""}`.trim()
                        : req.lecturer)}
                    </p>
                    {req.lecturerEmail && (
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                        {req.lecturerEmail}
                      </p>
                    )}
                    {req.lecturerDepartment && (
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Dept: {req.lecturerDepartment}
                      </p>
                    )}
                    {typeof req.lecturer === "object" && req.lecturer.email && (
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                        {req.lecturer.email}
                      </p>
                    )}
                    {typeof req.lecturer === "object" && req.lecturer.department && (
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Dept: {req.lecturer.department}
                      </p>
                    )}
                  </div>

                </div>

                <div className="space-y-4">

                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Lecture Hall
                    </p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {typeof req.timeSlot === "object" && req.timeSlot.hall
                        ? req.timeSlot.hall.name
                        : typeof req.hall === "object"
                        ? req.hall.name
                        : req.hall || req.hallName || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Date & Time
                    </p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {req.timeSlot && typeof req.timeSlot === "object"
                        ? `${req.timeSlot.date || ""} ${req.timeSlot.startTime || ""}-${req.timeSlot.endTime || ""}`
                        : req.date
                        ? `${req.date} ${req.times ? `${req.times.join(" - ")}` : req.startTime && req.endTime ? `${req.startTime} - ${req.endTime}` : req.time ? `${req.time}` : ""}`
                        : "N/A"}
                    </p>
                  </div>

                </div>

                <div className="space-y-4">

                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Target Batch
                    </p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {req.targetBatch || "All students"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Expected Capacity
                    </p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {req.capacity ? `${req.capacity} students` : "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Requested On
                    </p>
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : "N/A"}
                    </p>
                  </div>

                </div>

              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-6 pt-4">

                <button
                  onClick={() => handleApprove(req.requestId || req._id || req.id)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  Approve
                </button>

                <button
                  onClick={() => handleReject(req.requestId || req._id || req.id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <XCircle size={18} />
                  Reject
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </DashboardLayout>
  );
};

export default HODDashboard;


/* SUMMARY CARD COMPONENT */

const SummaryCard = ({ title, value, icon, bg }) => (
  <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 flex justify-between items-center shadow-sm transition-colors">

    <div>
      <p className="text-gray-500 dark:text-slate-400 text-sm">
        {title}
      </p>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-2">
        {value}
      </h3>
    </div>

    <div className={`${bg} w-14 h-14 rounded-xl flex items-center justify-center`}>
      {icon}
    </div>

  </div>
);