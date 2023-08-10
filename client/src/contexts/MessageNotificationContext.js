import React, { createContext, useContext, useState } from "react";

// Create a new context
const MessageNotificationContext = createContext();

// Create a custom hook to use the context
export function useMessageNotification() {
  return useContext(MessageNotificationContext);
}

// Create the provider component
export function MessageNotificationProvider({ children }) {
  const [messageNotifications, setMessageNotifications] = useState([]);

  return (
    <MessageNotificationContext.Provider
      value={{
        messageNotifications,
        setMessageNotifications,
      }}
    >
      {children}
    </MessageNotificationContext.Provider>
  );
}
