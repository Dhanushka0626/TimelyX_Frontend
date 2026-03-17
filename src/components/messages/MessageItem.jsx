import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const MessageItem = ({ item, onClick }) => {
  const timeLabel = item?.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : '';

  return (
    <div
      onClick={() => onClick && onClick(item)}
      className={`flex gap-3 items-start p-3 rounded-lg hover:bg-gray-50 cursor-pointer ${item.read ? 'bg-white' : 'bg-indigo-50'}`}>

      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
        {item.from?.charAt(0)?.toUpperCase() || 'N'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900 truncate">{item.title}</h4>
          <span className="text-xs text-gray-400 ml-2">{timeLabel}</span>
        </div>

        <p className="mt-1 text-sm text-gray-600 truncate">{item.body}</p>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-500">From: {item.from || 'System'}</span>
          {!item.read && <span className="text-xs text-indigo-600 font-medium">● New</span>}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
