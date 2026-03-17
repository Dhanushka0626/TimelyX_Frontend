import heroImage from "../assets/lecture-hall.jpg";
import logo from "../assets/logo.png";

const Home = () => {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 transition-colors">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 py-12 sm:py-16 lg:py-20 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-50 mb-4 sm:mb-6 leading-tight">
            Lecture Hall Management System
          </h1>

          <p className="text-gray-600 dark:text-slate-300 text-base sm:text-lg max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4">
            A role-based academic scheduling platform designed to improve
            efficiency, prevent conflicts, and streamline lecture hall bookings
            across departments.
          </p>

          <div className="mx-auto w-full max-w-4xl rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl ring-1 ring-slate-200/80 dark:ring-slate-700/80 bg-slate-200 dark:bg-slate-700">
            <img
              src={heroImage}
              alt="Lecture Hall"
              className="w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] object-cover object-center"
            />
          </div>

        </div>
      </section>

      {/* DESCRIPTION SECTION */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-slate-50 mb-4 sm:mb-6">
              Timelyx
            </h2>

            <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
              Timelyx provides a structured workflow for lecture hall booking
              and approval processes. Lecturers submit booking requests through
              an intelligent availability system, while the HOD evaluates
              requests via a conflict-detection mechanism. Students receive
              synchronized timetable updates in real time.
            </p>
          </div>

          <div className="order-first md:order-last flex items-center justify-center">
            <img
              src={logo}
              alt="Timelyx Logo"
              className="w-full max-w-[170px] sm:max-w-[210px] md:max-w-[240px] lg:max-w-[280px] h-auto object-contain"
            />
          </div>

        </div>
      </section>

      {/* KEY FEATURES */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gray-100 dark:bg-slate-900 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">

          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-slate-50 mb-8 sm:mb-12 lg:mb-14">
            Key Features
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition">
              <div className="text-blue-600 dark:text-blue-400 mb-3 sm:mb-4 text-2xl sm:text-3xl">✓</div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 dark:text-slate-100">
                Smart Booking
              </h3>
              <p className="text-gray-600 dark:text-slate-300 text-sm">
                Automated hall selection based on capacity and availability.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition">
              <div className="text-blue-600 dark:text-blue-400 mb-3 sm:mb-4 text-2xl sm:text-3xl">👥</div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 dark:text-slate-100">
                Role-Based Access
              </h3>
              <p className="text-gray-600 dark:text-slate-300 text-sm">
                Customized dashboards for lecturers, students, and HOD.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition">
              <div className="text-blue-600 dark:text-blue-400 mb-3 sm:mb-4 text-2xl sm:text-3xl">⏱</div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 dark:text-slate-100">
                Real-Time Updates
              </h3>
              <p className="text-gray-600 dark:text-slate-300 text-sm">
                Instant approval status and timetable synchronization.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition">
              <div className="text-blue-600 dark:text-blue-400 mb-3 sm:mb-4 text-2xl sm:text-3xl">🛡</div>
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 dark:text-slate-100">
                Conflict Detection
              </h3>
              <p className="text-gray-600 dark:text-slate-300 text-sm">
                Prevents double bookings and scheduling clashes automatically.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;