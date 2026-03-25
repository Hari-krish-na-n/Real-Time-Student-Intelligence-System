import React from 'react';
import { ClipboardCheck, Calculator, Calendar, BookOpen, ChevronDown, Save, Users } from 'lucide-react';
import { cn } from '../lib/utils';

const TrackerHeader = ({
  mode = 'attendance', // 'attendance' | 'test'
  setMode,
  date = new Date().toISOString().split('T')[0],
  onDateChange = () => {},
  onSave = () => {},
  isSaving = false,
  // Test specific
  subject = 'Mathematics',
  onSubjectChange = () => {},
  maxMarks = 25,
  onMaxMarksChange = () => {},
  // Attendance specific
  presentCount = 0,
  totalCount = 0,
}) => {
  const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Tamil'];

  return (
    <div className="w-full bg-white border-b border-primary/10 px-6 py-6 space-y-6 sticky top-0 z-30 shadow-sm">
      {/* Top Row: Title and Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-background rounded-2xl border border-primary/5">
            <button
              onClick={() => setMode('attendance')}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all",
                mode === 'attendance' 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-text/40 hover:text-primary"
              )}
            >
              <ClipboardCheck size={18} />
              Attendance
            </button>
            <button
              onClick={() => setMode('test')}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all",
                mode === 'test' 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-text/40 hover:text-primary"
              )}
            >
              <Calculator size={18} />
              Weekly Test
            </button>
          </div>
        </div>

        <button
          onClick={onSave}
          disabled={isSaving}
          className={cn(
            "px-8 py-3 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20",
            isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90 hover:scale-[1.02]"
          )}
        >
          <Save size={20} />
          {isSaving ? 'Saving...' : mode === 'attendance' ? `Submit (${presentCount}/${totalCount})` : 'Save All Marks'}
        </button>
      </div>

      {/* Bottom Row: Context Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Date Selector - Always Visible */}
        <div className="relative group md:col-span-1">
          <label className="absolute left-4 top-2 text-[10px] font-bold text-text/40 uppercase tracking-widest z-10">Date</label>
          <div className="relative flex items-center">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-bold text-text pt-7 text-sm"
            />
          </div>
        </div>

        {mode === 'test' ? (
          <>
            {/* Subject Selector */}
            <div className="relative group md:col-span-2">
              <label className="absolute left-4 top-2 text-[10px] font-bold text-text/40 uppercase tracking-widest z-10">Subject</label>
              <div className="relative flex items-center">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                <select
                  value={subject}
                  onChange={(e) => onSubjectChange(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none appearance-none font-bold text-text pt-7 text-sm"
                >
                  {subjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text/20 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Max Marks */}
            <div className="relative group md:col-span-1">
              <label className="absolute left-4 top-2 text-[10px] font-bold text-text/40 uppercase tracking-widest z-10">Max Marks</label>
              <div className="relative flex items-center">
                <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={maxMarks}
                  onChange={(e) => onMaxMarksChange(parseInt(e.target.value) || 0)}
                  className="w-full pl-12 pr-6 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-bold text-text pt-7 text-sm"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="md:col-span-3 flex items-center px-6 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Attendance Status</p>
                <p className="text-sm font-bold text-primary">{presentCount} out of {totalCount} students present today</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackerHeader;
