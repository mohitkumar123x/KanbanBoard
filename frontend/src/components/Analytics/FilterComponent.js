import React from 'react';
import Papa from 'papaparse';

const FilterComponent = ({ filter, setFilter, data }) => {
  const handleExport = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Tasks Completed', data.tasksCompleted],
      ['Tasks Remaining', data.tasksRemaining],
      ['Completion Rate', `${data.completionRate}%`],
      ['Average Task Time', `${data.averageTaskTime} days`],
    ];
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'kanban_analytics.csv';
    link.click();
  };

  return (
    <div className="flex gap-4 mb-6">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-neon-blue-500"
      >
        <option value="last7days">Last 7 Days</option>
        <option value="last30days">Last 30 Days</option>
        <option value="all">All Time</option>
      </select>
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-gradient-to-r from-neon-blue-500 to-purple-500 rounded hover:from-neon-blue-600 hover:to-purple-600 transition"
      >
        Export CSV
      </button>
    </div>
  );
};

export default FilterComponent;