import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TaskCard = ({ task, index }) => {
  console.log("taskks==",task)
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-gray-700 bg-opacity-80 backdrop-blur-sm p-3 rounded-lg shadow-md hover:bg-gray-600 transition cursor-pointer"
          onClick={() => alert(`Task: ${task.title}\n${task.description}`)} // Placeholder for modal
        >
          <h3 className="font-medium text-white">{task.title}</h3>
          <p className="text-sm text-gray-300">{task.description}</p>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;