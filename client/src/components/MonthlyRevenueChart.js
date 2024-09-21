// src/components/MonthlyRevenueChart.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';
import api from '../config/axiosConfig';
import { FaChartLine } from 'react-icons/fa';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const MonthlyRevenueChart = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const { data } = await api.get(`/admin/monthly-revenue/${selectedYear}`);
        const formattedData = Array(12).fill(0);
        data.forEach((item) => {
          formattedData[item._id - 1] = item.totalRevenue;
        });
        setMonthlyRevenue(formattedData);
      } catch (error) {
        console.error('Error fetching monthly revenue data:', error);
      }
    };
    fetchMonthlyRevenue();
  }, [selectedYear]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const data = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    datasets: [
      {
        label: `Monthly Revenue for ${selectedYear}`,
        data: monthlyRevenue,
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
            return `${context.dataset.label}: ${context.raw.toFixed(2)} TND`;
          },
        },
      },
      title: {
        display: true,
        text: `Monthly Revenue Comparison`,
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
        callback: function (value) {
          return `${value} TND`;
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <FaChartLine className="mr-2 text-blue-500" /> Monthly Revenue
        </h2>
        <div>
          <label
            htmlFor="yearSelect"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Select Year:
          </label>
          <input
            type="number"
            id="yearSelect"
            className="mt-2 block w-full py-2 px-3 bg-gray-100 text-base border rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            value={selectedYear}
            onChange={handleYearChange}
            min="2000"
            max={new Date().getFullYear() + 5}
          />
        </div>
      </div>
      <div className="h-[400px] mt-4">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default MonthlyRevenueChart;
