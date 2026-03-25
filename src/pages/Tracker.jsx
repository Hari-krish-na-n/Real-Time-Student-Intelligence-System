import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, AlertCircle, ChevronRight, 
  Slash, RefreshCcw, User, Phone, Briefcase, MapPin, 
  GraduationCap, Calendar, Activity, FileText, 
  TrendingUp, TrendingDown, ClipboardCheck, Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import TrackerHeader from '../components/TrackerHeader';

const STORAGE_KEY_ATTENDANCE = 'seedtrack_attendance';

const Tracker = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('attendance'); // 'attendance' | 'test'
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Attendance State
  const [attendance, setAttendance] = useState({});
  const [isAttendanceChanged, setIsAttendanceChanged] = useState(false);

  // Weekly Test State
  const [subject, setSubject] = useState('Mathematics');
  const [testMarks, setTestMarks] = useState({}); // { studentId: score }
  const [maxMarks, setMaxMarks] = useState(25);
  const [isTestChanged, setIsTestChanged] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load initial data
  useEffect(() => {
    const existingRecords = JSON.parse(localStorage.getItem('studentRecords') || '[]');
    setRecords(existingRecords);

    // Load attendance for current date
    const storedAttendance = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
    let allAttendance = {};
    try {
      allAttendance = JSON.parse(storedAttendance || '{}');
      if (typeof allAttendance !== 'object' || allAttendance === null) allAttendance = {};
    } catch (e) {
      allAttendance = {};
    }
    
    if (allAttendance[date]) {
      setAttendance(allAttendance[date]);
    } else {
      setAttendance({});
    }

    // Reset test marks when date or subject changes
    setTestMarks({});
    setIsTestChanged(false);
  }, [date, subject]);

  const presentCount = useMemo(() => 
    Object.values(attendance).filter(val => val === true).length
  , [attendance]);

  const totalCount = records.length;

  const handleAttendanceChange = (id, isPresent) => {
    setAttendance(prev => ({ ...prev, [id]: isPresent }));
    setIsAttendanceChanged(true);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const handleMarkChange = (id, score) => {
    const numericScore = Math.min(maxMarks, Math.max(0, parseInt(score) || 0));
    setTestMarks(prev => ({ ...prev, [id]: numericScore }));
    setIsTestChanged(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('Saving data...');

    if (mode === 'attendance') {
      const allAttendance = JSON.parse(localStorage.getItem(STORAGE_KEY_ATTENDANCE) || '{}');
      allAttendance[date] = attendance || {};
      localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(allAttendance));
      setIsAttendanceChanged(false);
      setMessage('Attendance saved successfully!');
    } else {
      // Consistent Subject Mapping to Data Keys
      const subjectMapping = {
        'Mathematics': 'math',
        'Science': 'science',
        'English': 'english',
        'Social Studies': 'social',
        'Tamil': 'tamil'
      };
      const subjectKey = subjectMapping[subject] || subject.toLowerCase();

      // Save Test Marks
      const updatedRecords = records.map(student => {
        if (testMarks[student.id] !== undefined) {
          const currentMarks = student.marks || { math: 0, science: 0, english: 0, social: 0, tamil: 0 };
          const newMarks = { 
            ...currentMarks, 
            [subjectKey]: Math.round((testMarks[student.id] / (maxMarks || 1)) * 100) 
          };
          
          const marksValues = Object.values(newMarks);
          const totalMarks = marksValues.reduce((a, b) => a + (parseInt(b) || 0), 0);
          const averageMarks = Math.round(totalMarks / (marksValues.length || 1));
          
          return { 
            ...student, 
            marks: newMarks,
            totalMarks,
            averageMarks,
            updatedAt: new Date().toISOString()
          };
        }
        return student;
      });

      localStorage.setItem('studentRecords', JSON.stringify(updatedRecords));
      setRecords(updatedRecords);
      setIsTestChanged(false);
      setMessage('Weekly test marks updated successfully!');
    }

    setTimeout(() => {
      setIsSaving(false);
      setMessage('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <TrackerHeader
        mode={mode}
        setMode={setMode}
        date={date}
        onDateChange={setDate}
        onSave={handleSave}
        isSaving={isSaving}
        subject={subject}
        onSubjectChange={setSubject}
        maxMarks={maxMarks}
        onMaxMarksChange={setMaxMarks}
        presentCount={presentCount}
        totalCount={totalCount}
      />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-primary text-white rounded-2xl text-center font-bold shadow-lg"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {records.map((student, idx) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "p-4 rounded-3xl border-2 transition-all flex items-center justify-between gap-6",
                mode === 'attendance' 
                  ? (attendance[student.id] === true ? "bg-green-50 border-green-200" : attendance[student.id] === false ? "bg-red-50 border-red-200" : "bg-white border-primary/5 shadow-sm")
                  : "bg-white border-primary/5 shadow-sm hover:border-primary/20"
              )}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {student.name?.charAt(0) || 'S'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-text truncate">{student.name || 'Unnamed Student'}</h3>
                  <p className="text-xs text-text/40 font-medium">{student.grade || 'No Grade'}</p>
                </div>
              </div>

              <div className="flex-shrink-0">
                {mode === 'attendance' ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAttendanceChange(student.id, true)}
                      className={cn(
                        "w-24 py-3 rounded-xl font-bold text-sm transition-all",
                        attendance[student.id] === true 
                          ? "bg-green-500 text-white shadow-lg shadow-green-200" 
                          : "bg-white border-2 border-green-500 text-green-500 hover:bg-green-50"
                      )}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleAttendanceChange(student.id, false)}
                      className={cn(
                        "w-24 py-3 rounded-xl font-bold text-sm transition-all",
                        attendance[student.id] === false 
                          ? "bg-red-500 text-white shadow-lg shadow-red-200" 
                          : "bg-white border-2 border-red-500 text-red-500 hover:bg-red-50"
                      )}
                    >
                      Absent
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-text/40 uppercase tracking-widest">Score</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={maxMarks}
                          value={testMarks[student.id] || ''}
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
                          className="w-16 h-10 bg-background border-2 border-primary/10 focus:border-primary/40 rounded-xl outline-none text-center font-bold text-primary"
                          placeholder="0"
                        />
                        <span className="text-sm font-bold text-text/40">/ {maxMarks}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Floating Action Bar */}
      {(isAttendanceChanged || isTestChanged) && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
        >
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-12 py-4 bg-primary text-white rounded-[24px] font-bold shadow-2xl shadow-primary/40 flex items-center gap-3 hover:scale-105 transition-all"
          >
            <Save size={20} />
            Save Changes
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Tracker;
