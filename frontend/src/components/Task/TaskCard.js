// const TaskCard = ({ task }) => {
//     return (
//       <div className="bg-gray-100 p-3 mb-2 rounded border border-gray-300">
//         <h3 className="font-medium">{task.title}</h3>
//         <p className="text-sm text-gray-600">{task.description}</p>
//         <p className="text-xs text-gray-500">Priority: {task.priority}</p>
//       </div>
//     );
//   };
  
//   export default TaskCard;


import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask } from '../store/taskSlice';
import './TaskCard.css';

const TaskCard = ({ task, index }) => {
  const dispatch = useDispatch();

  const handleDelete = () => dispatch(deleteTask({ taskId: task._id, boardId: task.boardId }));
  const handleUpdate = () => {
    // Trigger edit mode (e.g., open modal with TaskForm)
    // Placeholder: Implement modal logic
    console.log('Edit task', task._id);
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="task-card bg-gray-700 p-3 rounded-lg shadow-md mb-2 cursor-move"
        >
          <h4 className="text-lg font-semibold text-white">{task.title}</h4>
          <p className="text-sm text-gray-300">{task.description || 'No description'}</p>
          <p className="text-xs text-gray-400">Priority: {task.priority}</p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleUpdate}
              className="px-2 py-1 bg-blue-500 rounded text-white text-sm hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-2 py-1 bg-red-500 rounded text-white text-sm hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;