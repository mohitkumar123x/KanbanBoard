
const mongoose = require('mongoose');
const Task = require('../../backend/src/models/Task');

const seedData = async () => {
  await mongoose.connect('mongodb://localhost:27017/kanban');
  await Task.deleteMany({});

  const tasks = [
    { title: 'Task 1', description: 'First task', status: 'todo', priority: 1 },
    { title: 'Task 2', description: 'Second task', status: 'inProgress', priority: 2 },
    { title: 'Task 3', description: 'Third task', status: 'done', priority: 3 },
  ];

  await Task.insertMany(tasks);
  console.log('Database seeded');
  mongoose.connection.close();
};

seedData();