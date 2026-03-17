import { Link } from "react-router-dom";

const InfoCard = ({ title, description, icon, color, link }) => {
  return (
    <Link to={link}>
      <div className={`border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-colors bg-white dark:bg-slate-800 ${color}`}>

        <div className="flex items-start gap-4">

          <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-700 shadow flex items-center justify-center transition-colors">
            {icon}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-2 leading-relaxed">
              {description}
            </p>
          </div>

        </div>

      </div>
    </Link>
  );
};

export default InfoCard;