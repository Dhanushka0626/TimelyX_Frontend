import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import messageService from "../services/messageService";

const Notices = () => {
  const [messages, setMessages] = useState([]);

  const load = async () => {
    const data = await messageService.fetchMessages();
    setMessages(data);
  };

  useEffect(() => { load(); }, []);

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Notices</h1>
        <p className="text-sm text-gray-500">All notifications and system messages.</p>

        <div className="grid gap-3">
          {messages.map((m) => (
            <div key={m.id} className={`p-4 rounded-lg border ${m.read ? 'bg-white' : 'bg-indigo-50'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{m.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{m.body}</p>
                </div>
                <div className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-2 text-sm text-gray-500">From: {m.from || 'System'}</div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Notices;
