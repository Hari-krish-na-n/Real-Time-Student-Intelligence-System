import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lightbulb, AlertCircle, CheckCircle2, TrendingDown, 
  TrendingUp, Users, Calendar, Sparkles, BookOpen, 
  Target, GraduationCap, ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const Insights = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const existingRecords = JSON.parse(localStorage.getItem('studentRecords') || '[]');
    setRecords(existingRecords);
  }, []);

  const insights = useMemo(() => {
    if (records.length === 0) return [];

    const results = [];
    const total = records.length;
    
    // Subject-wise analysis
    const subjectTotals = { math: 0, science: 0, english: 0, social: 0 };
    const subjectWeakCount = { math: 0, science: 0, english: 0, social: 0 };
    
    records.forEach(r => {
      Object.entries(r.marks).forEach(([sub, score]) => {
        subjectTotals[sub] += score;
        if (score < 40) subjectWeakCount[sub]++;
      });
    });

    const subjectAverages = Object.entries(subjectTotals).map(([sub, totalScore]) => ({
      subject: sub,
      avg: Math.round(totalScore / total)
    }));

    const weakestSubject = subjectAverages.reduce((min, curr) => curr.avg < min.avg ? curr : min);
    const topPerformers = [...records].sort((a, b) => b.averageMarks - a.averageMarks).slice(0, 3);
    const lowAttendance = records.filter(r => r.attendancePercentage < 75);

    // 1. Subject Focus Insight
    results.push({
      type: 'focus',
      subject: weakestSubject.subject,
      title: `Focus more on ${weakestSubject.subject.charAt(0).toUpperCase() + weakestSubject.subject.slice(1)} for this class`,
      description: `The class average in ${weakestSubject.subject} is only ${weakestSubject.avg}%. Consider extra sessions.`,
      icon: Target,
      color: 'bg-accent/10 text-accent border-accent/20',
      action: 'View Subject Report'
    });

    // 2. Subject Weakness Count
    Object.entries(subjectWeakCount).forEach(([sub, count]) => {
      if (count > 0) {
        results.push({
          type: 'improvement',
          subject: sub,
          title: `${count} students need improvement in ${sub.charAt(0).toUpperCase() + sub.slice(1)}`,
          description: `These students scored below 40% in ${sub}. Targeted remedial support is needed.`,
          icon: BookOpen,
          color: 'bg-red-50 text-red-600 border-red-100',
          action: 'Identify Students'
        });
      }
    });

    // 3. Attendance Insight
    if (lowAttendance.length > 0) {
      results.push({
        type: 'attendance',
        title: `${lowAttendance.length} students have low attendance`,
        description: `These students have attendance below 75%. This is strongly correlated with poor performance.`,
        icon: Calendar,
        color: 'bg-secondary/10 text-secondary border-secondary/20',
        action: 'View Attendance'
      });
    }

    return { results, topPerformers, weakestSubject };
  }, [records]);

  return (
    <div className="space-y-12 py-8 px-4">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-primary rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-primary/20">
          <Lightbulb size={32} />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-primary">Insights & Recommendations</h1>
          <p className="text-text/60 font-medium">AI-driven teaching decisions for better student outcomes.</p>
        </div>
      </div>

      {records.length === 0 ? (
        <div className="bg-white p-20 rounded-[60px] border border-primary/10 text-center space-y-6">
          <Sparkles size={64} className="mx-auto text-primary/10" />
          <h3 className="text-2xl font-bold text-text">No Data to Analyze</h3>
          <p className="text-text/60 max-w-md mx-auto text-lg">
            Add student records to generate actionable insights and teaching recommendations.
          </p>
          <Link to="/entry" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all">
            Add Records <ArrowRight size={20} />
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Insights Column */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-text/40 uppercase tracking-widest px-4">Priority Recommendations</h3>
            <div className="grid gap-6">
              {insights.results.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "p-8 rounded-[40px] border-2 flex flex-col md:flex-row gap-6 shadow-sm group",
                    insight.color
                  )}
                >
                  <div className="p-4 bg-white rounded-[24px] shadow-sm flex-shrink-0 h-fit">
                    <insight.icon size={32} />
                  </div>
                  <div className="space-y-4 flex-grow">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold leading-tight text-text">{insight.title}</h3>
                      <p className="text-text/70 text-lg leading-relaxed">{insight.description}</p>
                    </div>
                    <button 
                      onClick={() => {
                        if (insight.type === 'attendance') {
                          navigate('/dashboard', { state: { filter: 'at-risk' } });
                        } else if (insight.type === 'improvement' || insight.type === 'focus') {
                          navigate('/dashboard', { state: { sortBy: insight.subject } });
                        }
                      }}
                      className="px-6 py-3 bg-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all w-fit flex items-center gap-2 text-text"
                    >
                      {insight.action} <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar: Top Performers & Quick Stats */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[40px] border border-primary/10 shadow-sm space-y-6"
            >
              <h3 className="text-xl font-bold text-text flex items-center gap-2">
                <GraduationCap size={24} className="text-primary" /> Top Performers
              </h3>
              <div className="space-y-4">
                {insights.topPerformers.map((student, i) => (
                  <Link 
                    key={student.id} 
                    to={`/student/${student.id}`}
                    className="flex items-center justify-between p-4 bg-background rounded-3xl hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <span className="font-bold text-text group-hover:text-primary">{student.name}</span>
                    </div>
                    <span className="text-lg font-bold text-primary">{student.averageMarks}%</span>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-primary p-8 rounded-[40px] text-white space-y-6"
            >
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Target size={24} /> Strategic Focus
              </h3>
              <div className="space-y-4">
                <p className="text-white/80 leading-relaxed">
                  The class is struggling most with <strong>{insights.weakestSubject.subject}</strong>. 
                  We recommend allocating 20% more time to this subject next week.
                </p>
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">Target Improvement</p>
                  <p className="text-2xl font-bold">+15% Average Score</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
