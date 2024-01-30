
import React from 'react';

export default function HelpTextPopup({ onClose, helpText }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-900">
      <div className="bg-white p-6 rounded-md max-w-md">
        <div className="flex justify-end">
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            X
          </button>
        </div>
        <div className="text-sm text-gray-700">{helpText}</div>
      </div>
    </div>
  );
}
