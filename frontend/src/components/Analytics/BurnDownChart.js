import React from 'react';
import { Line } from 'react-chartjs-2';

const BurndownChart = ({ data }) => {
  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
      },
      y: {
        type: 'linear',
      },
    },
  };

  return (
    <div className="bg-gray-800 bg-opacity-80 backdrop-blur-md p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-neon-blue-500 mb-4">Burndown Chart</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default BurndownChart;