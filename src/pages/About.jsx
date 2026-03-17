const About = () => {
  return (
     <div className="bg-gray-100 dark:bg-slate-900 min-h-screen transition-colors">

      {/* PAGE CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

        {/* MAIN TITLE */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-slate-50 mb-10 sm:mb-16">
          About Our System
        </h1>

        {/* MISSION SECTION */}
          <section className="mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-slate-50 mb-4 sm:mb-6">
            Mission
          </h2>

            <p className="text-base sm:text-lg text-gray-700 dark:text-slate-300 leading-relaxed">
            Timelyx is designed to revolutionize
            how educational institutions manage their lecture spaces. We
            provide a comprehensive, user-friendly platform that ensures
            efficient booking, scheduling, and resource allocation across
            departments while maintaining transparency and accuracy.
          </p>
        </section>

        {/* KEY BENEFITS */}
          <section className="mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-slate-50 mb-6 sm:mb-10">
            Key Benefits
          </h2>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">

            {/* For Lecturers */}
            <div className="bg-blue-100 dark:bg-blue-950 p-6 sm:p-8 rounded-xl shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 dark:text-slate-100">
                For Lecturers
              </h3>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-800 dark:text-slate-200">
                <li>• Quick and easy hall booking</li>
                <li>• Real-time availability checking</li>
                <li>• Automated conflict detection</li>
                <li>• Instant approval notifications</li>
              </ul>
            </div>

            {/* For Students */}
              <div className="bg-green-100 dark:bg-green-950 p-6 sm:p-8 rounded-xl shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 dark:text-slate-100">
                For Students
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-800 dark:text-slate-200">
                <li>• Personalized timetable access</li>
                <li>• Real-time schedule updates</li>
                <li>• Important notice notifications</li>
                <li>• Hall availability information</li>
              </ul>
            </div>

            {/* For HODs */}
            <div className="bg-purple-100 p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4">
                For HODs
              </h3>
              <ul className="space-y-3 text-gray-800">
                <li>• Centralized approval system</li>
                <li>• Conflict detection portal</li>
                <li>• Comprehensive reporting</li>
                <li>• Efficient resource management</li>
              </ul>
            </div>

            {/* For Administration */}
            <div className="bg-yellow-100 p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4">
                For Administration
              </h3>
              <ul className="space-y-3 text-gray-800">
                <li>• Complete system oversight</li>
                <li>• Usage analytics</li>
                <li>• Resource optimization</li>
                <li>• Audit trail maintenance</li>
              </ul>
            </div>

          </div>
        </section>

        {/* TECHNOLOGY STACK 
        <section>
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Technology Stack
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed">
            Built with modern web technologies including React, Node.js,
            MongoDB, Express, and Tailwind CSS, our system ensures a
            responsive, fast, and reliable experience across all devices.
            The architecture follows a secure, scalable MERN stack structure
            designed for institutional-level deployment.
          </p>
        </section>*/}

      </div>
    </div>
  );
};

export default About;