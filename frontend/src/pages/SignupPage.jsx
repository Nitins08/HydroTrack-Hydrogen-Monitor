import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Droplets, Eye, EyeOff, AlertCircle, CheckCircle2, UserPlus, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { pageVariants } from '../utils/animations';

export default function SignupPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      if (res.success) {
        setSuccess(true);
        showToast('Account registered successfully! Redirecting to login...', 'success');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1200);
      } else {
        setError(res.message || 'Failed to create operator account.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-[82vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-11 h-11 border border-teal-600 dark:border-teal-500 bg-teal-50 dark:bg-teal-950/60 items-center justify-center text-teal-700 dark:text-teal-400 rounded-[3px] mb-3 shadow-2xs">
            <Droplets className="w-5 h-5 fill-teal-600 text-teal-600 dark:fill-teal-400 dark:text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center justify-center space-x-1.5">
            <span>HydroTrack</span>
            <span className="text-[10px] font-mono uppercase bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 px-1.5 py-0.2 rounded-[2px] font-semibold">
              Register
            </span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Hydrogen Production & Sustainability Monitoring System
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-[#151C28] border border-gray-200 dark:border-slate-800 rounded-[3px] p-6 sm:p-8 shadow-sm transition-colors">
          <div className="mb-5 pb-3 border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Create your operator account</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Join the monitoring crew to log daily production records and track plant KPIs.
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 border-l-4 border-l-red-600 rounded-[2px] flex items-center space-x-2 text-xs text-red-800 dark:text-red-300">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 border-l-4 border-l-teal-600 rounded-[2px] flex items-center space-x-2 text-xs text-teal-800 dark:text-teal-300">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
              <span>Account successfully created! Redirecting to login...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 dark:text-slate-300 font-semibold mb-1">
                Full name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Rohan Sharma"
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-[2px] px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-slate-300 font-semibold mb-1">
                Email address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="rohan@hydrotrack.com"
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-[2px] px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-gray-700 dark:text-slate-300 font-semibold">
                  Password (min 6 characters) *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-gray-500 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-400 flex items-center space-x-1 transition-colors"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-[2px] px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-slate-300 font-semibold mb-1">
                Confirm password *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-[2px] px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono transition-colors"
              />
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={shouldReduceMotion ? {} : { y: -1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                type="submit"
                disabled={loading || success}
                className="w-full py-2.5 bg-gray-900 hover:bg-black dark:bg-teal-600 dark:hover:bg-teal-700 text-white rounded-[2px] text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center space-x-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                <span>{loading ? 'Creating Account...' : 'Create Operator Account'}</span>
              </motion.button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-800 text-center text-xs text-gray-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-700 dark:text-teal-400 font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
