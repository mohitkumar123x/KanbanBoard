const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  tenantId: { type: String, required: true }, // Identifies user/organization tenant
  // userId: { type: String, required: true },   // Links to individual user within tenant
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }], // Add tags array
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
// const boardSchema = new mongoose.Schema({
//   tenantId: { type: String, required: true }, // Identifies user/organization tenant
//   userId: { type: String, required: true },   // Links to individual user within tenant
//   title: { type: String, required: true },
//   description: { type: String },
//   tags: [String],
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });
module.exports = mongoose.model('Board', boardSchema);