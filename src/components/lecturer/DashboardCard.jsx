const DashboardCard = ({ title, value, icon, bg }) => {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-6 flex justify-between items-center shadow-sm hover:shadow-md transition-colors">

      <div>
        <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
          {title}
        </p>
        <h3 className="text-3xl font-semibold text-gray-800 dark:text-slate-100 mt-2">
          {value}
        </h3>
      </div>

      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bg}`}>
        {icon}
      </div>

    </div>
  );
};

export default DashboardCard;