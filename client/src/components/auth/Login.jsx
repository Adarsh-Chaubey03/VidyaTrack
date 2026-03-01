import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets.js';

const Login = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'educator' ? 'educator' : 'user';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [selectedRole, setSelectedRole] = useState(initialRole); // 'user' | 'educator'
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, selectedRole);

      if (result && result.success === true) {
        toast.success(result.message || 'Login successful');
        setTimeout(() => {
          navigate(selectedRole === 'educator' ? '/educator' : '/');
        }, 100);
      } else {
        toast.error(result?.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      toast.error(error?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const isEducator = selectedRole === 'educator';

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 20%, #fff1f2 50%, #fce7f3 75%, #ecfdf5 100%)' }}
    >
      {/* Decorative blurred orbs */}
      <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-30 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #34d399, transparent 70%)' }} />
      <div className="absolute bottom-[-100px] right-[-60px] w-[350px] h-[350px] rounded-full opacity-25 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #fb7185, transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #f9a8d4, transparent 70%)' }} />

      <div className="relative max-w-md w-full bg-white/70 backdrop-blur-2xl rounded-3xl shadow-xl ring-1 ring-white/60 p-8 sm:p-10">
        {/* Brand logo */}
        <div className="flex justify-center mb-2">
          <img src={assets.logo} alt="VidyaTrack" className="h-9" />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {isEducator ? 'Educator Login' : 'Sign in to your account'}
          </h2>
          <p className="mt-1.5 text-sm text-gray-500">
            {isEducator ? 'Access your educator dashboard' : 'Welcome back to VidyaTrack'}
          </p>
        </div>

        {/* ─── Role Selector Pills ─── */}
        <div className="flex rounded-xl bg-gray-100/80 p-1 mb-5">
          <button
            type="button"
            onClick={() => setSelectedRole('user')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              !isEducator
                ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('educator')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              isEducator
                ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Educator
          </button>
        </div>

        {isEducator && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 mb-5">
            <svg className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-amber-700 leading-relaxed">
              Logging in as Educator will start an <strong>educator-scoped session</strong>. Only one role is active at a time.
            </p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2.5 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-2.5 bg-white/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2.5 px-4 text-sm font-semibold rounded-xl text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isEducator
                  ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 shadow-emerald-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 shadow-emerald-200'
              }`}
            >
              {loading
                ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Signing in…
                  </span>
                )
                : isEducator
                  ? 'Sign in as Educator'
                  : 'Sign in'}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="/signup" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;