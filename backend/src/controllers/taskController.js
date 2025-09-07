const Task = require('../models/Task');
const logger = require('../config/logger');

exports.createTask = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description, column, priority } = req.body;
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;
   console.log("jfvk--",userId)
    if (!title) {
      logger.error('Create task failed: Missing title');
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = new Task({
      tenantId,
      boardId,
      userId,
      title,
      description,
      column,
      priority,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await task.save();
    logger.info(`Task created for board ${boardId} column ${column} priority ${priority}, tenant ${tenantId}`);
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    logger.error(`Error creating task: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTasksByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const tenantId = req.user.tenantId;

    const tasks = await Task.find({ boardId, tenantId });
    logger.info(`Fetched tasks for board ${boardId}, tenant ${tenantId}`);
    res.status(200).json(tasks);
  } catch (error) {
    logger.error(`Error fetching tasks: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { boardId, taskId } = req.params;
    const { title, description, column, priority } = req.body;
    const tenantId = req.user.tenantId;

    if (!title) {
      logger.error(`Update task failed: Missing title for task ${taskId}`);
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, boardId, tenantId },
      { title, description, column, priority, updatedAt: new Date() },
      { new: true }
    );

    if (!task) {
      logger.error(`Update task failed: Task ${taskId} not found for board ${boardId}, tenant ${tenantId}`);
      return res.status(404).json({ error: 'Task not found' });
    }

    logger.info(`Task ${taskId} updated for board ${boardId}, tenant ${tenantId}`);
    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    logger.error(`Error updating task ${taskId}: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { boardId, taskId } = req.params;
    const tenantId = req.user.tenantId;

    const task = await Task.findOneAndDelete({ _id: taskId, boardId, tenantId });
    if (!task) {
      logger.error(`Delete task failed: Task ${taskId} not found for board ${boardId}, tenant ${tenantId}`);
      return res.status(404).json({ error: 'Task not found' });
    }

    logger.info(`Task ${taskId} deleted from board ${boardId}, tenant ${tenantId}`);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting task ${taskId}: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};