import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../../services/api';
import logger from '../../services/logger';

// Async thunk for fetching board (optimized with error handling and logging)
export const fetchBoard = createAsyncThunk('board/fetchBoard', async (boardId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/boards/${boardId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    logger.info(`Fetched board ${boardId}`);
    return response.data;
  } catch (err) {
    logger.error(`Error fetching board ${boardId}: ${err.message}`);
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch board');
  }
});

// Async thunk for adding task (with optimistic update for low latency)
export const addTask = createAsyncThunk('board/addTask', async ({ boardId, task }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/boards/${boardId}/tasks`, {
      ...task,
      boardId,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

    console.log(response)
    logger.info(`Task added to board ${boardId}`);
    return response.data.task;
  } catch (err) {
    logger.error(`Error adding task: ${err.message}`);
    return rejectWithValue(err.response?.data?.error || 'Failed to add task');
  }
});

// Async thunk for moving task (with optimistic update for instant UI response)
export const onDragEnd = createAsyncThunk('board/onDragEnd', async ({ boardId, taskId, column, index }, { rejectWithValue }) => {
  try {
    await api.put(`/boards/${boardId}/tasks/${taskId}`, {
      column,
      index
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    logger.info(`Moved task ${taskId} to ${column} on board ${boardId}`);
    return { taskId, column, index };
  } catch (err) {
    logger.error(`Error updating task ${taskId}: ${err.message}`);
    return rejectWithValue(err.response?.data?.error || 'Failed to update task position');
  }
});

// const boardSlice = createSlice({
//   name: 'board',
//   initialState: {
//     board: { title: '', description: '', tags: [], columns: [] },
//     tasks: {},
//     newTask: { title: '', description: '', column: 'To Do' },
//     error: '',
//     loading: false,
//     isCollapsed: {},
//     searchTerm: '',
//   },
//   reducers: {
//     setNewTask: (state, action) => {
//       state.newTask = action.payload;
//     },
//     setSearchTerm: (state, action) => {
//       state.searchTerm = action.payload;
//     },
//     toggleCollapse: (state, action) => {
//       const column = action.payload;
//       state.isCollapsed[column] = !state.isCollapsed[column];
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchBoard.pending, (state) => {
//         state.loading = true;
//         state.error = '';
//       })
//       .addCase(fetchBoard.fulfilled, (state, action) => {
//         state.board = action.payload;
//         state.tasks = action.payload.columns.reduce((acc, col) => ({ ...acc, [col.name]: col.tasks }), {});
//         state.loading = false;
//       })
//       .addCase(fetchBoard.rejected, (state, action) => {
//         state.error = action.payload;
//         state.loading = false;
//       })
//       .addCase(addTask.fulfilled, (state, action) => {
//         const task = action.payload;
//         state.tasks[task.column] = [...(state.tasks[task.column] || []), task];
//         state.newTask = { title: '', description: '', column: 'To Do' };
//       })
//       .addCase(addTask.rejected, (state, action) => {
//         state.error = action.payload;
//       })
//       .addCase(onDragEnd.fulfilled, (state, action) => {
//         // Optimistic update already handled in component; this confirms
//         state.error = '';
//       })
//       .addCase(onDragEnd.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   },
// });

const initialState = {
    board: { title: "", description: "", tags: [], columns: [] },
    tasks: {},
    newTask: { title: "", description: "", column: "To Do" },
    error: "",
    loading: false,
    isCollapsed: {},
    searchTerm: "",
  };

const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
      setNewTask: (state, action) => {
        state.newTask = action.payload;
      },
      setSearchTerm: (state, action) => {
        state.searchTerm = action.payload;
      },
      toggleCollapse: (state, action) => {
        const column = action.payload;
        state.isCollapsed[column] = !state.isCollapsed[column];
      },
    },
    extraReducers: (builder) => {
      builder
        // fetchBoard
        .addCase(fetchBoard.pending, (state) => {
          state.loading = true;
          state.error = "";
        })
        .addCase(fetchBoard.fulfilled, (state, action) => {
          // Ensure payload is normalized
          const payload = action.payload?.board ?? action.payload ?? {};
  
          state.board = {
            title: payload.title ?? "",
            description: payload.description ?? "",
            tags: payload.tags ?? [],
            columns: payload.columns ?? [],
          };
  
          // Build tasks object safely
          const columns = Array.isArray(payload.columns) ? payload.columns : [];
          state.tasks = columns.reduce(
            (acc, col) => ({
              ...acc,
              [col.name]: Array.isArray(col.tasks) ? col.tasks : [],
            }),
            {}
          );
  
          state.loading = false;
        })
        .addCase(fetchBoard.rejected, (state, action) => {
          state.error = action.payload || "Failed to fetch board";
          state.loading = false;
        })
  
        // addTask
        .addCase(addTask.fulfilled, (state, action) => {
          const task = action.payload;
          if (!state.tasks[task.column]) {
            state.tasks[task.column] = [];
          }
          state.tasks[task.column] = [...state.tasks[task.column], task];
          state.newTask = { title: "", description: "", column: "To Do" };
        })
        .addCase(addTask.rejected, (state, action) => {
          state.error = action.payload || "Failed to add task";
        })
  
        // onDragEnd
        .addCase(onDragEnd.fulfilled, (state) => {
          // Optimistic update already handled in component; this confirms
          state.error = "";
        })
        .addCase(onDragEnd.rejected, (state, action) => {
          state.error = action.payload || "Failed to move task";
        });
    },
  });

  
// Selectors for optimized access (memoized for performance)
export const selectFilteredTasks = createSelector(
  (state) => state.board.tasks,
  (state) => state.board.searchTerm,
  (tasks, searchTerm) => Object.fromEntries(
    Object.entries(tasks).map(([column, tasksList]) => [
      column,
      tasksList.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ])
  )
);

export const { setNewTask, setSearchTerm, toggleCollapse } = boardSlice.actions;

export default boardSlice.reducer;