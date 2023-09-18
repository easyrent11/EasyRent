import React, { useState } from 'react';
import { reportUser } from '../api/UserApi';
import {notify} from "../HelperFunctions/Notify";

export default function ReportUserView({ reportedUserId, reportingUserId,setShowReportMenuForUser}) {
  const [reportMessage, setReportMessage] = useState('');
  const [selectedReportCause, setSelectedReportCause] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const reportCauses = ['Harassment', 'Spam', 'Inappropriate Content', 'Other'];

  function handleReportUser() {
    if (!reportedUserId || !reportingUserId || !reportMessage   || !selectedReportCause) {
      setErrorMessage('Please fill in all of the report details');
      return;
    }
    console.log(selectedReportCause, reportMessage);
    const reportDetails = {
      reportedUserId,
      reportingUserId,
      selectedReportCause,
      reportMessage,
    };

    reportUser(reportDetails)
      .then((res) => {
        notify('success', "Your report was sent successfully");
        setShowReportMenuForUser(null)
      })
      .catch((error) => {
        notify('error', error);
      });
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Report User</h2>
        <div className="mb-4">
          <label htmlFor="reportCause" className="block font-semibold mb-2">Select a Report Cause:</label>
          <select
            id="reportCause"
            className="w-full border rounded p-2"
            value={selectedReportCause}
            onChange={(e) => setSelectedReportCause(reportCauses[e.target.value])}
          >
            <option value="">Select a cause</option>
            {Object.keys(reportCauses).map((cause) => (
              <option key={cause} value={cause}>
                {reportCauses[cause]}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="reportMessage" className="block font-semibold mb-2">Report Message:</label>
          <textarea
            id="reportMessage"
            className="w-full border rounded p-2"
            rows="4"
            value={reportMessage}
            onChange={(e) => setReportMessage(e.target.value)}
          />
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="flex justify-end">
          <button
            className="bg-black text-white rounded p-2 mr-2 hover:bg-[#CC6200] font-semibold"
            onClick={handleReportUser}
          >
            Report
          </button>
          <button
            className="bg-gray-300 text-black rounded p-2 hover:bg-gray-400 font-semibold"
            onClick={() => setShowReportMenuForUser(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
