import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


const DeviceChart = ({ data, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-gray-200 rounded-lg">
        <p className="text-gray-500">No device data available</p>
      </div>
    );
  }

  const colors = {
    DESKTOP: '#3b82f6',
    MOBILE: '#10b981',
    TABLET: '#f59e0b',
    BOT: '#8b5cf6',
    OTHER: '#6b7280'
  };

  const chartData = {
    labels: data.map(item => item.deviceType),
    datasets: [
      {
        data: data.map(item => item.clicks),
        backgroundColor: data.map(item => colors[item.deviceType] || colors.OTHER),
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default DeviceChart;
