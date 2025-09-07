const Board = require('../models/Board');
const logger = require('../config/logger');

exports.getUserBoards = async (req, res) => {
  try {
    const userId = req.user.userId;
    const boards = await Board.find({ userId });
    logger.info(`Fetched boards for user ${userId}`);
    res.status(200).json(boards);
  } catch (error) {
    logger.error(`Error fetching boards: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createBoard = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const userId = req.user.userId;
    const tenantId = req.user.tenantId; // Assume tenantId from JWT

    
    if (!title) {
      logger.error('Create board failed: Missing title');
      return res.status(400).json({ error: 'Title is required' });
    }

    const board = new Board({
      tenantId,
      userId,
      title,
      description,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await board.save();
    logger.info(`Board created: ${title} for user ${userId}`);
    res.status(201).json({ message: 'Board created successfully', board });
  } catch (error) {
    logger.error(`Error creating board: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description, tags } = req.body;
    const userId = req.user.userId;

    if (!title) {
      logger.error('Update board failed: Missing title');
      return res.status(400).json({ error: 'Title is required' });
    }

    const board = await Board.findOneAndUpdate(
      { _id: boardId, userId },
      { title, description, tags, updatedAt: new Date() },
      { new: true }
    );

    if (!board) {
      logger.error(`Update board failed: Board ${boardId} not found for user ${userId}`);
      return res.status(404).json({ error: 'Board not found' });
    }

    logger.info(`Board updated: ${boardId} for user ${userId}`);
    res.status(200).json({ message: 'Board updated successfully', board });
  } catch (error) {
    logger.error(`Error updating board: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.user.userId;

    const board = await Board.findOneAndDelete({ _id: boardId, userId });
    if (!board) {
      logger.error(`Delete board failed: Board ${boardId} not found for user ${userId}`);
      return res.status(404).json({ error: 'Board not found' });
    }

    logger.info(`Board deleted: ${boardId} for user ${userId}`);
    res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting board: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

//tenant
// exports.deleteBoard = async (req, res) => {
//   try {
//     const { boardId } = req.params;
//     const tenantId = req.user.tenantId;
//     const userId = req.user.userId;
//     const role = req.user.role;

//     if (role !== 'admin') {
//       logger.error(`Delete board failed: Insufficient permissions for user ${userId}`);
//       return res.status(403).json({ error: 'Admin access required' });
//     }

//     const board = await Board.findOneAndDelete({ _id: boardId, tenantId, userId });
//     if (!board) {
//       logger.error(`Delete board failed: Board ${boardId} not found for tenant ${tenantId}, user ${userId}`);
//       return res.status(404).json({ error: 'Board not found' });
//     }

//     logger.info(`Board deleted: ${boardId} for tenant ${tenantId}, user ${userId}`);
//     res.status(200).json({ message: 'Board deleted successfully' });
//   } catch (error) {
//     logger.error(`Error deleting board: ${error.message}`);
//     res.status(500).json({ error: 'Server error' });
//   }
// };
// Fetch a single board by ID for the authenticated user
// LLD: Simple MongoDB query with security check for ownership
// HLD: Scalable with indexing on _id and userId for fast lookups; low latency as it's a direct findOne operation
exports.getBoardById = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.user.userId;

    // Find the board ensuring it belongs to the authenticated user
    const board = await Board.findOne({ _id: boardId, userId });

    if (!board) {
      logger.error(`Board fetch failed: Board ${boardId} not found for user ${userId}`);
      return res.status(404).json({ error: 'Board not found' });
    }

    logger.info(`Fetched board ${boardId} for user ${userId}`);
    res.status(200).json(board);
  } catch (error) {
    logger.error(`Error fetching board: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
};

// with tanent id
// exports.getBoardById = async (req, res) => {
//   try {
//     const { boardId } = req.params;
//     const tenantId = req.user.tenantId; // Assume tenantId from JWT
//     const userId = req.user.userId;

//     // Fetch board with tenant and user validation for security
//     const board = await Board.findOne({ _id: boardId, tenantId, userId });

//     if (!board) {
//       logger.error(`Board fetch failed: Board ${boardId} not found for tenant ${tenantId}, user ${userId}`);
//       return res.status(404).json({ error: 'Board not found' });
//     }

//     logger.info(`Fetched board ${boardId} for tenant ${tenantId}, user ${userId}`);
//     res.status(200).json(board);
//   } catch (error) {
//     logger.error(`Error fetching board: ${error.message}`);
//     res.status(500).json({ error: 'Server error' });
//   }
// };