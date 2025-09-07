import React from 'react';
import { Pie } from 'react-chartjs-2';

const TaskDistributionChart = ({ data }) => {
  const options = {
    responsive: true,
  };

  return (
    <div className="bg-gray-800 bg-opacity-80 backdrop-blur-md p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-neon-blue-500 mb-4">Task Distribution</h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default TaskDistributionChart;