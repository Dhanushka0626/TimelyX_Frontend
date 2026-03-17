import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import lecturerService from "../../services/lecturerService";
import hodService from "../../services/hodService";
import { Search } from "lucide-react";
import { useToast } from "../../hooks/useToast";

const HODHallSchedule = () => {
  const toast = useToast();
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [subject, setSubject] = useState("");
  const [targetBatch, setTargetBatch] = useState("");

  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [myBookings, setMyBookings] = useState([]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadMyBookings();
  }, []);

  const loadMyBookings = async () => {
    try {
      const b = await lecturerService.getRecentBookings();
      setMyBookings(b || []);
    } catch (e) {
      console.error('Failed to load my bookings', e);
    }
  };

  const handleSearch = async () => {
    setError("");

    if (!isAuthenticated()) {
      return setError("Please log in to search available halls.");
    }

    if (!date || !startTime || !endTime) {
      return setError("Please select date and time range.");
    }

    if (!(user && user.role === "HOD")) {
      if (date < today) {
        return setError("Cannot book hall for past date.");
      }
    }

    const startMinutes = startTime.split(":")[1] || "";
    const endMinutes = endTime.split(":")[1] || "";
    if (startMinutes !== "00" || endMinutes !== "00") {
      return setError("Please select times on the hour (e.g. 13:00).");
    }

    if (startTime >= endTime) {
      return setError("End time must be after start time.");
    }

    try {
      setLoading(true);

      if (user && user.courses && user.courses.length > 0 && !subject) {
        return setError("Please select a subject from your allocated courses.");
      }

      const data = await lecturerService.searchAvailableHalls({ date, startTime, endTime, capacity });
      setHalls(data);
    } catch (err) {
      console.error("Search halls error:", err);
      const status = err?.response?.status;
      if (status === 401) {
        logout();
        return setError("Session expired — please log in again.");
      }
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err.message;
      setError(serverMsg || "Failed to search halls.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDate("");
    setStartTime("");
    setEndTime("");
    setCapacity("");
    setSubject("");
    setTargetBatch("");
    setHalls([]);
    setError("");
  };

  const handleBook = async (hallId) => {
    if (!isAuthenticated()) {
      return toast.warning("Please log in to send a booking request.");
    }

    try {
      if (user && user.courses && user.courses.length > 0 && !subject) {
        return toast.warning("Please select the subject for this booking.");
      }

      await hodService.bookHall({ hallId, date, startTime, endTime, subject, targetBatch, capacity });

      toast.success("Booking request sent successfully!");
      handleSearch();
      loadMyBookings();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        logout();
        return toast.error("Session expired — please log in again.");
      }
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err.message;
      toast.error(serverMsg || "Hall is not available.");
    }
  };

  return (
    <DashboardLayout role="hod">
      <div className="space-y-10">

        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-100">Hall Schedule</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">Search and book available lecture halls (HOD personal booking)</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 space-y-6 transition-colors">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Search & Filter</h2>
            <button onClick={handleClear} className="text-sm px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Clear Filters</button>
          </div>

          {error && (<p className="text-red-500 text-sm">{error}</p>)}

          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="text-sm text-gray-600 dark:text-slate-400">Date</label>
              <input type="date" min={user && user.role === "HOD" ? undefined : today} value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-colors" />
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-slate-400">Start Time</label>
              <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-colors">
                <option value="">Select start</option>
                {Array.from({ length: 10 }).map((_, idx) => { const i = 8 + idx; const hh = (i < 10 ? "0" : "") + i; return (<option key={hh} value={`${hh}:00`}>{`${hh}:00`}</option>); })}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-slate-400">End Time</label>
              <select value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-colors">
                <option value="">Select end</option>
                {Array.from({ length: 10 }).map((_, idx) => { const i = 9 + idx; const hh = (i < 10 ? "0" : "") + i; return (<option key={hh} value={`${hh}:00`}>{`${hh}:00`}</option>); })}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-slate-400">Min. Capacity</label>
              <input type="number" placeholder="e.g. 50" value={capacity} onChange={(e) => setCapacity(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-colors" />
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-slate-400">Subject</label>
              {user && user.courses && user.courses.length > 0 ? (
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-colors">
                  <option value="">Select subject</option>
                  {user.courses.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              ) : (
                <input type="text" placeholder="Enter subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-colors" />
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-slate-400">Target Batch</label>
              <input type="text" placeholder="e.g. E22" value={targetBatch} onChange={(e) => setTargetBatch(e.target.value)} className="mt-1 w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 transition-colors" />
            </div>
          </div>

          <button onClick={handleSearch} className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"><Search size={18} />Search Available Halls</button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-6">Available Halls ({halls.length})</h2>
          {loading ? (<p className="text-gray-500 dark:text-slate-400">Searching...</p>) : halls.length === 0 ? (
            <div>
              <p className="text-gray-500 dark:text-slate-400">No halls available for selected time.</p>
              <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">Note: current system has slots between <strong>08:00</strong> and <strong>18:00</strong>. Please choose times within that range.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {halls.map((hall) => (
                <div key={hall.id} className={`rounded-2xl border p-6 transition hover:shadow-md ${hall.status === "AVAILABLE" ? "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700" : "bg-gray-100 dark:bg-slate-900/60 border-gray-200 dark:border-slate-700 opacity-70"}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{hall.name}</h3>
                    <span className={`px-3 py-1 text-xs rounded-full ${hall.status === "AVAILABLE" ? "bg-green-100 text-green-600" : hall.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"}`}>
                      {hall.status === "AVAILABLE" ? "Available" : hall.status === "PENDING" ? "Pending" : hall.status === "BOOKED" ? "Booked" : "Unavailable"}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-slate-400">Capacity: <strong>{hall.capacity} students</strong></p>

                  <div className="mt-6">
                    {hall.status === "AVAILABLE" ? (
                      <button onClick={() => handleBook(hall.id)} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">Book Hall</button>
                    ) : hall.status === "PENDING" ? (
                      <button disabled className="w-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 py-2 rounded-lg cursor-not-allowed">Pending Request</button>
                    ) : (
                      <button disabled className="w-full bg-gray-300 dark:bg-slate-700 text-gray-600 dark:text-slate-300 py-2 rounded-lg cursor-not-allowed">Not Available</button>
                    )}
                  </div>

                  {(hall.status === "PENDING" || hall.status === "BOOKED") && (
                    <div className="mt-3 text-sm text-gray-600 dark:text-slate-400">
                      {hall.bookedSlots && hall.bookedSlots.length > 0 && (<div className="text-red-600 dark:text-red-300">Booked: {hall.bookedSlots.join(", ")}</div>)}
                      {hall.lockedSlots && hall.lockedSlots.length > 0 && (<div className="text-yellow-700 dark:text-yellow-300">Pending: {hall.lockedSlots.join(", ")}</div>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">My Bookings ({myBookings.length})</h2>
          {myBookings.length === 0 ? (
            <p className="text-gray-500 dark:text-slate-400">You have no bookings yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {myBookings.map(b => (
                <div key={b.id || b._id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-slate-100">{b.subject}</h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{b.hall} • {b.date} • {b.time}</p>
                    </div>
                    <div className="text-sm">
                      <span className={`px-3 py-1 rounded-full ${b.status === 'Approved' || b.status === 'APPROVED' ? 'bg-green-100 text-green-700' : b.status === 'Rejected' || b.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default HODHallSchedule;