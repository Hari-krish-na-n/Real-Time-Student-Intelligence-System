import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Users, GraduationCap, ClipboardCheck, AlertTriangle, 
  TrendingUp, TrendingDown, Search, Filter, Trash2, 
  ChevronRight, AlertCircle, Bell, Sparkles, Calendar
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

  const getMarkColor = (marks) => {
    if (marks >= 75) return 'text-green-600';
    if (marks >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusBadgeStyle = (status) => {
    if (status === 'Active') return 'bg-green-50 text-green-700';
    if (status === 'Inactive') return 'bg-gray-100 text-gray-700';
    if (status === 'Absent') return 'bg-red-50 text-red-600';
    return 'bg-background text-text';
  };

  const getAttendanceBar = (attendance) => {
    if (attendance >= 90) return 'bg-green-500';
    if (attendance >= 75) return 'bg-amber-500';
    return 'bg-red-400';
  };

  const updateStatus = (id, status) => {
    const updatedRecords = records.map(r => r.id === id ? { ...r, status } : r);
    setRecords(updatedRecords);
    localStorage.setItem('studentRecords', JSON.stringify(updatedRecords));
  };

  useEffect(() => {
    const existingRecords = JSON.parse(localStorage.getItem('studentRecords') || '[]');
    const normalizedRecords = existingRecords.map(r => ({ ...r, status: r.status || 'Active' }));
    setRecords(normalizedRecords);
    localStorage.setItem('studentRecords', JSON.stringify(normalizedRecords));

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
    if (records.length === 0) return { 
      total: 0, avgMarks: 0, avgAttendance: 0, atRisk: 0, 
      active: 0, inactive: 0, absent: 0, 
      impactScore: 0, parentMeetingsTotal: 0, onTrackStudents: 0 
    };
    
    const total = records.length;
    const avgMarks = Math.round(records.reduce((sum, r) => sum + r.averageMarks, 0) / total);
    const avgAttendance = Math.round(records.reduce((sum, r) => sum + r.attendancePercentage, 0) / total);
    const atRisk = records.filter(r => r.averageMarks < 40 && r.attendancePercentage < 80).length;
    const active = records.filter(r => (r.status || 'Active') === 'Active').length;
    const inactive = records.filter(r => (r.status || 'Active') === 'Inactive').length;
    const absent = records.filter(r => (r.status || 'Active') === 'Absent').length;
    
    // Fellow Impact Score Calculation
    const parentMeetingsTotal = records.reduce((sum, r) => sum + (r.parentMeetings || 0), 0);
    const onTrackStudents = records.filter(r => r.averageMarks >= 40 && r.attendancePercentage >= 80).length;
    const impactScore = Math.min(100, Math.round(
      (onTrackStudents / (total || 1)) * 50 + 
      (Math.min(parentMeetingsTotal, total * 2) / (total * 2 || 1)) * 30 +
      (avgAttendance / 100) * 20
    ));

    return { total, avgMarks, avgAttendance, atRisk, active, inactive, absent, impactScore, parentMeetingsTotal, onTrackStudents };
  }, [records]);

  const alerts = useMemo(() => {
    const list = [];
    records.forEach(r => {
      if (r.averageMarks < 40 && r.attendancePercentage < 80) {
        list.push({ 
          type: 'danger', 
          message: `CRITICAL RISK: ${r.name} is failing and absent.`, 
          suggestion: "Home visit worked for 3 similar cases.",
          id: r.id 
        });
      } else if (r.averageMarks < 40) {
        list.push({ type: 'warning', message: `Low quiz scores: ${r.name} (${r.averageMarks}%)`, id: r.id });
      } else if (r.attendancePercentage < 80) {
        list.push({ type: 'info', message: `Attendance warning: ${r.name} (${r.attendancePercentage}%)`, id: r.id });
      }
    });
    return list.slice(0, 5); // Show top 5 alerts
  }, [records]);

  const grades = useMemo(() => {
    const uniqueGrades = [...new Set(records.map(r => r.grade))];
    return uniqueGrades.sort();
  }, [records]);

  const gradeDistribution = useMemo(() => {
    return records.reduce((acc, r) => {
      const g = r.grade || 'No Grade';
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});
  }, [records]);

  const atRiskStudents = useMemo(() => {
    return records.filter(r => r.averageMarks < 40 && r.attendancePercentage < 80);
  }, [records]);

  const topStudents = useMemo(() => {
    return [...records].sort((a, b) => b.averageMarks - a.averageMarks).slice(0, 3);
  }, [records]);

  const bottomStudents = useMemo(() => {
    return [...records].sort((a, b) => a.averageMarks - b.averageMarks).slice(0, 3);
  }, [records]);

  const filteredRecords = useMemo(() => {
    let result = records.filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (gradeFilter !== 'all') {
      result = result.filter(r => r.grade === gradeFilter);
    }

    if (statusFilter === 'at-risk') {
      result = result.filter(r => r.averageMarks < 40 && r.attendancePercentage < 80);
    } else if (['active', 'inactive', 'absent'].includes(statusFilter)) {
      result = result.filter(r => (r.status || 'Active').toLowerCase() === statusFilter);
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

  const bulkUpdateStatus = (status) => {
    const toUpdate = filteredRecords;
    if (!toUpdate.length) return;
    const updatedRecords = records.map(r =>
      toUpdate.some(u => u.id === r.id) ? { ...r, status } : r
    );
    setRecords(updatedRecords);
    localStorage.setItem('studentRecords', JSON.stringify(updatedRecords));
  };


  return (
    <div className="space-y-8 py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-primary">Class Intelligence Dashboard</h1>
          <p className="text-text/60 font-medium">Real-time tracking of student performance and attendance.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Fellow Impact Score */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-primary/10 shadow-sm"
          >
            <div className="text-right">
              <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest">Fellow Impact Score</p>
              <p className="text-xl font-bold text-primary">{stats.impactScore}/100</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-primary/10 flex items-center justify-center relative">
              <Sparkles size={20} className="text-primary" />
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="24" cy="24" r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-primary"
                  strokeDasharray={`${(stats.impactScore / 100) * 125.6} 125.6`}
                />
              </svg>
            </div>
          </motion.div>
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
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-text/80 group-hover:text-primary">{alert.message}</p>
                          {alert.suggestion && (
                            <p className="text-[10px] text-primary font-medium italic">💡 {alert.suggestion}</p>
                          )}
                        </div>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="absent">Absent</option>
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
          { label: "Active", value: stats.active, icon: Users, color: "bg-green-50 text-green-700" },
          { label: "Inactive", value: stats.inactive, icon: Bell, color: "bg-gray-100 text-gray-700" },
          { label: "Absent", value: stats.absent, icon: AlertTriangle, color: "bg-red-50 text-red-600" },
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

      {/* Fellow Impact Dashboard Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-primary p-10 rounded-[50px] text-white shadow-2xl shadow-primary/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
          <Sparkles size={160} />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          <div className="space-y-2">
            <h3 className="text-3xl font-bold">Fellow Impact Dashboard</h3>
            <p className="text-white/60 font-medium">Measuring your classroom transformation.</p>
          </div>
          
          <div className="bg-white/10 p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Users size={28} />
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">+{stats.onTrackStudents}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Students On-Track</p>
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Calendar size={28} />
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{stats.parentMeetingsTotal}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Parent Meetings Conducted</p>
            </div>
          </div>

          <div className="bg-white/10 p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white">
              <TrendingUp size={28} />
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">{stats.impactScore}%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Overall Efficiency Score</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Extended Dashboard Analysis */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[30px] border border-primary/10 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-text/50 uppercase tracking-widest">Grade Distribution</h4>
          {Object.entries(gradeDistribution).map(([grade, count]) => (
            <div key={grade} className="flex items-center gap-3">
              <span className="w-24 text-xs font-medium text-text/70">{grade}</span>
              <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(count / Math.max(stats.total, 1)) * 100}%` }} />
              </div>
              <span className="text-xs font-bold text-text">{count}</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-[30px] border border-primary/10 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-text/50 uppercase tracking-widest">At-Risk Analysis</h4>
          <p className="text-[10px] text-text/70 uppercase font-bold">Students with marks &lt; 40 AND attendance &lt; 80%</p>
          <p className="text-3xl font-bold text-red-600">{atRiskStudents.length}</p>
          {atRiskStudents.slice(0, 4).map(student => (
            <div key={student.id} className="flex items-center justify-between text-sm py-1">
              <span>{student.name}</span>
              <span className="font-bold">{student.averageMarks}%</span>
            </div>
          ))}
          {atRiskStudents.length > 4 && (
            <div className="text-xs font-bold text-primary">+{atRiskStudents.length - 4} more</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-[30px] border border-primary/10 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-text/50 uppercase tracking-widest">Quick Bulk Actions</h4>
          <div className="space-y-2">
            <button
              onClick={() => bulkUpdateStatus('Absent')}
              className="w-full py-2 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all"
            >
              Mark Filtered as Absent
            </button>
            <button
              onClick={() => bulkUpdateStatus('Inactive')}
              className="w-full py-2 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all"
            >
              Mark Filtered as Inactive
            </button>
            <button
              onClick={() => bulkUpdateStatus('Active')}
              className="w-full py-2 rounded-xl bg-green-50 text-green-700 font-bold hover:bg-green-100 transition-all"
            >
              Mark Filtered as Active
            </button>
          </div>
          <p className="text-xs text-text/60">Actions apply to currently filtered students (name/grade/status).</p>
        </div>
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
                      getMarkColor(record.averageMarks)
                    )}>
                      {record.averageMarks}%
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn(
                        "font-bold",
                        getAttendanceColor(record.attendancePercentage)
                      )}>
                        {record.attendancePercentage}%
                      </span>
                      <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", getAttendanceBar(record.attendancePercentage))}
                          style={{ width: `${record.attendancePercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center space-y-2">
                    <div>
                      {(record.averageMarks < 40 && record.attendancePercentage < 80) ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          <AlertTriangle size={12} /> Critical Risk
                        </span>
                      ) : (record.averageMarks < 40 || record.attendancePercentage < 80) ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          Warning
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          On Track
                        </span>
                      )}
                    </div>
                    <div className={cn(
                      "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      getStatusBadgeStyle(record.status)
                    )}>
                      {record.status || 'Active'}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={record.status || 'Active'}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateStatus(record.id, e.target.value);
                        }}
                        className="px-2 py-1 rounded-xl border border-primary/10 text-xs font-bold text-text/80 bg-white"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Absent">Absent</option>
                      </select>
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
