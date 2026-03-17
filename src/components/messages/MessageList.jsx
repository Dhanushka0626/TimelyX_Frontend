import React, { useEffect, useState } from 'react';
import MessageItem from './MessageItem';
import messageService from '../../services/messageService';
import { Link } from 'react-router-dom';

const MessageList = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await messageService.fetchMessages();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleClick = async (item) => {
    await messageService.markRead(item.id);
    await load();
    if (onClose) onClose();
  };

  const handleMarkAll = async () => {
    await messageService.markAllRead();
    await load();
  };

  return (
    <div className="w-96 max-w-full bg-white border rounded-lg shadow-md p-2">
      <div className="flex items-center justify-between px-3 py-2">
        <h3 className="text-sm font-semibold">Notifications</h3>
        <div className="flex items-center gap-2">
          <button onClick={handleMarkAll} className="text-xs text-indigo-600 hover:underline">Mark all read</button>
        </div>
      </div>

      <div className="h-56 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">Loading…</div>
        ) : messages.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
        ) : (
          <div className="space-y-2 p-2">
            {messages.slice(0,5).map((m) => (
              <MessageItem key={m.id} item={m} onClick={handleClick} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t p-3 text-right">
        <Link to="/notices" className="text-sm text-indigo-600 hover:underline" onClick={() => onClose && onClose()}>Show all</Link>
      </div>
    </div>
  );
};

export default MessageList;
