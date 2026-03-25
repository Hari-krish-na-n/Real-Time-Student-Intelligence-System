import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Home as HomeIcon, Lightbulb, Menu, X, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Data Entry', path: '/entry', icon: PlusCircle },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Insights', path: '/insights', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-background text-text font-sans selection:bg-primary/20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-[14px] flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                <GraduationCap size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary hidden sm:block">
                Seed Track
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-10">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 text-sm font-bold transition-all hover:text-primary uppercase tracking-widest",
                    location.pathname === item.path ? "text-primary scale-105" : "text-text/40"
                  )}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-3 bg-primary/5 rounded-2xl text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-primary/10 overflow-hidden"
            >
              <div className="px-6 pt-4 pb-10 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-6 py-5 rounded-[24px] text-lg font-bold transition-all",
                      location.pathname === item.path ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-text/40 hover:bg-primary/5"
                    )}
                  >
                    <item.icon size={24} />
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-24 py-16 border-t border-primary/10 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-primary font-bold">
          <GraduationCap size={24} />
          <span>Seed Track</span>
        </div>
        <p className="text-text/30 text-sm font-medium">
          Empowering rural educators with actionable data. Built for impact.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
