import React from "react";
import { FaTimes } from "react-icons/fa";

export default function ({ messages, onClose, clearRoom }) {
  let prevDate = null;
  return (
    <div className="fixed inset-y-1/4 w-2/4 bg-white shadow-lg rounded-md z-10">
      <div className="absolute top-2 p-2 right-2 text-gray-600 hover:text-gray-800 transition">
        <FaTimes
          onClick={() => {
            onClose();
            if(clearRoom){
              clearRoom();
            }
          }}
          size={30}
          className="mx-auto hover:text-[#cc6200] cursor-pointer text-black"
        />
      </div>
      {messages.length === 0 ? (
        <p className="flex items-center justify-center text-4xl h-full  text-black ">
          No Messages Yet...
        </p>
      ) : (
        <div className="p-4 max-h-full overflow-y-auto">
          <ul>
            {messages.map((message, index) => {
              const currentDate = new Date(
                message.timestamp
              ).toLocaleDateString();
              const messageTime = new Date(
                message.timestamp
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });

              let dateDisplay = null;
              if (currentDate !== prevDate) {
                dateDisplay = (
                  <p className="text-gray-600 text-sm mt-2">{currentDate}</p>
                );
                prevDate = currentDate;
              }

              return (
                <li key={index} className="mb-4">
                  {dateDisplay}
                  <p className="mb-1 text-xl">
                    <strong>{message.senderName}</strong> to{" "}
                    {message.recipientName}
                  </p>
                  <p className="text-lg text-red-500">{message.message}</p>
                  <p className="text-gray-600 text-sm mt-1">{messageTime}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
