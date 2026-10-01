import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.trim() || !formData.password) {
      setError('Please provide both email and password.');
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
        navigate('/', { replace: true });
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
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
            <h2 className="text-base font-bold text-[#111111]">Welcome back</h2>
            <p className="text-xs text-[#5C5C5C] mt-1">
              Enter your credentials to access the plant monitoring dashboard.
            </p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 border-l-4 border-l-red-600 rounded-[2px] flex items-center space-x-2 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                placeholder="operator@hydrotrack.com"
                className="w-full bg-white border border-[#D1D1D1] rounded-[2px] px-3 py-2 text-[#111111] focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[#111111] font-medium">
                  Password *
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-[#111111] hover:bg-black text-white rounded-[2px] text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          {/* Demo Credentials Box */}
          <div className="mt-5 p-3 bg-[#F9F9F9] border border-[#D1D1D1] rounded-[2px] text-[11px] text-[#5C5C5C] space-y-1">
            <div className="font-semibold text-[#111111]">Demo Admin Account:</div>
            <div className="font-mono text-[#111111]">admin@hydrotrack.com / Admin@123</div>
          </div>

          {/* Footer Link */}
          <div className="mt-5 pt-4 border-t border-[#E5E5E5] text-center text-xs text-[#5C5C5C]">
            New user?{' '}
            <Link to="/signup" className="text-[#111111] font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
