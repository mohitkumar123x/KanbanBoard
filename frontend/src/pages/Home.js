// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// //import logger from '../services/logger';
 
// const Home = () => {
//   // Mock board data (replace with API call when backend is running)
//   const [boards, setBoards] = useState([
//     { id: '1', title: 'Project A', description: 'Manage tasks for Project A' },
//     { id: '2', title: 'Personal Tasks', description: 'Organize daily tasks' }
//   ]);
 
//   // Use Web Worker to process board data (e.g., sorting)
//   useEffect(() => {
//     const worker = new Worker(new URL('../workers/boardWorker.js', import.meta.url));
//     worker.postMessage({ tasks: boards }); // Using boards as mock data
//     worker.onmessage = (e) => {
//       setBoards(e.data); // Update with processed data
//       logger.info('Home page boards processed in worker');
//     };
//     worker.onerror = (error) => {
//       logger.error(`Worker error: ${error.message}`);
//     };
//     return () => worker.terminate();
//   }, []);
 
//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Welcome Section */}
//       <header className="text-center mb-8">
//         <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Kanban Board</h1>
//         <p className="text-lg text-gray-600">Manage your tasks efficiently with our intuitive Kanban board.</p>
//       </header>
 
//       {/* Navigation */}
//       <nav className="flex justify-center space-x-4 mb-8">
//         <Link to="/analytics" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//           View Analytics
//         </Link>
//         <button
//           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//           onClick={() => logger.info('Create New Board clicked')}
//         >
//           Create New Board
//         </button>
//       </nav>
 
//       {/* Board List */}
//       <section className="max-w-4xl mx-auto">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Boards</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {boards.map((board) => (
//             <Link
//               key={board.id}
//               to={`/board/${board.id}`}
//               className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg"
//               onClick={() => logger.info(`Navigated to board ${board.id}`)}
//             >
//               <h3 className="text-xl font-semibold text-gray-800">{board.title}</h3>
//               <p className="text-gray-600">{board.description}</p>
//             </Link>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };
 
// export default Home;


// import { Link } from 'react-router-dom';

// const Home = () => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-4xl font-bold mb-6">Kanban Board</h1>
//       <p className="text-lg mb-4">Organize your tasks with ease.</p>
//       <div className="space-x-4">
//         <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//           Login
//         </Link>
//         <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//           Register
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Home;


// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import logger from '../services/logger';

// const Home = () => {
//   const [boards, setBoards] = useState([
//     { id: '1', title: 'Project A', description: 'Manage development tasks for Project A', createdAt: new Date() },
//     { id: '2', title: 'Personal Tasks', description: 'Organize daily personal tasks', createdAt: new Date() },
//     { id: '3', title: 'Work Sprint', description: 'Current sprint tasks', createdAt: new Date() }
//   ]);

  // useEffect(() => {
  //   const worker = new Worker(new URL('../workers/boardWorker.js', import.meta.url));
  //   worker.postMessage({ tasks: boards });
  //   worker.onmessage = (e) => {
  //     setBoards(e.data);
  //     logger.info('Home page boards processed in worker');
  //   };
  //   worker.onerror = (error) => {
  //     logger.error(`Worker error: ${error.message}`);
  //   };
  //   return () => worker.terminate();
  // }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <header className="text-center mb-8">
//         <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Kanban Board</h1>
//         <p className="text-lg text-gray-600">Manage your tasks efficiently with our intuitive Kanban board.</p>
//       </header>
//       <nav className="flex justify-center space-x-4 mb-8">
//         <Link to="/register" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//           Register
//         </Link>
//         <Link to="/analytics" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//           View Analytics
//         </Link>
//         <button
//           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-600"
//           onClick={() => logger.info('Create New Board clicked')}
//         >
//           Create New Board
//         </button>
//       </nav>
//       <section className="max-w-4xl mx-auto">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Boards</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {boards.map((board) => (
//             <Link
//               key={board.id}
//               to={`/board/${board.id}`}
//               className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg"
//               onClick={() => logger.info(`Navigated to board ${board.id}`)}
//             >
//               <h3 className="text-xl font-semibold text-gray-800">{board.title}</h3>
//               <p className="text-gray-600">{board.description}</p>
//               <p className="text-sm text-gray-500">Created: {new Date(board.createdAt).toLocaleDateString()}</p>
//             </Link>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;


import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import logger from '../services/logger';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Home = () => {
  const [boards, setBoards] = useState([]);
  const [newBoard, setNewBoard] = useState({ title: '', description: '', tags: [] });
  const [editBoard, setEditBoard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndBoards = async () => {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        // Fetch user info to display name
        const userResponse = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUserName(userResponse.data.name);
        logger.info(`Fetched user info: ${userResponse.data.name}`);

        // Fetch boards
        const boardsResponse = await api.get('/boards', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setBoards(boardsResponse.data);
        logger.info('Fetched user boards successfully');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
        logger.error(`Error fetching data: ${err.message}`);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndBoards();
  }, [isAuthenticated, navigate]);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoard.title) {
      setError('Board title is required');
      logger.error('Create board failed: Missing title');
      return;
    }
    try {
      const response = await api.post('/boards', newBoard, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBoards([...boards, response.data.board]);
      setNewBoard({ title: '', description: '', tags: [] });
      setError('');
      logger.info(`Board created: ${response.data.board.title}`);
      toast.success('Board created successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create board');
      logger.error(`Error creating board: ${err.message}`);
      toast.error('Failed to create board');
    }
  };

  const handleEditBoard = async (boardId) => {
    if (!editBoard.title) {
      setError('Board title is required');
      logger.error('Edit board failed: Missing title');
      return;
    }
    try {
      const response = await api.put(`/boards/${boardId}`, editBoard, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBoards(boards.map((b) => (b._id === boardId ? response.data.board : b)));
      setEditBoard(null);
      setError('');
      logger.info(`Board updated: ${boardId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update board');
      logger.error(`Error updating board: ${err.message}`);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    try {
      await api.delete(`/boards/${boardId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBoards(boards.filter((board) => board._id !== boardId));
      logger.info(`Board deleted: ${boardId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete board');
      logger.error(`Error deleting board: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    logger.info('User logged out');
    navigate('/login');
  };

  const filteredBoards = boards
    .filter((board) =>
      board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      board.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter((board) => filter === 'all' || board.tags?.includes(filter));

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome{isAuthenticated && userName ? `, ${userName}` : ''} to Kanban Board
        </h1>
        <p className="text-lg text-gray-600">Manage your tasks efficiently with our intuitive Kanban board.</p>
      </header>


      <nav className="flex justify-center space-x-4 mb-8">
        {!isAuthenticated ? (
          <>
            <Link to="/register" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Register
            </Link>
            <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Login
            </Link>
          </>
        ) : (
          <>
            <Link to="/analytics" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              View Analytics
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </nav>


      {isAuthenticated ? (
        <section className="max-w-4xl mx-auto">

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Board</h2>
          <form onSubmit={handleCreateBoard} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Board Title"
                value={newBoard.title}
                onChange={(e) => setNewBoard({ ...newBoard, title: e.target.value })}
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newBoard.description}
                onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Tags (comma-separated, optional)"
                value={newBoard.tags.join(',')}
                onChange={(e) => setNewBoard({ ...newBoard, tags: e.target.value.split(',').map(t => t.trim()) })}
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Create Board
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Boards</h2>
          <div className="mb-4 flex gap-4">
            <input
              type="text"
              placeholder="Search boards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Tags</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          {/* show boards */}
          {loading ? (
            <p className="text-gray-600">Loading boards...</p>
          ) : filteredBoards.length === 0 ? (
            <p className="text-gray-600">No boards found. Create one above!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBoards.map((board) => (
                <div key={board._id} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg">
                  {editBoard && editBoard._id === board._id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={editBoard.title}
                        onChange={(e) => setEditBoard({ ...editBoard, title: e.target.value })}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={editBoard.description}
                        onChange={(e) => setEditBoard({ ...editBoard, description: e.target.value })}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={editBoard.tags.join(',')}
                        onChange={(e) => setEditBoard({ ...editBoard, tags: e.target.value.split(',').map(t => t.trim()) })}
                        className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditBoard(board._id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditBoard(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>

                      <Link
                        to={`/board/${board._id}`}
                        className="block"
                        onClick={() => logger.info(`Navigated to board ${board._id}`)}
                      >
                        <h3 className="text-xl font-semibold text-gray-800">{board.title}</h3>
                        <p className="text-gray-600">{board.description || 'No description'}</p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(board.createdAt).toLocaleDateString()}
                        </p>
                        {board.tags && board.tags.length > 0 && (
                          <p className="text-sm text-gray-500">Tags: {board.tags.join(', ')}</p>
                        )}
                      </Link>


                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => setEditBoard(board)}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBoard(board._id)}
                          className="text-sm text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="text-center">
          <p className="text-gray-600">Please log in to view and manage your boards.</p>
        </section>
      )}
    </div>
  );
};



<ToastContainer position="top-right" autoClose={3000} />

export default Home;