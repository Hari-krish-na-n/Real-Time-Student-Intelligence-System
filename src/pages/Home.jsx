import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = { email: '', password: '' };
    if (!email) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email.';
    if (!password) errors.password = 'Password is required.';
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      localStorage.setItem(
        'userSession',
        JSON.stringify({ email, loggedIn: true, rememberMe }),
      );
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-0">
      <div className="w-full max-w-md mx-auto bg-white/95 p-10 rounded-3xl border border-primary/20 shadow-2xl backdrop-blur-lg flex flex-col justify-center text-center">
        <div className="flex items-center justify-center mx-auto gap-2 text-primary text-sm font-semibold mb-5">
          <ShieldCheck size={20} />
          Secure Student Intelligence Login
        </div>
        <h1 className="text-3xl font-bold text-primary text-center mb-6">Login to Seed Track</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-bold text-text/60 uppercase tracking-widest">
              Email
            </label>
            <div className="flex items-center gap-2 bg-background px-4 py-3 rounded-xl border border-primary/10">
              <User size={16} className="text-primary" />
              <input
                id="email"
                type="email"
                className="w-full bg-transparent outline-none text-text text-sm"
                placeholder="example@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!fieldErrors.email}
              />
            </div>
            {fieldErrors.email && <p className="text-xs text-red-600">{fieldErrors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-bold text-text/60 uppercase tracking-widest">
              Password
            </label>
            <div className="flex items-center gap-2 bg-background px-4 py-3 rounded-xl border border-primary/10">
              <Lock size={16} className="text-primary" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-transparent outline-none text-text text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!fieldErrors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-text/60 hover:text-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password && <p className="text-xs text-red-600">{fieldErrors.password}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-text/70">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary rounded"
              />
              Remember me
            </label>
            <a href="#" className="text-primary hover:underline" onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all disabled:opacity-60"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="text-center text-xs text-text/60">
            Demo mode: any valid email + password is accepted.
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <button
              type="button"
              className="w-full py-2 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2"
              onClick={() => alert('Placeholder social login (Google)')}
            >
              Continue with Google
            </button>
            <button
              type="button"
              className="w-full py-2 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2"
              onClick={() => alert('Placeholder social login (Microsoft)')}
            >
              Continue with Microsoft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
