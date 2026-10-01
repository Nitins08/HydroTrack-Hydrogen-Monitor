import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function SignupPage() {
  const navigate = useNavigate();

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
      setError('Passwords do not match. Please verify both fields.');
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
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      } else {
        setError(res.message || 'Failed to create account.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex w-10 h-10 border border-black items-center justify-center text-black bg-white mb-3">
            <Droplet className="w-5 h-5 fill-black text-black" />
          </div>
          <h1 className="text-xl font-bold text-[#111111] tracking-tight">HydroTrack</h1>
          <p className="text-xs text-[#5C5C5C] mt-0.5">Hydrogen Production Monitoring System</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-[#D1D1D1] rounded-[2px] p-6 sm:p-8 shadow-sm">
          <div className="mb-5">
            <h2 className="text-base font-bold text-[#111111]">Create your HydroTrack account</h2>
            <p className="text-xs text-[#5C5C5C] mt-1">
              Sign up as a plant operator to monitor hydrogen production metrics.
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 border-l-4 border-l-red-600 rounded-[2px] flex items-center space-x-2 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 border-l-4 border-l-green-600 rounded-[2px] flex items-center space-x-2 text-xs text-green-800">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>Account successfully created! Redirecting to login...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#111111] font-medium mb-1">
                Full name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Rohan Sharma"
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-2 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[#111111] font-medium mb-1">
                Email address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="rohan@example.com"
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-2 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[#111111] font-medium">
                  Password (min 6 characters) *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#5C5C5C] hover:text-[#111111] flex items-center space-x-1"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
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
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-2 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[#111111] font-medium mb-1">
                Confirm password *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-2 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-2 bg-[#111111] hover:bg-black text-white rounded-[2px] text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-5 pt-4 border-t border-[#E5E5E5] text-center text-xs text-[#5C5C5C]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#111111] font-semibold hover:underline">
              Login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
