import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Home as HomeIcon, Lightbulb, Menu, X, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [attendanceEntries, setAttendanceEntries] = useState({});
  const [attendanceMessage, setAttendanceMessage] = useState('');

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Data Entry', path: '/entry', icon: PlusCircle },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tracker', path: '/tracker', icon: GraduationCap },
    { name: 'Insights', path: '/insights', icon: Lightbulb },
  ];

  const openAttendance = () => {
    const rawStudents = JSON.parse(localStorage.getItem('studentRecords') || '[]');
    setStudents(rawStudents);
    const todayKey = new Date().toISOString().slice(0, 10);
    const existingAttendance = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
    const todayAttendance = existingAttendance[todayKey] || {};

    const initialEntries = rawStudents.reduce((acc, student) => {
      acc[student.id] = !!todayAttendance[student.id];
      return acc;
    }, {});

    setAttendanceEntries(initialEntries);
    setAttendanceMessage('');
    setIsAttendanceOpen(true);
  };

  const saveAttendance = () => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const existingAttendance = JSON.parse(localStorage.getItem('attendanceRecords') || '{}');
    existingAttendance[todayKey] = attendanceEntries;
    localStorage.setItem('attendanceRecords', JSON.stringify(existingAttendance));
    setAttendanceMessage('Attendance saved for today.');
    setTimeout(() => setIsAttendanceOpen(false), 900);
  };

  const toggleCheck = (studentId) => {
    setAttendanceEntries((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

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
                Student Intelligence
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
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

              <button
                type="button"
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition"
                onClick={openAttendance}
              >
                Mark Attendance
              </button>
            </div>

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

      <AnimatePresence>
        {isAttendanceOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl border border-primary/20 shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-primary">Mark Student Attendance</h3>
                <button
                  className="text-text/70 hover:text-primary"
                  onClick={() => setIsAttendanceOpen(false)}
                  aria-label="Close attendance popup"
                >
                  <X size={20} />
                </button>
              </div>

              {students.length === 0 ? (
                <p className="text-text/60 mb-4">No student records found. Add students in Data Entry first.</p>
              ) : (
                <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
                  {students.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center justify-between gap-3 border border-slate-200 rounded-xl px-3 py-2"
                    >
                      <span>{student.name || 'Unnamed student'}</span>
                      <input
                        type="checkbox"
                        checked={attendanceEntries[student.id] || false}
                        onChange={() => toggleCheck(student.id)}
                        className="h-4 w-4 text-primary"
                      />
                    </label>
                  ))}
                </div>
              )}

              {attendanceMessage && <p className="text-sm text-emerald-600 mb-3">{attendanceMessage}</p>}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl border border-slate-300 text-sm hover:bg-slate-100"
                  onClick={() => setIsAttendanceOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-sm hover:bg-primary/90"
                  onClick={saveAttendance}
                  disabled={students.length === 0}
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <span>Student Intelligence</span>
        </div>
        <p className="text-text/30 text-sm font-medium">
          Empowering rural educators with actionable data. Built for impact.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
