import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Droplets, Eye, EyeOff, AlertCircle, ShieldCheck, HardHat, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { pageVariants } from '../utils/animations';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFillDemo = (email, password) => {
    setFormData({ email, password });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.trim() || !formData.password) {
      setError('Please provide both email address and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.login({
        email: formData.email.trim(),
        password: formData.password
      });

      if (res.success && res.token) {
        login(res.token, res.user);
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        navigate('/', { replace: true });
      } else {
        setError(res.message || 'Login failed. Please verify your credentials.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
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
          <div className="inline-flex w-11 h-11 border border-teal-600 bg-teal-50 items-center justify-center text-teal-700 rounded-[3px] mb-3 shadow-2xs">
            <Droplets className="w-5 h-5 fill-teal-600 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center justify-center space-x-1.5">
            <span>HydroTrack</span>
            <span className="text-[10px] font-mono uppercase bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-0.2 rounded-[2px] font-semibold">
              v1.0
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Green Hydrogen Production & Sustainability System
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-gray-200 rounded-[3px] p-6 sm:p-8 shadow-sm">
          <div className="mb-5 pb-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Sign in to your account</h2>
            <p className="text-xs text-gray-500 mt-1">
              Enter your credentials to access live plant telemetry and monitoring.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 border-l-4 border-l-red-600 rounded-[2px] flex items-center space-x-2 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Email address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="operator@hydrotrack.com"
                className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-gray-700 font-semibold">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-gray-500 hover:text-teal-700 flex items-center space-x-1 transition-colors"
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
                className="w-full bg-white border border-gray-300 rounded-[2px] px-3 py-2 text-gray-900 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono"
              />
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={shouldReduceMotion ? {} : { y: -1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-[2px] text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center space-x-1.5"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                {!loading && <ArrowRight className="w-3.5 h-3.5" />}
              </motion.button>
            </div>
          </form>

          {/* Quick Demo Credentials Box for Viva */}
          <div className="mt-5 p-3.5 bg-gray-50 border border-gray-200 rounded-[2px] space-y-2">
            <span className="text-[11px] font-bold text-gray-700 block uppercase font-mono tracking-wider">
              One-Click Demo Credentials (Viva / Demo):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('admin@hydrotrack.com', 'Admin@123')}
                className="p-2 bg-white border border-gray-200 hover:border-gray-900 rounded-[2px] text-left text-[11px] space-y-0.5 transition-colors group"
              >
                <div className="font-bold text-gray-900 flex items-center space-x-1 group-hover:text-teal-700">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  <span>Demo Admin</span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono">admin@hydrotrack.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('operator@hydrotrack.com', 'Operator@123')}
                className="p-2 bg-white border border-gray-200 hover:border-gray-900 rounded-[2px] text-left text-[11px] space-y-0.5 transition-colors group"
              >
                <div className="font-bold text-gray-900 flex items-center space-x-1 group-hover:text-teal-700">
                  <HardHat className="w-3 h-3 text-teal-600" />
                  <span>Demo Operator</span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono">operator@hydrotrack.com</div>
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-5 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            Need an operator account?{' '}
            <Link to="/signup" className="text-teal-700 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
