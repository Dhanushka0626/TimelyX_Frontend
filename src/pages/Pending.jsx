import { Link } from "react-router-dom";

const Pending = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg bg-white shadow rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Account Awaiting Approval</h2>
        <p className="text-gray-600 mb-6">
          Your account has been created and is awaiting approval from the administrator. You will be notified when your account is approved.
        </p>
        <Link to="/" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded">Back to Home</Link>
      </div>
    </div>
  );
};

export default Pending;
