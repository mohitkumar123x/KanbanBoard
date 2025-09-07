
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BoardView from './pages/BoardView';
import Analytics from './pages/Analytics';
import Register from './pages/Register';

import { Provider } from 'react-redux';
import store from '../src/components/Store';

import Login from './components/Auth/Login';
// import Register from './components/Auth/Register';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/board/:boardId" element={<BoardView />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </Router>
      </Provider>
    </AuthProvider>
  );
}

export default App;
