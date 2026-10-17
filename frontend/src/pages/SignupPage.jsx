import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2, UserPlus, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { pageVariants } from '../utils/animations';
import HydroTrackLogo from '../components/HydroTrackLogo';

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
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <HydroTrackLogo variant="full" size="lg" />
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-[#1D2226] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[3px] p-6 sm:p-8 shadow-sm transition-colors">
          <div className="mb-5 pb-3 border-b border-[#ECE9E2] dark:border-[#252B30]">
            <h2 className="text-base font-bold text-[#171A1C] dark:text-[#F7F5F0]">Create your operator account</h2>
            <p className="text-xs text-[#606870] dark:text-[#8E97A0] mt-1">
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
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 border-l-4 border-l-emerald-600 rounded-[2px] flex items-center space-x-2 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Account successfully created! Redirecting to login...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#171A1C] dark:text-[#F7F5F0] font-semibold mb-1">
                Full name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Rohan Sharma"
                className="w-full bg-[#F8F7F4] dark:bg-[#131618] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[2px] px-3 py-2 text-[#171A1C] dark:text-[#F7F5F0] placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[#171A1C] dark:text-[#F7F5F0] font-semibold mb-1">
                Email address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="rohan@hydrotrack.com"
                className="w-full bg-[#F8F7F4] dark:bg-[#131618] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[2px] px-3 py-2 text-[#171A1C] dark:text-[#F7F5F0] placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[#171A1C] dark:text-[#F7F5F0] font-semibold">
                  Password (min 6 characters) *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#606870] dark:text-[#8E97A0] hover:text-amber-500 flex items-center space-x-1 transition-colors"
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
                className="w-full bg-[#F8F7F4] dark:bg-[#131618] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[2px] px-3 py-2 text-[#171A1C] dark:text-[#F7F5F0] placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-[#171A1C] dark:text-[#F7F5F0] font-semibold mb-1">
                Confirm password *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#F8F7F4] dark:bg-[#131618] border border-[#E5E2DA] dark:border-[#2C333A] rounded-[2px] px-3 py-2 text-[#171A1C] dark:text-[#F7F5F0] placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono transition-colors"
              />
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={shouldReduceMotion ? {} : { y: -1 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                type="submit"
                disabled={loading || success}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-[2px] text-xs font-semibold transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center space-x-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                <span>{loading ? 'Creating Account...' : 'Create Operator Account'}</span>
              </motion.button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-5 pt-4 border-t border-[#ECE9E2] dark:border-[#252B30] text-center text-xs text-[#606870] dark:text-[#8E97A0]">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-500 font-bold hover:underline">
              Sign in
            </Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
