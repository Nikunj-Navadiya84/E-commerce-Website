import React, { useState, useEffect } from 'react';
import { FiPackage } from "react-icons/fi";
import { BsCurrencyDollar } from "react-icons/bs";
import { BsBoxes } from "react-icons/bs";
import { IoMdTrendingUp } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function Dashboards() {
  const [list, setList] = useState([]);
  const [filters, setFilters] = useState({ sales: true, price: true, quantity: true });
  const [startDate, setStartDate] = useState('Jan');
  const [endDate, setEndDate] = useState('Dec');
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("Active Orders");

  const datas = [
    { name: 'Jan', sales: 4000, price: 2400, quantity: 2400 },
    { name: 'Feb', sales: 3000, price: 1398, quantity: 2210 },
    { name: 'Mar', sales: 2000, price: 9800, quantity: 2290 },
    { name: 'Apr', sales: 2780, price: 3908, quantity: 2000 },
    { name: 'May', sales: 1890, price: 4800, quantity: 2181 },
    { name: 'Jun', sales: 2390, price: 3800, quantity: 2500 },
    { name: 'Jul', sales: 3490, price: 4300, quantity: 2100 },
    { name: 'Aug', sales: 3200, price: 4100, quantity: 2200 },
    { name: 'Sep', sales: 2800, price: 4000, quantity: 2300 },
    { name: 'Oct', sales: 3100, price: 4500, quantity: 2400 },
    { name: 'Nov', sales: 2900, price: 4200, quantity: 2150 },
    { name: 'Dec', sales: 3300, price: 4600, quantity: 2500 },
  ];

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      if (!token) return;
      const response = await axios.get('http://localhost:4000/api/products/list', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setList(response.data.products);
      } else {
        setList([]);
      }
    } catch (error) {
      setList([]);
    }
  };

  const totalProducts = list.length;
  const totalQuantity = list.reduce((acc, item) => acc + item.quantity, 0);

  const months = datas.map(d => d.name);

  const filteredData = datas.filter(d => {
    const startIndex = months.indexOf(startDate);
    const endIndex = months.indexOf(endDate);
    const currentIndex = months.indexOf(d.name);
    return currentIndex >= startIndex && currentIndex <= endIndex;
  });

  const exportCSV = () => {
    const csvHeaders = ["Month, Sales, Price, Quantity"];
    const csvRows = filteredData.map(row => `${row.name}, ${row.sales}, ${row.price}, ${row.quantity}`);
    const csvString = [csvHeaders, ...csvRows].join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard_data_filtered.csv";
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className='main-content'>
      <div className='flex items-center justify-between shadow p-5'>
        <h1 className='text-xl'>Dashboards</h1>

        <div className="flex flex-row items-center gap-6 text-sm">

          <label> Start Month <select value={startDate} onChange={(e) => setStartDate(e.target.value)} className="ml-2 border p-1">
            {months.map(month => <option key={month} value={month}>{month}</option>)}
          </select>
          </label>

          <label> End Month <select value={endDate} onChange={(e) => setEndDate(e.target.value)} className="ml-2 border p-1">
            {months.map(month => <option key={month} value={month}>{month}</option>)}
          </select>
          </label>

          <button
            onClick={exportCSV}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">
            Export CSV
          </button>

        </div>

      </div>

      <div className='flex gap-8 p-5'>

        <div className='flex flex-col w-[50%]'>
          <div className='flex flex-row gap-8'>

            {/* Box section */}
            <div className='w-[100%]'>
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 mb-5">
                <div className="flex items-center gap-8">
                  <div className="w-fit rounded-full bg-violet-200 p-3 text-violet-600">
                    <FiPackage size={25} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 dark:text-gray-300 text-md mb-2">Total Products</p>
                    <p className="text-2xl  text-gray-900 dark:text-white">{totalProducts}</p>
                    <div className="flex justify-end">
                      <span className="flex items-center text-green-500 font-medium">
                        <IoMdTrendingUp size={18} className="mr-1" /> 25%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 mb-5">
                <div className="flex items-center gap-8">
                  <div className="w-fit rounded-full bg-cyan-200 p-3 text-cyan-600">
                    <BsBoxes size={25} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 dark:text-gray-300 text-md mb-2">Total Quantity</p>
                    <p className="text-2xl  text-gray-900 dark:text-white">{totalQuantity}</p>
                    <div className="flex justify-end">
                      <span className="flex items-center text-green-500 font-medium">
                        <IoMdTrendingUp size={18} className="mr-1" /> 25%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='w-[100%]'>
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 mb-5">
                <div className="flex items-center gap-8">
                  <div className="w-fit rounded-full bg-green-200 p-3 text-emerald-600 ">
                    <FaUsers size={25} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 dark:text-gray-300 text-md mb-2">Total Customers</p>
                    <p className="text-2xl text-gray-900 dark:text-white">0</p>
                    <div className="flex justify-end">
                      <span className="flex items-center text-green-500 font-medium">
                        <IoMdTrendingUp size={18} className="mr-1 " /> 25%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 mb-5">
                <div className="flex items-center gap-8">
                  <div className="w-fit rounded-full bg-orange-200 p-3 text-orange-600">
                    <BsCurrencyDollar size={25} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 dark:text-gray-300 text-md mb-2">Total Paid Orders</p>
                    <p className="text-2xl text-gray-900 dark:text-white">0</p>
                    <div className="flex justify-end">
                      <span className="flex items-center text-green-500 font-medium">
                        <IoMdTrendingUp size={18} className="mr-1" /> 25%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='p-5 bg-white rounded max-h-96'>
            <div className='flex flex-row justify-between mb-5'>
              <h2 className='text-md'>Orders</h2>
              <div className="flex gap-3 text-sm">
                {["Active Orders", "Completed", "Cancelled"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`p-2 rounded cursor-pointer ${activeTab === tab ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <table className='border w-[100%] text-center border-gray-200'>
              <thead className='text-md bg-gray-200'>
                <tr>
                  <th className='w-1/4 py-2 px-3'>Name</th>
                  <th className='w-1/9 py-2 px-3'>Price</th>
                  <th className='w-1/7 py-2 px-3'>Delivery Date</th>
                  <th className='w-1/5 py-2 px-3'>Images</th>
                </tr>
              </thead>
              <tbody className='text-sm hover:bg-gray-100'>
                <tr>
                  <td className='py-2 px-3'></td>
                  <td className='py-2 px-3'></td>
                  <td className='py-2 px-3'></td>
                  <td className='py-2 px-3'></td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* Chart section */}
        <div className="p-6 w-[50%] bg-white border border-gray-200 rounded max-h-90 shadow-sm">
          <h2 className="text-lg  text-gray-900 mb-4">Sales, Revenue & Profit Overview</h2>

          <div className="flex gap-4 mb-4 text-sm">
            <label>
              <input type="checkbox" checked={filters.sales} onChange={() => setFilters(prev => ({ ...prev, sales: !prev.sales }))} /> Sales
            </label>
            <label>
              <input type="checkbox" checked={filters.price} onChange={() => setFilters(prev => ({ ...prev, price: !prev.price }))} /> Price
            </label>
            <label>
              <input type="checkbox" checked={filters.quantity} onChange={() => setFilters(prev => ({ ...prev, quantity: !prev.quantity }))} /> Quantity
            </label>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {filters.sales && <Bar dataKey="sales" fill="#8884d8" />}
              {filters.price && <Bar dataKey="price" fill="#82ca9d" />}
              {filters.quantity && <Bar dataKey="quantity" fill="#ffc658" />}

            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}

export default Dashboards;
