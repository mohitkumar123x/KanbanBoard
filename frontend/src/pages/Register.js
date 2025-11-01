
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import api from '../services/api';
import logger from '../services/logger';
import { setAuth } from '../components/Store/authSlice';
import { useDispatch } from 'react-redux';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    // ---- client-side validation ----
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      logger.error('Registration failed: Missing required fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      logger.error('Registration failed: Passwords do not match');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      logger.error('Registration failed: Invalid email format');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      logger.error('Registration failed: Password too short');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });

      logger.info(`Registration successful: ${email}, UID: ${response.data.uid}`);

      // Store tenantId (if you need it later)
      localStorage.setItem('TenentId', response.data.tenantId);

      // Update Redux store
      dispatch(
        setAuth({
          user: { name, email },
          token: response.data.token,
          tenantId: response.data.tenantId,
        })
      );

      navigate('/login'); // or '/home' if you want to go straight in
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Registration failed';
      setError(msg);
      logger.error(`Registration error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // ----- Particles init (same as Login) -----
  const particlesInit = async engine => {
    await loadSlim(engine);
  };

  // ----- Framer Motion card animation -----
  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center p-6 overflow-hidden">
      {/* ---- Particle background ---- */}
      <Particles
        id="tsparticles-register"
        init={particlesInit}
        options={{
          background: { color: { value: '#f3f4f6' } },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: true, mode: 'repulse' }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 } },
          },
          particles: {
            color: { value: '#3b82f6' },
            links: { color: '#3b82f6', distance: 150, enable: true, opacity: 0.4, width: 1 },
            move: { enable: true, speed: 1, outModes: { default: 'bounce' } },
            number: { value: 60, density: { enable: true, area: 800 } },
            opacity: { value: 0.6 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 4 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />

      {/* ---- Animated Register Card ---- */}
      <motion.div
        className="relative z-10 max-w-md w-full bg-white/80 backdrop-blur-md p-8 rounded-lg shadow-md"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>

        {error && (
          <motion.p
            className="text-red-500 mb-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit button with loading spinner */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center p-2 rounded text-white font-medium
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Registering…
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;