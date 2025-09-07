
const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   status: { type: String, enum: ['todo', 'inProgress', 'done'], default: 'todo' },
//   priority: { type: Number, default: 0 },
//   boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
// });

// module.exports = mongoose.model('Task', taskSchema);


//with tenent
const taskSchema = new mongoose.Schema({
  tenantId: { type: String, required: true }, // Multi-tenant support
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  userId: { type: String, required: true },   // Creator of the task
  title: { type: String, required: true },
  description: { type: String },
  column: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);