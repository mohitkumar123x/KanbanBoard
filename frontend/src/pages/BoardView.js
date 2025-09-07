// import React, { useState, useEffect, useCallback } from 'react';
// import { DragDropContext } from 'react-beautiful-dnd';
// import { useParams } from 'react-router-dom';
// import api from '../services/api';
// import logger from '../services/logger';

// import Header from '../components/Board/BoardHeader';
// import TaskForm from '../components/Board/TaskForm';
// import KanbanColumn from '../components/Board/KanbanColumn';
// import Sidebar from '../components/Board/Sidebar';
// // import '../components/Board/BoardViewcss.css';

// const BoardView = () => {
//   const { boardId } = useParams();
//   const [board, setBoard] = useState({ title: '', description: '', tags: [], columns: [] });
//   const [tasks, setTasks] = useState({});
//   const [newTask, setNewTask] = useState({ title: '', description: '', column: 'To Do' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [isCollapsed, setIsCollapsed] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchBoard = async () => {
//       try {
//         const response = await api.get(`/boards`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         setBoard(response.data);
//         setTasks(response.data.columns.reduce((acc, col) => ({ ...acc, [col.name]: col.tasks }), {}));
//         logger.info(`Fetched board ${boardId} at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
//       } catch (err) {
//         setError(err.response?.data?.error || 'Failed to fetch board');
//         logger.error(`Error fetching board ${boardId}: ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };
//     // fetchBoard();

//     // Dummy data instead of API call
//     const dummyData = {
//       title: 'Project Nebula',
//       description: 'A futuristic project management board',
//       tags: ['urgent', 'dev', 'design'],
//       columns: [
//         {
//           name: 'To Do',
//           tasks: [
//             { _id: '1', title: 'Design UI', description: 'Create a neon-themed layout', createdAt: new Date() },
//             { _id: '2', title: 'Setup Backend', description: 'Configure Node.js and MongoDB', createdAt: new Date() },
//           ],
//         },
//         {
//           name: 'In Progress',
//           tasks: [
//             { _id: '3', title: 'Implement Drag-Drop', description: 'Add react-beautiful-dnd', createdAt: new Date() },
//           ],
//         },
//         {
//           name: 'Done',
//           tasks: [
//             { _id: '4', title: 'Initialize Project', description: 'Set up React app', createdAt: new Date() },
//           ],
//         },
//       ],
//     };

//     // Simulate API response delay
//     setTimeout(() => {
//       setBoard(dummyData);
//       setTasks(dummyData.columns.reduce((acc, col) => ({ ...acc, [col.name]: col.tasks }), {}));
//       setLoading(false);
//       logger.info(`Loaded dummy data for board ${boardId} at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
//     }, 1000);
//   }, [boardId]);

//   const onDragEnd = useCallback(async (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     const sourceColumn = source.droppableId;
//     const destColumn = destination.droppableId;
//     const taskId = tasks[sourceColumn][source.index]._id;

//     if (sourceColumn === destColumn && source.index === destination.index) return;

//     const updatedTasks = { ...tasks };
//     const [movedTask] = updatedTasks[sourceColumn].splice(source.index, 1);
//     updatedTasks[destColumn].splice(destination.index, 0, movedTask);

//     setTasks(updatedTasks);

//     try {
//       await api.put(`/boards/${boardId}/tasks/${taskId}`, {
//         column: destColumn,
//         index: destination.index
//       }, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       logger.info(`Moved task ${taskId} to ${destColumn} on board ${boardId}`);
//     } catch (err) {
//       setError('Failed to update task position');
//       logger.error(`Error updating task ${taskId}: ${err.message}`);
//     }
//   }, [tasks, boardId]);

//   const handleAddTask = async (e) => {
//     e.preventDefault();
//     if (!newTask.title) {
//       setError('Task title is required');
//       logger.error(' failed: Missing title');
//       return;
//     }
//     try {
//       const response = await api.post(`/boards/${boardId}/tasks`, {
//         ...newTask,
//         boardId,
//       }, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
//       setTasks((prev) => ({
//         ...prev,
//         [newTask.column]: [...(prev[newTask.column] || []), response.data.task]
//       }));
//       setNewTask({ title: '', description: '', column: 'To Do' });
//       setError('');
//       logger.info(`Task added to board ${boardId}`);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to add task');
//       logger.error(`Error adding task: ${err.message}`);
//     }
//   };

//   const toggleCollapse = (column) => {
//     setIsCollapsed((prev) => ({ ...prev, [column]: !prev[column] }));
//   };

//   const filteredTasks = Object.fromEntries(
//     Object.entries(tasks).map(([column, tasksList]) => [
//       column,
//       tasksList.filter((task) =>
//         task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         task.description.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     ])
//   );

//   const columns = ['To Do', 'In Progress', 'Done'];

//   if (loading) return <div className="text-center text-neon-blue-500">Loading board...</div>;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white p-6 relative overflow-hidden">
//       <div className="particles"></div>
//       <Sidebar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//       <div className="ml-64">
//         <Header board={board} />
//         <TaskForm
//           newTask={newTask}
//           setNewTask={setNewTask}
//           handleAddTask={handleAddTask}
//           error={error}
//         />
//         <DragDropContext onDragEnd={onDragEnd}>
//           <div className="flex gap-6 overflow-x-auto pb-6">
//             {columns.map((column) => (
//               <KanbanColumn
//                 key={column}
//                 column={column}
//                 tasks={filteredTasks[column] || []}
//                 isCollapsed={isCollapsed[column] || false}
//                 toggleCollapse={() => toggleCollapse(column)}
//               />
//             ))}
//           </div>
//         </DragDropContext>
//       </div>
//     </div>
//   );
// };

// export default BoardView;

//tenant
// import { useEffect, useCallback } from 'react';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3000');

// // ... (previous imports)

// const BoardView = () => {
//   // ... (previous state and selectors)

//   useEffect(() => {
//     socket.emit('joinRoom', tenantId); // Join tenant room
//     socket.on('taskUpdated', (data) => {
//       if (data.boardId === boardId) dispatch({ type: 'board/taskUpdated', payload: data.task }); // Custom action
//     });

//     return () => socket.disconnect(); // Cleanup
//   }, [dispatch, boardId, tenantId]);

//   const handleDragEnd = useCallback((result) => {
//     // ... (previous logic)
//     socket.emit('taskUpdate', { boardId, task: { _id: taskId, column: destColumn, index: destination.index } });
//     dispatch(moveTask({ boardId, taskId, column: destColumn, index: destination.index }));
//   }, [dispatch, boardId, filteredTasks]);

//   // ... (rest of the component)
// };



import React, { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoard, onDragEnd } from '../components/Store/BoardSlice';
import { selectFilteredTasks } from '../components/Store/BoardSlice';

import Header from '../components/Board/BoardHeader';
import TaskForm from '../components/Board/TaskForm';
import KanbanColumn from '../components/Board/KanbanColumn';
import Sidebar from '../components/Board/Sidebar';
// import '../components/Board/Boardviewcss.css';


const BoardView = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const board = useSelector((state) => state.board.board);
  const loading = useSelector((state) => state.board.loading);
  const error = useSelector((state) => state.board.error);
  const isCollapsed = useSelector((state) => state.board.isCollapsed);
  const filteredTasks = useSelector(selectFilteredTasks); // Memoized selector for optimized filtering

  const columns = ['To Do', 'In Progress', 'Done'];

  useEffect(() => {
    
    dispatch(fetchBoard(boardId));
  }, [dispatch, boardId]);

  const handleDragEnd = (result) => {

    dispatch(onDragEnd({ boardId, result }));
  };

  if (loading) return <div className="text-center text-neon-blue-500">Loading board...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white p-6 relative overflow-hidden">
      <div className="particles"></div>
      <Sidebar />
      <div className="ml-64">
        <Header board={board} />
        <TaskForm boardId={boardId} />
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map((column) => (
              <KanbanColumn
                boardId={boardId}
                key={column}
                column={column}
                tasks={filteredTasks[column] || []}
                isCollapsed={isCollapsed[column] || false}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default BoardView;