// import React from 'react';

// const TaskForm = ({ newTask, setNewTask, handleAddTask, error }) => {
//   return (
//     <form onSubmit={handleAddTask} className="mb-6 bg-gray-800 bg-opacity-80 backdrop-blur-md p-4 rounded-lg shadow-lg">
//       <div className="flex gap-4">
//         <input
//           type="text"
//           placeholder="Task title"
//           value={newTask.title}
//           onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
//           className="flex-1 p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-neon-blue-500"
//         />
//         <input
//           type="text"
//           placeholder="Description (optional)"
//           value={newTask.description}
//           onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
//           className="flex-1 p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-neon-blue-500"
//         />
//         <select
//           value={newTask.column}
//           onChange={(e) => setNewTask({ ...newTask, column: e.target.value })}
//           className="p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-neon-blue-500"
//         >
//           {['To Do', 'In Progress', 'Done'].map((col) => (
//             <option key={col} value={col}>{col}</option>
//           ))}
//         </select>
//         <button
//           type="submit"
//           className="px-4 py-2 bg-gradient-to-r from-neon-blue-500 to-purple-500 rounded hover:from-neon-blue-600 hover:to-purple-600 transition"
//         >
//           Add Task
//         </button>
//       </div>
//       {error && <p className="text-red-500 mt-2">{error}</p>}
//     </form>
//   );
// };

// export default TaskForm;



import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNewTask, addTask } from '../Store/BoardSlice';

const TaskForm = ({ boardId }) => {
  const newTask = useSelector((state) => state.board.newTask);
  const error = useSelector((state) => state.board.error);
  const dispatch = useDispatch();

  const handleAddTask = (e) => {
    e.preventDefault();
    dispatch(addTask({ boardId, task: newTask }));
  };

  return (
    <form onSubmit={handleAddTask} className="mb-6 bg-gray-800 bg-opacity-80 backdrop-blur-md p-4 rounded-lg shadow-lg">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => dispatch(setNewTask({ ...newTask, title: e.target.value }))}
          className="flex-1 p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-neon-blue-500"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={newTask.description}
          onChange={(e) => dispatch(setNewTask({ ...newTask, description: e.target.value }))}
          className="flex-1 p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-neon-blue-500"
        />
        <select
          value={newTask.column}
          onChange={(e) => dispatch(setNewTask({ ...newTask, column: e.target.value }))}
          className="p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-neon-blue-500"
        >
          {['To Do', 'In Progress', 'Done'].map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-neon-blue-500 to-purple-500 rounded hover:from-neon-blue-600 hover:to-purple-600 transition"
        >
          Add Task
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default TaskForm;