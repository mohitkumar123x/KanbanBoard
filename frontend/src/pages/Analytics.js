import React, { useState, useEffect } from 'react';

import FilterComponent from '../components/Analytics/FilterComponent';
import MetricCard from '../components/Analytics/MetricCard';
import BurndownChart from '../components/Analytics/BurnDownChart';
import TaskDistributionChart from '../components/Analytics/TaskDidtributionChart';
import VelocityChart from '../components/Analytics/VelocityChart';

import api from '../services/api';
import logger from '../services/logger';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    tasksCompleted: 0,
    tasksRemaining: 0,
    completionRate: 0,
    averageTaskTime: 0,
    burndownData: { labels: [], datasets: [] },
    taskDistribution: { labels: [], datasets: [] },
    velocityData: { labels: [], datasets: [] },
  });
  const [filter, setFilter] = useState('last7days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await api.get('/analytics', {
          params: { filter },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAnalyticsData(response.data);
        logger.info(`Fetched analytics data for ${filter}`);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch analytics');
        logger.error(`Error fetching analytics: ${err.message}`);
        // Fallback to dummy data
        setAnalyticsData(getDummyAnalytics(filter));
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [filter]);

  const getDummyAnalytics = (filter) => {
    const baseData = {
      tasksCompleted: 15,
      tasksRemaining: 10,
      completionRate: 60,
      averageTaskTime: 3.5,
      burndownData: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        datasets: [{
          label: 'Tasks Remaining',
          data: [25, 20, 15, 10, 8, 5, 0],
          borderColor: 'rgba(0, 255, 255, 0.8)',
          backgroundColor: 'rgba(0, 255, 255, 0.2)',
          fill: true,
        }],
      },
      taskDistribution: {
        labels: ['To Do', 'In Progress', 'Done'],
        datasets: [{
          data: [10, 5, 15],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }],
      },
      velocityData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Tasks Completed',
          data: [5, 8, 6, 10],
          borderColor: 'rgba(255, 206, 86, 0.8)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          fill: true,
        }],
      },
    };
    // Adjust dummy data based on filter (simulated)
    if (filter === 'last30days') {
      baseData.burndownData.labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
      baseData.burndownData.datasets[0].data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 50));
    }
    return baseData;
  };

  if (loading) return <div className="text-center text-neon-blue-500">Loading analytics...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white p-6">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue-500 to-purple-500 mb-6">
        Analytics Dashboard
      </h1>
      <FilterComponent filter={filter} setFilter={setFilter} data={analyticsData} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Tasks Completed" value={analyticsData.tasksCompleted} />
        <MetricCard title="Tasks Remaining" value={analyticsData.tasksRemaining} />
        <MetricCard title="Completion Rate" value={`${analyticsData.completionRate}%`} />
        <MetricCard title="Avg Task Time" value={`${analyticsData.averageTaskTime} days`} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BurndownChart data={analyticsData.burndownData} />
        <TaskDistributionChart data={analyticsData.taskDistribution} />
        <VelocityChart data={analyticsData.velocityData} />
      </div>
    </div>
  );
};

export default Analytics;