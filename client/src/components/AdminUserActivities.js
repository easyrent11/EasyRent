import React, { useEffect, useState } from "react";
import { getLatestActivities } from "../api/AdminApi";

export default function AdminUserActivities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getLatestActivities()
      .then((data) => {
        console.log(data.data.results);
        setActivities(data.data.results);
      })
      .catch((error) => console.error("Error fetching activities:", error));
  }, []);

  return (
    <div className="flex w-full shaodw-lg mt-1 rounded-ms bg-white flex-1 flex-col  p-6">
      <h2 className="text-2xl font-semibold mb-4">Recent User Activities</h2>
      <div className=" h-full shadow-md p-4 rounded">
        {activities.length === 0 ? (
          <p className="text-gray-500">No Activities Found</p>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li
                key={activity.activity_id}
                className="flex items-center justify-between border-b py-2"
              >
                <li>
                  <p className="text-lg font-semibold mb-1">
                    {activity.activity_type}
                  </p>
                  <p className="text-gray-500">{activity.details}</p>
                </li>
                <p className="text-lg font-semibold mb-1">
                  {new Date(activity.activity_time).toLocaleString([], {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
