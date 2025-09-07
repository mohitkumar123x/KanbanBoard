import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createTask, updateTask } from '../store/taskSlice';
import './TaskForm.css';

const TaskForm = ({ boardId, task: editTask = null }) => {
  const dispatch = useDispatch();
  
  const [task, setTask] = useState({
    title: editTask?.title || '',
    description: editTask?.description || '',
    column: editTask?.column || 'To Do',
    priority: editTask?.priority || 'Medium',
  });
  const tenantId = useSelector((state) => state.auth.tenantId); // Assume auth slice for tenant
  const error = useSelector((state) => state.task.error);

  // Handle form submission (optimized with useCallback to prevent re-creation)
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const taskData = { ...task, boardId, tenantId };
    if (editTask) {
      dispatch(updateTask({ taskId: editTask._id, ...taskData }));
    } else {
      dispatch(createTask(taskData));
    }
    setTask({ title: '', description: '', column: 'To Do', priority: 'Medium' }); // Reset for new task
  }, [dispatch, editTask, task, boardId, tenantId]);

  return (
    <form onSubmit={handleSubmit} className="task-form bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Task title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue-500"
        />
        <select
          value={task.column}
          onChange={(e) => setTask({ ...task, column: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue-500"
        >
          {['To Do', 'In Progress', 'Done'].map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
        <select
          value={task.priority}
          onChange={(e) => setTask({ ...task, priority: e.target.value })}
          className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-neon-blue-500"
        >
          {['Low', 'Medium', 'High'].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="mt-4 px-6 py-3 bg-gradient-to-r from-neon-blue-500 to-purple-500 rounded-lg text-lg hover:from-neon-blue-600 hover:to-purple-600 transition"
      >
        {editTask ? 'Update Task' : 'Create Task'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default TaskForm;