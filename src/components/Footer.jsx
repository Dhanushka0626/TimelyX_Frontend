import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-gray-300 dark:text-slate-400 mt-20 transition-colors">

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12">

        {/* BRAND SECTION */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Timelyx Logo" className="h-10 w-auto" />
            <h2 className="text-white text-lg font-semibold">
              Timelyx
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-gray-400">
            Timelyx is a professional Lecture Hall Management System designed
            to streamline academic scheduling, prevent booking conflicts, and
            enhance departmental efficiency.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* SYSTEM ACCESS */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            System Access
          </h3>

          <ul className="space-y-2 text-sm">
            <li className="hover:text-white transition cursor-pointer">
              Student Portal
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Lecturer Dashboard
            </li>
            <li className="hover:text-white transition cursor-pointer">
              HOD Approval Panel
            </li>
            <li className="hover:text-white transition cursor-pointer">
              TO Management
            </li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Contact Information
          </h3>

          <ul className="space-y-2 text-sm text-gray-400">
            <li>Email: supporttimelyx@gmail.com</li>
            <li>Phone: 0705113030</li>
            <li>Faculty of Engineering</li>
            <li>University of Jaffna</li>
            <li>Ariviyal Nagar, Killinochchi</li>
          </ul>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 mt-6 text-lg">
            <span className="hover:text-white cursor-pointer transition">🌐</span>
            <span className="hover:text-white cursor-pointer transition">📘</span>
            <span className="hover:text-white cursor-pointer transition">📧</span>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="border-t border-gray-700 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Timelyx. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;