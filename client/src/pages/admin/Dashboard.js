import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import {
  FaShoppingBag,
  FaMoneyCheckAlt,
  FaBoxes,
  FaUser,
} from "react-icons/fa";
import { GrUserNew, GrMoney } from "react-icons/gr";

import { TbCategoryFilled } from "react-icons/tb";
import api from "../../config/axiosConfig";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MonthlyRevenueChart from "../../components/MonthlyRevenueChart";
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [orderData, setOrderData] = useState([]);
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
  });
  const [financialStats, setFinancialStats] = useState({
    totalRevenue: 0,
    averageOrderValue: 0,
    monthlyRevenue: [],
  });
  const [newUsersCount, setNewUsersCount] = useState(0);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/dashboard-stats");
        console.log(data);
        setStats({
          products: data.productCount,
          categories: data.categoryCount,
          orders: data.orderCount,
          users: data.userCount,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get(`/admin/orders-by-year/${selectedYear}`);
        const formattedData = Array(12).fill(0);
        data.forEach((order) => {
          formattedData[order._id - 1] = order.count;
        });
        setOrderData(formattedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, [selectedYear]);

  useEffect(() => {
    const fetchFinancialStats = async () => {
      try {
        const { data } = await api.get("/admin/financial-stats");
        setFinancialStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFinancialStats();
  }, []);

  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        const { data } = await api.get("/admin/new-users");
        setNewUsersCount(data.newUsers);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNewUsers();
  }, []);

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const { data } = await api.get("/admin/top-products");
        setBestSellingProducts(data.length > 0 ? data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBestSellingProducts();
  }, []);

  const handleYearChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setSelectedYear(selectedDate.getFullYear());
  };

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: `Monthly Orders for ${selectedYear}`,
        data: orderData,
        fill: false,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        hoverBackgroundColor: "rgba(54, 162, 235, 0.4)",
        hoverBorderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14, weight: "bold" },
          color: "#333",
        },
      },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#ddd",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
      title: {
        display: true,
        text: `Monthly Orders for ${selectedYear}`,
        font: { size: 20, weight: "bold" },
        color: "#333",
        padding: { top: 10, bottom: 30 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12, weight: "bold" }, color: "#333" },
      },
      y: {
        grid: { borderColor: "#ddd", borderWidth: 1 },
        ticks: { font: { size: 12, weight: "bold" }, color: "#333" },
        suggestedMin: 0,
      },
    },
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="p-4 md:ml-64">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Cards */}
        <DashboardCard
          icon={<FaShoppingBag />}
          label="Total Products"
          value={stats.products}
        />
        <DashboardCard
          icon={<TbCategoryFilled />}
          label="Total Categories"
          value={stats.categories}
        />
        <DashboardCard
          icon={<FaBoxes />}
          label="Total Orders"
          value={stats.orders}
        />
        <DashboardCard
          icon={<FaUser />}
          label="Total Users"
          value={stats.users}
        />
        <DashboardCard
          icon={<FaMoneyCheckAlt />}
          label="Total Revenue"
          value={`${financialStats.totalRevenue.toFixed(2)} TND`}
        />
        <DashboardCard
          icon={<GrMoney />}
          label="Avg Order Value"
          value={`${financialStats.averageOrderValue.toFixed(2)} TND`}
        />
        <DashboardCard
          icon={<GrUserNew />}
          label="New Users (Last 30 Days)"
          value={newUsersCount}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 relative h-[600px] flex flex-col">
          <label
            htmlFor="yearSelect"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4"
          >
            Select Year:
          </label>
          <input
            type="number"
            id="yearSelect"
            className="mt-2 block w-full py-2 px-3 bg-white text-base border rounded-md shadow-sm focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            value={selectedYear}
            onChange={handleYearChange}
            min="2000"
            max={new Date().getFullYear() + 5}
          />
          <div className="flex-1">
            <Line data={data} options={options} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-center mb-4">
            Bestselling Products
          </h3>
          {bestSellingProducts.length > 0 ? (
            <Slider {...settings}>
              {bestSellingProducts.map((product, index) => (
                <div key={index} className="text-center">
                  <img
                    src={product.imagePath[0]}
                    alt={product.productName}
                    className="w-full h-auto mb-4 rounded-md"
                  />
                  <p className="font-medium">Name: {product.productName}</p>
                  <p>Price: {product.finalPrice} TND</p>
                  <p>Stock: {product.realStock}</p>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-gray-500">
              No best-selling product available
            </p>
          )}
        </div>
      </div>
        <MonthlyRevenueChart/>
    </div>
  );
}

function DashboardCard({ icon, label, value }) {
  return (
    <div className="flex flex-col bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm rounded-xl p-4 md:p-5 transition-shadow duration-300 ease-in-out hover:shadow-lg">
      <div className="flex items-center gap-x-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-300 dark:bg-gray-500 text-white dark:text-orange-300">
          {icon}
        </div>
        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
            {label}
          </p>
          <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}
