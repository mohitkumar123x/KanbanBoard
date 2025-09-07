import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../../services/api';
import logger from '../../services/logger';

// Async thunk to create a task
export const createTask = createAsyncThunk('task/createTask', async (taskData, { rejectWithValue }) => {
  try {
    const response = await api.post(`/boards/${taskData.boardId}/tasks`, taskData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    logger.info(`Task created for board ${taskData.boardId}`);
    return response.data.task;
  } catch (error) {
    logger.error(`Error creating task: ${error.message}`);
    return rejectWithValue(error.response?.data?.error || 'Failed to create task');
  }
});

// Async thunk to update a task
export const updateTask = createAsyncThunk('task/updateTask', async ({ taskId, ...taskData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/boards/${taskData.boardId}/tasks/${taskId}`, taskData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    logger.info(`Task ${taskId} updated for board ${taskData.boardId}`);
    return response.data.task;
  } catch (error) {
    logger.error(`Error updating task ${taskId}: ${error.message}`);
    return rejectWithValue(error.response?.data?.error || 'Failed to update task');
  }
});

// Async thunk to delete a task
export const deleteTask = createAsyncThunk('task/deleteTask', async ({ taskId, boardId }, { rejectWithValue }) => {
  try {
    await api.delete(`/boards/${boardId}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    logger.info(`Task ${taskId} deleted from board ${boardId}`);
    return { taskId, boardId };
  } catch (error) {
    logger.error(`Error deleting task ${taskId}: ${error.message}`);
    return rejectWithValue(error.response?.data?.error || 'Failed to delete task');
  }
});

// Task slice for state management
const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: {},
    error: '',
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => { state.loading = true; state.error = ''; })
      .addCase(createTask.fulfilled, (state, action) => {
        const { boardId, column } = action.payload;
        state.tasks[boardId] = { ...state.tasks[boardId], [column]: [...(state.tasks[boardId]?.[column] || []), action.payload] };
        state.loading = false;
      })
      .addCase(createTask.rejected, (state, action) => { state.error = action.payload; state.loading = false; })
      .addCase(updateTask.fulfilled, (state, action) => {
        const { boardId, column } = action.payload;
        state.tasks[boardId] = { ...state.tasks[boardId], [column]: state.tasks[boardId][column].map(t => t._id === action.payload._id ? action.payload : t) };
      })
      .addCase(updateTask.rejected, (state, action) => { state.error = action.payload; })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const { taskId, boardId } = action.payload;
        Object.keys(state.tasks[boardId] || {}).forEach(column => {
          state.tasks[boardId][column] = state.tasks[boardId][column].filter(t => t._id !== taskId);
        });
      })
      .addCase(deleteTask.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const fetchTasks = createAsyncThunk('task/fetchTasks', async (boardId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/boards/${boardId}/tasks`, 
    {headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    
    });
    return response.data.reduce((acc,task)=>{acc[task.column]=[...(acc[task.column] || []),task]},{});
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
  }
});


// Selector to filter tasks by column (optimized with memoization)
export const selectTasksByColumn = createSelector(
  [(state) => state.task.tasks, (state, column) => column],
  (tasks, column) => (boardId) => tasks[boardId]?.[column] || []
);

export default taskSlice.reducer;