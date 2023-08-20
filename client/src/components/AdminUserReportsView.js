import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserReports } from "../api/UserApi"; // You need to define this function
import { xorDecrypt } from '../HelperFunctions/Encrypt';
import { Link } from 'react-router-dom';
export default function AdminUserReportsView() {
  const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;
  let { encryptedId } = useParams();
  let userId = Number(xorDecrypt(encryptedId, secretKey));
  
  const [userReports, setUserReports] = useState([]);
  
  useEffect(() => {
    fetchUserReports();
  }, []);
  
  const fetchUserReports = async () => {
    try {
      const response = await getUserReports(userId); // Replace with the actual API call
      setUserReports(response.data); // Assuming the API response contains an array of user reports
    } catch (error) {
      console.error("Error fetching user reports:", error);
    }
  };
  
  return (
    <div className='flex flex-col bg-[#f3f3f3] shadow-lg rounded-md w-4/5 justify-center items-center'>
      <Link to="/users">
        <h2 className='m-4 font-bold text-2xl'>User Reports for User ID: <span className="hover:text-[#cc6200]">{userId}</span></h2>
      </Link>
      <Link to="/users" className='font-bold p-2 font-lg hover:text-[#cc6200]'>
        View Chat History
      </Link>
    
      <div className="max-h-60  overflow-y-auto">
        <table className="w-full text-center rounded-md shadow-lg">
          <thead className="rounded-md bg-black text-white">
            <tr>
              <th className="p-2 font-bold">Reporter Id</th>
              <th className="p-2 font-bold">Reporter Full Name</th>
              <th className="p-2 font-bold">Report Cause</th>
              <th className="p-2 font-bold">Report Message</th>
            </tr>
          </thead>
          <tbody>
            {userReports.map((report) => (
              <tr key={report.Id}>
                <td className="border p-2">{report.Reporting_User_Id}</td>
                <td className="border p-2">{report.reporting_first_name} {report.reporting_last_name}</td>
                <td className="border p-2">{report.Report_Cause}</td>
                <td className="border p-2">{report.Message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}