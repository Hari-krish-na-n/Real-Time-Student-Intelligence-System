import React from 'react';
import { Calculator, Calendar, BookOpen, ChevronDown, Save } from 'lucide-react';
import { cn } from '../lib/utils';

const WeeklyTestHeader = ({
  subject = 'Mathematics',
  testDate = new Date().toISOString().split('T')[0],
  maxMarks = 25,
  onSubjectChange = () => {},
  onDateChange = () => {},
  onMaxMarksChange = () => {},
  onSaveAll = () => {},
  isSaving = false
}) => {
  const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Tamil'];

  return (
    <div className="w-full bg-white border-b border-primary/10 px-6 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Calculator size={24} />
            </div>
            <h1 className="text-3xl font-bold text-primary">Weekly Test Marks</h1>
          </div>
          <p className="text-text/60 font-medium ml-13">Enter and manage student performance for weekly assessments.</p>
        </div>

        <button
          onClick={onSaveAll}
          disabled={isSaving}
          className={cn(
            "px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20",
            isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90 hover:scale-[1.02]"
          )}
        >
          <Save size={20} />
          {isSaving ? 'Saving Records...' : 'Save All Marks'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Subject Selector */}
        <div className="relative group">
          <label className="absolute left-4 top-2 text-[10px] font-bold text-text/40 uppercase tracking-widest z-10">Subject</label>
          <div className="relative flex items-center">
            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
            <select
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-background border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none appearance-none font-bold text-text pt-7"
            >
              {subjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text/20 pointer-events-none" size={20} />
          </div>
        </div>

        {/* Date Selector */}
        <div className="relative group">
          <label className="absolute left-4 top-2 text-[10px] font-bold text-text/40 uppercase tracking-widest z-10">Test Date</label>
          <div className="relative flex items-center">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
            <input
              type="date"
              value={testDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-background border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-bold text-text pt-7"
            />
          </div>
        </div>

        {/* Max Marks */}
        <div className="relative group">
          <label className="absolute left-4 top-2 text-[10px] font-bold text-text/40 uppercase tracking-widest z-10">Maximum Marks</label>
          <div className="relative flex items-center">
            <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
            <input
              type="number"
              min="1"
              max="100"
              value={maxMarks}
              onChange={(e) => onMaxMarksChange(parseInt(e.target.value) || 0)}
              className="w-full pl-12 pr-6 py-4 bg-background border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none font-bold text-text pt-7"
              placeholder="e.g. 25"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTestHeader;
