import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OAuthCallback from "./pages/OAuthCallback";
import Pending from "./pages/Pending";

import StudentDashboard from "./pages/dashboards/StudentDashboard";
import StudentTimetable from "./pages/student/StudentTimetable";
import StudentNotices from "./pages/student/StudentNotices";
import StudentProfile from "./pages/student/StudentProfile";

import LecturerDashboard from "./pages/dashboards/LecturerDashboard";
import LecturerHallAvailability from "./pages/lecturer/LecturerHallAvailability";
import LecturerBookings from "./pages/lecturer/LecturerBookings";
import LecturerNoticeManagement from "./pages/lecturer/LecturerNoticeManagement";
import LecturerProfile from "./pages/lecturer/LecturerProfile";
import Notices from "./pages/Notices";

import HODLayout from "./layouts/HODLayout";
import HODDashboard from "./pages/dashboards/HODDashboard";
import HODHallSchedule from "./pages/hod/HODHallSchedule";
import HODHistory from "./pages/hod/HODHistory";
import HODNotices from "./pages/hod/HODNotices";
import HODProfile from "./pages/hod/HODProfile";
import HODHallBooking from "./pages/hod/HODHallBooking";


import TOLayout from "./layouts/TOLayout";
import TODashboard from "./pages/dashboards/TODashboard";
import TOPendingUsers from "./pages/to/TOPendingUsers";
import TOHistory from "./pages/to/TOHistory";
import TONotices from "./pages/to/TONotices";
import TOProfile from "./pages/to/TOProfile";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 80,
          right: 20,
        }}
        toastOptions={{
          className: '',
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          },
        }}
      />

      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900 transition-colors">

        <Navbar />

      <main className="flex-grow">
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/pending" element={<Pending />} />

          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/timetable"
            element={
              <ProtectedRoute role="student">
                <StudentTimetable />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/notices"
            element={
              <ProtectedRoute role="student">
                <StudentNotices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/profile"
            element={
              <ProtectedRoute role="student">
                <StudentProfile />
              </ProtectedRoute>
            }
          />


          <Route
            path="/lecturer"
            element={
              <ProtectedRoute role="lecturer">
                <LecturerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lecturer/hall-availability"
            element={
              <ProtectedRoute role="lecturer">
                <LecturerHallAvailability />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lecturer/bookings"
            element={
              <ProtectedRoute role="lecturer">
                <LecturerBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lecturer/notices"
            element={
              <ProtectedRoute role="lecturer">
                <LecturerNoticeManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lecturer/profile"
            element={
              <ProtectedRoute role="lecturer">
                <LecturerProfile />
              </ProtectedRoute>
            }
          />

          <Route path="/notices" element={<Notices />} />

          
          {/* HOD ROUTES */}

          <Route
            path="/hod"
            element={
              <ProtectedRoute role="hod">
                <HODDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hod/hall-schedule"
            element={
              <ProtectedRoute role="hod">
                <HODHallSchedule />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hod/history"
            element={
              <ProtectedRoute role="hod">
                <HODHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hod/notices"
            element={
              <ProtectedRoute role="hod">
                <HODNotices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hod/profile"
            element={
              <ProtectedRoute role="hod">
                <HODProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hod/book-hall"
            element={
              <ProtectedRoute role="hod">
                <HODHallBooking />
              </ProtectedRoute>
            }
          />

        

          {/* TO ROUTES */}

          <Route
            path="/to"
            element={
              <ProtectedRoute role="to">
                <TODashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/to/pending-users"
            element={
              <ProtectedRoute role="to">
                <TOPendingUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/to/history"
            element={
              <ProtectedRoute role="to">
                <TOHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/to/notices"
            element={
              <ProtectedRoute role="to">
                <TONotices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/to/profile"
            element={
              <ProtectedRoute role="to">
                <TOProfile />
              </ProtectedRoute>
            }
          />

          {/* 404 PAGE */}

          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-[60vh]">
                <h1 className="text-3xl font-semibold text-gray-700">
                  404 - Page Not Found
                </h1>
              </div>
            }
          />

        </Routes>
      </main>

      <Footer />

    </div>
    </>
  );
}

export default App;