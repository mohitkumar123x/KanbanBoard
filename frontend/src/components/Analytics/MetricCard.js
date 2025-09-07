import React from 'react';

const MetricCard = ({ title, value }) => {
  return (
    <div className="bg-gray-800 bg-opacity-80 backdrop-blur-md p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-neon-blue-500">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default MetricCard;