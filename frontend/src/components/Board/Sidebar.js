// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';

// // Register all necessary scales and elements
// Chart.register(...registerables);

// const Sidebar = ({ searchTerm, setSearchTerm }) => {
//   const chartData = {
//     labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
//     datasets: [{
//       label: 'Tasks Remaining',
//       data: [10, 8, 6, 3, 0],
//       borderColor: 'rgba(0, 255, 255, 0.8)',
//       backgroundColor: 'rgba(0, 255, 255, 0.2)',
//       fill: true,
//     }],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         type: 'category', // Explicitly set to category for labels
//       },
//       y: {
//         type: 'linear',   // Explicitly set to linear for numeric data
//       },
//     },
//   };

//   return (
//     <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-800 bg-opacity-90 backdrop-blur-md p-4 shadow-lg z-10">
//       <h2 className="text-2xl font-bold text-neon-blue-500 mb-4">Board Menu</h2>
//       <input
//         type="text"
//         placeholder="Search tasks..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full p-2 mb-4 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-neon-blue-500"
//       />
//       <h3 className="text-lg font-semibold text-purple-400">Analytics</h3>
//       <div className="mt-2 h-32">
//         <Line data={chartData} options={chartOptions} />
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;




import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm } from '../Store/BoardSlice';

const Sidebar = () => {
  const searchTerm = useSelector((state) => state.board.searchTerm);
  const dispatch = useDispatch();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-800 bg-opacity-90 backdrop-blur-md p-4 shadow-lg z-10">
      <h2 className="text-2xl font-bold text-neon-blue-500 mb-4">Board Menu</h2>
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        className="w-full p-2 mb-4 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-neon-blue-500"
      />
    </aside>
  );
};

export default Sidebar;