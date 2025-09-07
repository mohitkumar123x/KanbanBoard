import React from 'react';
import TaskForm from './TaskForm';
import { useDispatch } from 'react-redux';
import { closeModal } from '../store/uiSlice'; // Assume UI slice for modal state

const TaskModal = ({ task }) => {
  const dispatch = useDispatch();

  const handleClose = () => dispatch(closeModal());

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="modal-content bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <button onClick={handleClose} className="float-right text-white">&times;</button>
        <TaskForm task={task} boardId={task?.boardId} />
      </div>
    </div>
  );
};

export default TaskModal;