import React, { useState } from "react";
import { Link, renderMatches } from "react-router-dom";
import { useUserOrders } from "../contexts/UserOrdersContext";
import { useMessageNotification } from "../contexts/MessageNotificationContext";

const NotificationDropdown = ({ userOrders, userRenteeOrders, setOrder }) => {
  return(
    <div>No New Notifications</div>
  );
};

export default NotificationDropdown;
