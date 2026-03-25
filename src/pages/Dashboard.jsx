import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Users, GraduationCap, ClipboardCheck, AlertTriangle, 
  TrendingUp, TrendingDown, Search, Filter, Trash2, 
  ChevronRight, AlertCircle, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // Default sort
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    const existingRecords = JSON.parse(localStorage.getItem('studentRecords') || '[]');
    setRecords(existingRecords);

    // Handle state from Insights
    if (location.state) {
      if (location.state.filter === 'at-risk') {
        setStatusFilter('at-risk');
      }
      if (location.state.sortBy) {
        setSortBy(location.state.sortBy);
      }
    }
  }, [location.state]);

  const handleDelete = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedRecords = records.filter(r => r.id !== id);
    setRecords(updatedRecords);
    localStorage.setItem('studentRecords', JSON.stringify(updatedRecords));
  };

  const stats = useMemo(() => {
    if (records.length === 0) return { total: 0, avgMarks: 0, avgAttendance: 0, atRisk: 0 };
    
    const total = records.length;
    const avgMarks = Math.round(records.reduce((sum, r) => sum + r.averageMarks, 0) / total);
    const avgAttendance = Math.round(records.reduce((sum, r) => sum + r.attendancePercentage, 0) / total);
    const atRisk = records.filter(r => r.averageMarks < 40 || r.attendancePercentage < 75).length;

    return { total, avgMarks, avgAttendance, atRisk };
  }, [records]);

  const alerts = useMemo(() => {
    const list = [];
    records.forEach(r => {
      if (r.averageMarks < 40) list.push({ type: 'danger', message: `At-risk student detected: ${r.name} (${r.averageMarks}%)`, id: r.id });
      if (r.attendancePercentage < 75) list.push({ type: 'warning', message: `Low attendance warning: ${r.name} (${r.attendancePercentage}%)`, id: r.id });
      Object.entries(r.marks).forEach(([sub, score]) => {
        if (score < 40) list.push({ type: 'info', message: `${r.name} needs improvement in ${sub}`, id: r.id });
      });
    });
    return list.slice(0, 5); // Show top 5 alerts
  }, [records]);

  const grades = useMemo(() => {
    const uniqueGrades = [...new Set(records.map(r => r.grade))];
    return uniqueGrades.sort();
  }, [records]);

  const filteredRecords = useMemo(() => {
    let result = records.filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (gradeFilter !== 'all') {
      result = result.filter(r => r.grade === gradeFilter);
    }

    if (statusFilter === 'at-risk') {
      result = result.filter(r => r.averageMarks < 40 || r.attendancePercentage < 75);
    }

    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'avgMarks') {
      result.sort((a, b) => b.averageMarks - a.averageMarks);
    } else if (sortBy === 'attendance') {
      result.sort((a, b) => b.attendancePercentage - a.attendancePercentage);
    } else if (['math', 'science', 'english', 'social'].includes(sortBy)) {
      result.sort((a, b) => (b.marks[sortBy] || 0) - (a.marks[sortBy] || 0));
    }

    return result;
  }, [records, searchTerm, sortBy, gradeFilter, statusFilter]);

  return (
    <div className="space-y-8 py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-primary">Class Intelligence Dashboard</h1>
          <p className="text-text/60 font-medium">Real-time tracking of student performance and attendance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button 
              onClick={() => setShowAlerts(!showAlerts)}
              className="p-3 bg-white border border-primary/10 rounded-2xl text-primary hover:bg-primary/5 transition-all relative"
            >
              <Bell size={24} />
              {alerts.length > 0 && (
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>
            
            <AnimatePresence>
              {showAlerts && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-80 bg-white rounded-3xl border border-primary/10 shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 bg-background border-b border-primary/5 flex justify-between items-center">
                    <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Recent Alerts</h4>
                    <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full">{alerts.length}</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-primary/5">
                    {alerts.length > 0 ? alerts.map((alert, i) => (
                      <Link 
                        key={i} 
                        to={`/student/${alert.id}`}
                        className="p-4 flex gap-3 hover:bg-background/50 transition-all group"
                      >
                        <AlertCircle size={18} className={cn(
                          alert.type === 'danger' ? "text-red-500" : alert.type === 'warning' ? "text-accent" : "text-secondary"
                        )} />
                        <p className="text-xs font-medium text-text/80 group-hover:text-primary">{alert.message}</p>
                      </Link>
                    )) : (
                      <div className="p-8 text-center text-text/40 text-sm italic">No active alerts</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative flex items-center gap-3">
            <div className="relative flex items-center">
              <Filter className="absolute left-4 text-text/40" size={18} />
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-primary/10 rounded-2xl outline-none focus:border-primary/30 transition-all text-sm appearance-none cursor-pointer text-text/80 font-medium"
              >
                <option value="all">All Grades</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            <div className="relative flex items-center">
              <TrendingUp className="absolute left-4 text-text/40" size={18} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-primary/10 rounded-2xl outline-none focus:border-primary/30 transition-all text-sm appearance-none cursor-pointer text-text/80 font-medium"
              >
                <option value="name">Sort by Name</option>
                <option value="avgMarks">Top Average Marks</option>
                <option value="attendance">Top Attendance</option>
                <option value="math">Top Math</option>
                <option value="science">Top Science</option>
                <option value="english">Top English</option>
                <option value="social">Top Social</option>
              </select>
            </div>
            <div className="relative flex items-center">
              <AlertTriangle className="absolute left-4 text-text/40" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-primary/10 rounded-2xl outline-none focus:border-primary/30 transition-all text-sm appearance-none cursor-pointer text-text/80 font-medium"
              >
                <option value="all">All Status</option>
                <option value="at-risk">At Risk Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Total Students", value: stats.total, icon: Users, color: "bg-primary/10 text-primary" },
          { label: "Class Avg Marks", value: `${stats.avgMarks}%`, icon: GraduationCap, color: "bg-secondary/10 text-secondary" },
          { label: "Avg Attendance", value: `${stats.avgAttendance}%`, icon: ClipboardCheck, color: "bg-accent/10 text-accent" },
          { label: "At Risk", value: stats.atRisk, icon: AlertTriangle, color: "bg-red-50 text-red-600" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[40px] border border-primary/5 shadow-sm space-y-4"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.color)}>
              <stat.icon size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-text/40 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-bold text-text">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-[40px] border border-primary/10 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-primary/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-text">Student Records</h3>
            <span className="px-4 py-1 bg-background rounded-full text-xs font-bold text-primary">{filteredRecords.length} Students</span>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text/40" size={20} />
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none transition-all text-sm font-medium"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50">
                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest">Student Name</th>
                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest">Grade</th>
                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-center">Avg Marks</th>
                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-center">Attendance</th>
                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-primary uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                <tr 
                  key={record.id} 
                  onClick={() => navigate(`/student/${record.id}`)}
                  className="hover:bg-background/30 transition-all cursor-pointer group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {record.name.charAt(0)}
                      </div>
                      <Link 
                        to={`/student/${record.id}`} 
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-text group-hover:text-primary hover:underline transition-all"
                      >
                        {record.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-medium text-text/60">{record.grade}</td>
                  <td className="px-8 py-6 text-center">
                    <span className={cn(
                      "font-bold text-lg",
                      record.averageMarks < 40 ? "text-red-600" : "text-text"
                    )}>
                      {record.averageMarks}%
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn(
                        "font-bold",
                        record.attendancePercentage < 75 ? "text-accent" : "text-text/60"
                      )}>
                        {record.attendancePercentage}%
                      </span>
                      <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", record.attendancePercentage < 75 ? "bg-accent" : "bg-primary")}
                          style={{ width: `${record.attendancePercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {record.averageMarks < 40 || record.attendancePercentage < 75 ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        <AlertTriangle size={12} /> At Risk
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        On Track
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => handleDelete(record.id, e)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                      <ChevronRight size={20} className="text-text/20 group-hover:text-primary transition-all" />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-text/40 italic">
                    No student records found. Start by adding some data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
