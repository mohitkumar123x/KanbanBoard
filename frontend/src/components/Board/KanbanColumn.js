// import React from 'react';
// import { Droppable } from 'react-beautiful-dnd';
// import TaskCard from './TaskCard';

// const KanbanColumn = ({ column, tasks, isCollapsed, toggleCollapse }) => {
//   return (
//     <div className="min-w-[300px] bg-gray-800 bg-opacity-80 backdrop-blur-md p-4 rounded-lg shadow-lg">
//       <div
//         className="flex justify-between items-center mb-4 cursor-pointer"
//         onClick={toggleCollapse}
//       >
//         <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue-500 to-purple-500">
//           {column} ({tasks.length})
//         </h2>
//         <span>{isCollapsed ? '▲' : '▼'}</span>
//       </div>
//       {!isCollapsed && (
//         <Droppable droppableId={column}>
//           {(provided) => (
//             <div
//               ref={provided.innerRef}
//               {...provided.droppableProps}
//               className="space-y-4 min-h-[200px]"
//             >
//               {tasks.map((task, index) => (
//                 <TaskCard key={task._id} task={task} index={index} />
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       )}
//     </div>
//   );
// };

// export default KanbanColumn;



// import React from 'react';
// import { Droppable } from 'react-beautiful-dnd';
// import TaskCard from './TaskCard';
// import { useSelector,useDispatch } from 'react-redux';
// import { selectFilteredTasks } from '../Store/BoardSlice';

// const KanbanColumn = ({ column }) => {
//   const filteredTasks = useSelector(selectFilteredTasks);
//   const isCollapsed = useSelector((state) => state.board.isCollapsed);
//   const dispatch = useDispatch();

//   const toggleCollapse = () => dispatch({ type: 'board/toggleCollapse', payload: column });

//   return (
//     <div className="min-w-[300px] bg-gray-800 bg-opacity-80 backdrop-blur-md p-4 rounded-lg shadow-lg">
//       <div
//         className="flex justify-between items-center mb-4 cursor-pointer"
//         onClick={toggleCollapse}
//       >
//         <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue-500 to-purple-500">
//           {column} ({filteredTasks[column]?.length || 0})
//         </h2>
//         <span>{isCollapsed[column] ? '▲' : '▼'}</span>
//       </div>
//       {!isCollapsed[column] && (
//         <Droppable droppableId={column}>
//           {(provided) => (
//             <div
//               ref={provided.innerRef}
//               {...provided.droppableProps}
//               className="space-y-4 min-h-[200px]"
//             >
//               {filteredTasks[column]?.map((task, index) => (
//                 <TaskCard key={task._id} task={task} index={index} />
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       )}
//     </div>
//   );
// };

// export default KanbanColumn;

// import React from 'react';
// import { Droppable } from 'react-beautiful-dnd';
// import TaskCard from './TaskCard';
// import { useSelector ,useDispatch } from 'react-redux';
// import { selectTasksByColumn } from '../Store/taskSlice';

// const KanbanColumn = ({ column }) => {
//   const tasks = useSelector((state) => selectTasksByColumn(state, column));
//   const isCollapsed = useSelector((state) => state.board.isCollapsed[column] || false);
//   const dispatch = useDispatch();

//   const toggleCollapse = () => dispatch({ type: 'board/toggleCollapse', payload: column });

//   return (
//     <div className="kanban-column min-w-[300px] md:min-w-[250px] bg-gray-800 p-4 rounded-lg shadow-lg">
//       <div
//         className="flex justify-between items-center mb-4 cursor-pointer"
//         onClick={toggleCollapse}
//       >
//         <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue-500 to-purple-500">
//           {column} ({tasks.length})
//         </h2>
//         <span>{isCollapsed ? '▲' : '▼'}</span>
//       </div>
//       {!isCollapsed && (
//         <Droppable droppableId={column}>
//           {(provided) => (
//             <div
//               ref={provided.innerRef}
//               {...provided.droppableProps}
//               className="space-y-4 min-h-[200px]"
//             >
//               {tasks.map((task, index) => (
//                 <TaskCard key={task._id} task={task} index={index} />
//               ))}
//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       )}
//     </div>
//   );
// };

// export default KanbanColumn;

import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { useSelector ,useDispatch} from 'react-redux';
import { selectTasksByColumn } from '../Store/taskSlice';

const KanbanColumn = ({ column, boardId}) => {
  console.log("col=",column,boardId)
  
  const tasksSelector = useSelector((state) => selectTasksByColumn(state, column));
  const tasks = tasksSelector(boardId); // Call the selector function with boardId
  const isCollapsed = useSelector((state) => state.board.isCollapsed[column] || false);
  const dispatch = useDispatch();

  const toggleCollapse = () => dispatch({ type: 'board/toggleCollapse', payload: column });

  return (
    <div className="kanban-column min-w-[300px] md:min-w-[250px] bg-gray-800 p-4 rounded-lg shadow-lg">
      <div
        className="flex justify-between items-center mb-4 cursor-pointer"
        onClick={toggleCollapse}
      >
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue-500 to-purple-500">
          {column} ({tasks.length})
        </h2>
        <span>{isCollapsed ? '▲' : '▼'}</span>
      </div>

      
      {!isCollapsed && (
        <Droppable droppableId={column}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4 min-h-[200px]"
            >
              {tasks.map((task, index) => (
                <TaskCard key={task._id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

export default KanbanColumn;