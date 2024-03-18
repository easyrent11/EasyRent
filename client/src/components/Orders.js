import React, { useEffect, useState } from "react";
import { useUserOrders } from "../contexts/UserOrdersContext";
import { useNavigate, Link } from "react-router-dom";
import { changeOrderStatus } from "../api/UserApi";
import { notify } from "../HelperFunctions/Notify";
import { formatDate } from "../HelperFunctions/FormatDate";
import { getOrderById } from "../api/UserApi";
import { xorEncrypt } from "../HelperFunctions/Encrypt";

import io from "socket.io-client";
const socket = io.connect("http://localhost:3001");

const Orders = () => {
  const navigate = useNavigate();
  const { userOrders, userRenteeOrders, setUserRenteeOrders, fetchUserOrders } =
    useUserOrders();
  const [renterId, setRenterId] = useState(null);
  const secretKey = process.env.REACT_APP_ENCRYPTION_KEY;
  const [filteredUserOrders, setFilteredUserOrders] = useState([...userOrders]);
  const [filteredRenteeOrders, setFilteredRenteeOrders] = useState([...userRenteeOrders]); 

  const [filter, setFilter] = useState("all");
  const [renteeFilter,setRenteeFilter] = useState("all");

  const [sort, setSort] = useState("newest");
  const [renteeSort, setRenteeSort] = useState("newest");




  useEffect(() => {
    // Call the fetch function when the component mounts
    fetchUserOrders();
  }, [fetchUserOrders]);

  // function to take the user to the orded car page view.
  function handleGoToCarClick(platesNumber) {
    // the encrypted plates number.
    const encNumber = xorEncrypt(platesNumber.toString(), secretKey);
    console.log(encNumber);
    navigate(`/ViewOrderedCarDetails/${encNumber}`);
  }


  // function that cancels a user's order.
  function handleCancelOrder(orderId) {
    // get the renter id
    getOrderById(orderId)
      .then((res) => {
        console.log("res data from get order by id", res.data);
        setRenterId(res.data.Renter_Id); //save the renter id.
      })
      .catch((error) => {
        console.log(error);
      });
    // declare the new status.
    const status = "cancelled";
    // change the status to cancelled.
    const newOrderStatus = {
      orderId,
      status,
    };
    changeOrderStatus(newOrderStatus)
      .then((res) => {
        const canceledOrderId = res.data.order.Order_Id;
        const updatedOrders = userRenteeOrders.filter(
          (order) => order.Order_Id !== canceledOrderId
        );
        setUserRenteeOrders(updatedOrders);
        socket.emit("order-cancelled", {
          userId: renterId,
          orderId: canceledOrderId,
        });
        notify("success", "Your order has been successfully cancelled");
      })
      .catch((err) => {
        notify("error", `Failed to cancel order ${err}`);
      });
  }

  useEffect(() => {
    socket.on("order-cancelled", (data) => {
      console.log("I got data from cancel order ", data);
    });
  }, [renterId]);

   // functions to handle filter and sort changes.
   const handleFilterChange = (e) => {
    localStorage.removeItem("userOrdersFilter");
    setFilter(e.target.value);
    localStorage.setItem("userOrdersFilter", e.target.value);
  };
  const handleRenteeFilterChange = (e) => {
    localStorage.removeItem("renteeOrdersFilter");
    setRenteeFilter(e.target.value);
    localStorage.setItem("renteeOrdersFilter", e.target.value);
  } 
  const handleSortChange = (e) => {
    localStorage.removeItem('userOrdersSort');
    setSort(e.target.value);
    localStorage.setItem("userOrdersSort", e.target.value);
    
  };
  const handleRenteeSortChange = (e) => {
    localStorage.removeItem("renteeOrdersSort");
    setRenteeSort(e.target.value);
    localStorage.setItem("renteeOrdersSort", e.target.value);
    
  };

  const sortUserOrders = () => {
    let sortedOrders = [...userOrders];
    if (filter !== "all") {
      sortedOrders = sortedOrders.filter(order => order.status === filter);
    }
    sortedOrders.sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.Order_Date) - new Date(a.Order_Date);
      } else {
        return new Date(a.Order_Date) - new Date(b.Order_Date);
      }
    });
    setFilteredUserOrders(sortedOrders);
  };
  
  const sortRenteeOrders = () => {
    let sortedOrders = [...userRenteeOrders];
    if (renteeFilter !== "all") {
      sortedOrders = sortedOrders.filter(order => order.status === renteeFilter);
    }
    sortedOrders.sort((a, b) => {
      if (renteeSort === "newest") {
        return new Date(b.Order_Date) - new Date(a.Order_Date);
      } else {
        return new Date(a.Order_Date) - new Date(b.Order_Date);
      }
    });
    setFilteredRenteeOrders(sortedOrders);
  };
  // 2 functions to filter both the user and userRentee orders.
  const filterRenteeOrders = () => {
    let filteredRenteeOrders = [...userRenteeOrders];
    filteredRenteeOrders = renteeFilter === "all" ? userRenteeOrders : filteredRenteeOrders.filter(order => order.status === renteeFilter);
    setFilteredRenteeOrders(filteredRenteeOrders);
  }
  const filterUserOrders = () => {
    let filteredUserOrders = [...userOrders]; 
    filteredUserOrders = filter === "all" ? userOrders : filteredUserOrders.filter(order => order.status === filter);
    setFilteredUserOrders(filteredUserOrders);
};


  useEffect(() => {
    const storedFilter = localStorage.getItem("userOrdersFilter");
    setFilter(storedFilter || "all");
}, []);

useEffect(() => {
    filterUserOrders();
}, [filter, userOrders]);

useEffect(() => {
  const storedFilter = localStorage.getItem("renteeOrdersFilter");
  setRenteeFilter(storedFilter || "all");
}, []);

useEffect(() => {
  filterRenteeOrders();
}, [renteeFilter, userRenteeOrders]);

useEffect(() => {
  const storedSort = localStorage.getItem("userOrdersSort");
  setSort(storedSort || "newest");
}, []);

useEffect(() => {
  sortUserOrders();
}, [sort, filter, userOrders]);

useEffect(() => {
  const storedSort = localStorage.getItem("renteeOrdersSort");
  setRenteeSort(storedSort || "newest");
}, []);

useEffect(() => {
  sortRenteeOrders();
}, [renteeSort, renteeFilter, userRenteeOrders]);


  return (
    <div className="flex-1 p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-4">
          Orders Made on Your Cars:
        </h1>
        <article className="w-full  flex items-center">
          <div className="p-2">
            <label htmlFor="filter" className="mr-2">Filter : </label>
            <select id="filter" value={filter} onChange={handleFilterChange} className="px-2 py-1 border border-gray-300 rounded-md">
              <option value="all">All</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="p-2">
            <label htmlFor="sort" className="mr-2">Sort : </label>
            <select id="sort" value={sort} onChange={handleSortChange} className="px-2 py-1 border border-gray-300 rounded-md">
              <option value="newest">Newest to Oldest</option>
              <option value="oldest">Oldest to Newest</option>
            </select>
          </div>
        </article>
        {userOrders.length === 0 ? (
          <p>No orders made by you.</p>
        ) : (
          <div className="shadow w-full  border-b  overflow-hidden border-gray-200 sm:rounded-lg"  style={{ maxHeight: "50vh",overflowY: "auto" }}>
            <table className=" min-w-full divide-y divide-gray-200">
              <thead className="border-green-500  bg-gray-50 overflow-y-auto">
                <tr className="">
                  <th
                    scope="col"
                    className="px-6 py-3  text-left text-xs font-medium  text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Car Plates Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order Actions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Car
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact Rentee 
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y  divide-gray-200">
                {filteredUserOrders.map((order) => (
                  <tr key={order.Order_Id}>
                    <td
                      className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-blue-900"
                      onClick={() =>
                        navigate(
                          `/Notifications/${order.Order_Id}/renterAccepted`
                        )
                      }
                    >
                      {order.Order_Id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(order.Start_Date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(order.End_Date)}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.Car_Plates_Number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.Start_Time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.End_Time}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-bold text-sm ${
                        order.status === "accepted"
                          ? "text-green-500"
                          : order.status === "declined"
                          ? "text-red-500"
                          : order.status === "cancelled"
                          ? "text-gray-500"
                          : order.status === "pending"
                          ? "text-blue-500"
                          : ""
                      }`}
                    >
                      {order.status}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(order.Order_Date)}
                    </td>
                    {order.status === "pending" && (
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-blue-900">
                        <Link
                          to={`/Notifications/${order.Order_Id}/order-request-notification`}
                        >
                          View Order
                        </Link>
                      </td>
                    )}

                    {order.status === "declined" && (
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-bold text-red-900 p-2">
                        N/A
                      </td>
                    )}
                    {order.status === "accepted" && (
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-blue-900">
                        <Link to={`/Reports/${order.Order_Id}`}>
                          View Report
                        </Link>
                      </td>
                    )}

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                      <button
                        onClick={() =>
                          handleGoToCarClick(order.Car_Plates_Number)
                        }
                      >
                        {" "}
                        View Car{" "}
                      </button>
                    </td>
                    <button
                      className="text-center w-full py-2 px-4 rounded-lg m-1"
                      onClick={() => localStorage.setItem('targetedUser', order.Rentee_id)}
                    >
                      <Link className=" w-full text-sm text-center" to="/ChatApp">Chat</Link>
                    </button>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-semibold mb-4">Orders you made : </h1>
        <article className="w-full flex items-center">
          <div className="p-2">
            <label htmlFor="rentee-filter" className="mr-2">Filter : </label>
            <select id="rentee-filter" value={renteeFilter} onChange={handleRenteeFilterChange} className="px-2 py-1 border border-gray-300 rounded-md">
              <option value="all">All</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="p-2">
            <label htmlFor="rentee-sort" className="mr-2">Sort : </label>
            <select id="rentee-sort" value={renteeSort} onChange={handleRenteeSortChange} className="px-2 py-1 border border-gray-300 rounded-md">
              <option value="newest">Newest to Oldest</option>
              <option value="oldest">Oldest to Newest</option>
            </select>
          </div>
        </article>
        {userRenteeOrders.length === 0 ? (
          <p>No orders made on your cars.</p>
        ) : (
          <div className="shadow w-full overflow-hidden border-b border-gray-200 sm:rounded-lg"  style={{ maxHeight: "50vh",overflowY: "auto" }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order Date
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order Actions
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Car
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact Owner
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRenteeOrders.map((order) => (
                  <tr key={order.Order_Id}>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-blue-900">
                      {order.Order_Id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(order.Start_Date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(order.End_Date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.Start_Time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.End_Time}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-bold text-sm ${
                        order.status === "accepted"
                          ? "text-green-500"
                          : order.status === "declined"
                          ? "text-red-500"
                          : order.status === "cancelled"
                          ? "text-gray-500"
                          : order.status === "pending"
                          ? "text-blue-500"
                          : ""
                      }`}
                    >
                      {order.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {/* {new Date(order.Order_Date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })} */}
                      {formatDate(order.Order_Date)}
                    </td>
                    {order.status === "accepted" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                        <Link to={`/Reports/${order.Order_Id}`}>
                          View Report
                        </Link>
                      </td>
                    )}

                    {order.status === "pending" && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-900 cursor-pointer p-2">
                          <button
                            onClick={() => {
                              handleCancelOrder(order.Order_Id);
                            }}
                          >
                            Cancel Order
                          </button>
                        </td>
                      </>
                    )}
                    {order.status === "declined" && (
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-bold text-red-900 p-2">
                        N/A
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900">
                      <button
                        onClick={() =>
                          handleGoToCarClick(order.Car_Plates_Number)
                        }
                      >
                        {" "}
                        View Car{" "}
                      </button>
                    </td>
                    <td>
                      <button
                        className="w-full py-2 px-4 rounded-lg m-1"
                        onClick={() => localStorage.setItem('targetedUser', order.Renter_Id)}
                      >
                        <Link className="w-full text-sm text-center" to="/ChatApp">Chat</Link>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
