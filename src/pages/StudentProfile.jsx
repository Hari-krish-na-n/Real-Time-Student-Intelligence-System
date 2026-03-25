import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  User, Phone, Briefcase, MapPin, GraduationCap, 
  Calendar, Activity, FileText, ChevronLeft, 
  AlertTriangle, CheckCircle2, TrendingUp, TrendingDown,
  Edit, Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AttendanceCalendar = ({ percentage, studentId }) => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const attendanceDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isFuture = date > now;
    
    if (isWeekend || isFuture) return { day, status: 'none' };
    
    const seed = (parseInt(String(studentId || '1').replace(/\D/g, '') || '1') * 100) + day;
    const isPresent = seededRandom(seed) < (percentage / 100);
    
    return { day, status: isPresent ? 'present' : 'absent' };
  });

  const monthName = now.toLocaleString('default', { month: 'long' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white p-8 rounded-[40px] border border-primary/10 shadow-sm space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-text flex items-center gap-2">
          <Calendar size={20} className="text-primary" /> {monthName} Attendance
        </h3>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Present</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /> Absent</div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`${d}-${i}`} className="text-center text-[10px] font-bold text-text/20 py-2">{d}</div>
        ))}
        {Array(firstDayOfMonth).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {attendanceDays.map(({ day, status }) => (
          <div 
            key={day}
            className={cn(
              "aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all relative",
              status === 'present' ? "bg-primary text-white shadow-sm shadow-primary/20" :
              status === 'absent' ? (
                percentage < 75 
                  ? "bg-red-100 text-red-600 border-2 border-red-200 shadow-sm" 
                  : "bg-red-50 text-red-500 border border-red-100"
              ) :
              "bg-background text-text/20"
            )}
          >
            {day}
            {status === 'absent' && percentage < 75 && (
              <AlertTriangle size={8} className="absolute top-1 right-1 text-red-600" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const records = JSON.parse(localStorage.getItem('studentRecords') || '[]');
    const found = records.find(r => r.id === id);
    if (found) {
      setStudent(found);
    } else {
      navigate('/dashboard');
    }
  }, [id, navigate]);

  if (!student) return null;

  const marksData = Object.entries(student.marks || {}).map(([subject, score]) => ({
    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
    score
  }));

  const marksEntries = Object.entries(student.marks || {});
  const weakSubject = marksEntries.length > 0 
    ? marksEntries.reduce((min, curr) => curr[1] < min[1] ? curr : min)
    : ['N/A', 0];
  const topSubject = marksEntries.length > 0
    ? marksEntries.reduce((max, curr) => curr[1] > max[1] ? curr : max)
    : ['N/A', 0];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-primary font-bold hover:underline"
        >
          <ChevronLeft size={20} /> Back to Dashboard
        </button>
        <div className="flex items-center gap-4">
          <Link 
            to="/entry"
            className="flex items-center gap-2 text-text/40 hover:text-primary text-xs font-bold uppercase tracking-widest transition-all"
          >
            <Plus size={14} /> Add New Student
          </Link>
          <Link 
            to={`/entry/${student.id}`}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Edit size={16} /> Edit Record
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold">
            ID: {student.id}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Personal Info */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[40px] border border-primary/10 shadow-sm space-y-6"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <User size={48} className="text-primary" />
            </div>
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-text">{student.name}</h1>
              <p className="text-text/40 font-medium">{student.grade} • {student.age} Years Old • {student.gender}</p>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-primary/5">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-primary">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-text/40 text-xs font-bold uppercase tracking-widest">Parent Name</p>
                  <p className="font-bold text-text">{student.parentName || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-primary">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-text/40 text-xs font-bold uppercase tracking-widest">Parent's Phone</p>
                  <p className="font-bold text-text">{student.parentPhone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-primary">
                  <Briefcase size={16} />
                </div>
                <div>
                  <p className="text-text/40 text-xs font-bold uppercase tracking-widest">Occupation</p>
                  <p className="font-bold text-text">{student.parentOccupation || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-primary">
                  <Activity size={16} />
                </div>
                <div>
                  <p className="text-text/40 text-xs font-bold uppercase tracking-widest">Engagement Level</p>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    student.engagement === 'High' ? "bg-green-100 text-green-700" :
                    student.engagement === 'Medium' ? "bg-blue-100 text-blue-700" :
                    "bg-orange-100 text-orange-700"
                  )}>
                    {student.engagement}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-primary">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-text/40 text-xs font-bold uppercase tracking-widest">Address</p>
                  <p className="font-bold text-text">{student.address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-primary p-8 rounded-[40px] text-white space-y-6"
          >
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Calendar size={20} /> Attendance Summary
            </h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Attendance Rate</p>
                <p className="text-4xl font-bold">{student.attendancePercentage}%</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Days Present</p>
                <p className="text-xl font-bold">{student.attendance?.presentDays || 0} / {student.attendance?.totalDays || 0}</p>
              </div>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-1000", (student.attendancePercentage || 0) < 75 ? "bg-red-400" : "bg-green-400")}
                style={{ width: `${student.attendancePercentage || 0}%` }}
              />
            </div>
            {(student.attendancePercentage || 0) < 75 && (
              <div className="flex items-center gap-2 p-3 bg-red-400/20 rounded-xl text-xs font-bold text-red-100">
                <AlertTriangle size={14} />
                Low attendance warning detected
              </div>
            )}
          </motion.div>

          <AttendanceCalendar percentage={student.attendancePercentage} studentId={student.id} />
        </div>

        {/* Right Column: Performance & Insights */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-[40px] border border-primary/10 shadow-sm space-y-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-text">Subject-wise Performance</h3>
              <div className="px-4 py-2 bg-background rounded-2xl">
                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">Average Marks</p>
                <p className="text-xl font-bold text-primary">{student.averageMarks}%</p>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marksData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#1B5E20', opacity: 0.4, fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#1B5E20', opacity: 0.4, fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#2E7D32', opacity: 0.05 }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {marksData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score < 40 ? '#ef4444' : '#2E7D32'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-red-50 rounded-3xl space-y-2 border border-red-100">
                <div className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-xs">
                  <TrendingDown size={14} /> Weakest Subject
                </div>
                <p className="text-xl font-bold text-red-900 capitalize">{weakSubject[0]}</p>
                <p className="text-sm text-red-600/60">Scored {weakSubject[1]}% in this subject.</p>
              </div>
              <div className="p-6 bg-green-50 rounded-3xl space-y-2 border border-green-100">
                <div className="flex items-center gap-2 text-green-600 font-bold uppercase tracking-widest text-xs">
                  <TrendingUp size={14} /> Strongest Subject
                </div>
                <p className="text-xl font-bold text-green-900 capitalize">{topSubject[0]}</p>
                <p className="text-sm text-green-600/60">Scored {topSubject[1]}% in this subject.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-[40px] border border-primary/10 shadow-sm space-y-6"
          >
            <h3 className="text-2xl font-bold text-text flex items-center gap-2">
              <FileText size={24} className="text-primary" /> Performance Summary
            </h3>
            <div className="space-y-4">
              <div className="p-6 bg-background rounded-3xl space-y-3">
                <p className="text-text/80 leading-relaxed italic">
                  "{student.remarks || 'No remarks provided by the fellow.'}"
                </p>
              </div>
              
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-bold text-text/40 uppercase tracking-widest">Fellow Recommendations</h4>
                <div className="space-y-3">
                  {student.averageMarks < 40 && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                      <AlertTriangle className="text-red-600 mt-1 flex-shrink-0" size={18} />
                      <p className="text-sm text-red-900">
                        <strong>At-Risk Alert:</strong> Student needs immediate remedial support in {weakSubject[0]}.
                      </p>
                    </div>
                  )}
                  {student.engagement === 'Low' && (
                    <div className="flex items-start gap-3 p-4 bg-accent/10 rounded-2xl border border-accent/20">
                      <Activity className="text-accent mt-1 flex-shrink-0" size={18} />
                      <p className="text-sm text-text">
                        <strong>Engagement Warning:</strong> Try incorporating more activity-based learning to boost participation.
                      </p>
                    </div>
                  )}
                  {student.averageMarks >= 75 && (
                    <div className="flex items-start gap-3 p-4 bg-secondary/10 rounded-2xl border border-secondary/20">
                      <CheckCircle2 className="text-secondary mt-1 flex-shrink-0" size={18} />
                      <p className="text-sm text-text">
                        <strong>Top Performer:</strong> Encourage participation in peer-mentoring programs.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
