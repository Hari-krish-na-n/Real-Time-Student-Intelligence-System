import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // Simple demo login: accept any non-empty credentials
    localStorage.setItem('userSession', JSON.stringify({ email, loggedIn: true }));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-0">
      <div className="w-full h-full max-w-md mx-4 my-8 bg-white p-10 rounded-3xl border border-primary/10 shadow-xl flex flex-col justify-center">
        <h1 className="text-3xl font-bold text-primary text-center mb-6">Login to Student Intelligence</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text/60 uppercase tracking-widest">Email</label>
            <div className="flex items-center gap-2 bg-background px-4 py-3 rounded-xl border border-primary/10">
              <User size={16} className="text-primary" />
              <input
                type="email"
                className="w-full bg-transparent outline-none text-text text-sm"
                placeholder="example@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text/60 uppercase tracking-widest">Password</label>
            <div className="flex items-center gap-2 bg-background px-4 py-3 rounded-xl border border-primary/10">
              <Lock size={16} className="text-primary" />
              <input
                type="password"
                className="w-full bg-transparent outline-none text-text text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-xs text-text/50 text-center">
          Use any non-empty credentials for demo access.
        </p>
      </div>
    </div>
  );
};

export default Home;
