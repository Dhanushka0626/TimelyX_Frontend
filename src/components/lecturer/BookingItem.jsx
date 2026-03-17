const BookingItem = ({ title, hall, date, time, status }) => {

  const statusColor = {
    Approved: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
    Pending: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
    Rejected: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
  };

  return (
    <div className="flex justify-between items-center border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg p-5 hover:shadow-sm transition-colors">

      <div>
        <h4 className="text-md font-semibold text-gray-800 dark:text-slate-100">
          {title}
        </h4>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          {hall} • {date} at {time}
        </p>
      </div>

      <span className={`px-4 py-1 text-sm rounded-full font-medium ${statusColor[status]}`}>
        {status}
      </span>

    </div>
  );
};

export default BookingItem;