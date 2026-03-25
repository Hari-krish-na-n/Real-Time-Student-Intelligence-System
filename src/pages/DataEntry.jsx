import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, User, Phone, Briefcase, MapPin, 
  GraduationCap, Calendar, Activity, FileText, 
  AlertCircle, Calculator, ChevronRight, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const DataEntry = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Student Details
    name: '',
    grade: '',
    age: '',
    gender: 'Male',
    // Parent Details
    parentName: '',
    parentPhone: '',
    parentOccupation: '',
    address: '',
    // Academic Performance
    marks: {
      math: 0,
      science: 0,
      english: 0,
      social: 0
    },
    // Attendance
    attendance: {
      totalDays: 20,
      presentDays: 0
    },
    // Engagement
    engagement: 'Medium',
    remarks: ''
  });

  useEffect(() => {
    if (id) {
      const records = JSON.parse(localStorage.getItem('studentRecords') || '[]');
      const found = records.find(r => r.id === id);
      if (found) {
        setFormData(found);
      }
    }
  }, [id]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Auto-calculations
  const totalMarks = Object.values(formData.marks).reduce((a, b) => a + b, 0);
  const averageMarks = Math.round(totalMarks / Object.keys(formData.marks).length);
  const attendancePercentage = formData.attendance.totalDays > 0 
    ? Math.round((formData.attendance.presentDays / formData.attendance.totalDays) * 100) 
    : 0;

  const handleNext = () => {
    if (step === 1 && !formData.name) {
      setError('Student name is required');
      return;
    }
    setError(null);
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const existingRecords = JSON.parse(localStorage.getItem('studentRecords') || '[]');
    
    if (id) {
      // Update existing record
      const updatedRecords = existingRecords.map(r => 
        r.id === id ? {
          ...formData,
          totalMarks,
          averageMarks,
          attendancePercentage,
          updatedAt: new Date().toISOString()
        } : r
      );
      localStorage.setItem('studentRecords', JSON.stringify(updatedRecords));
    } else {
      // Create new record
      const newRecord = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        totalMarks,
        averageMarks,
        attendancePercentage,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('studentRecords', JSON.stringify([...existingRecords, newRecord]));
    }

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(id ? `/student/${id}` : '/dashboard');
    }, 800);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <User size={20} /> Student Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-xl outline-none"
                  placeholder="e.g. Rahul Kumar"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest">Class / Grade</label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-4 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-xl outline-none"
                  placeholder="e.g. 8th Grade"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-xl outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-xl outline-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <Phone size={20} /> Parent Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest">Parent Name</label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full px-4 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-xl outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest">Phone Number</label>
                <input
                  type="tel"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="w-full px-4 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-xl outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest">Occupation</label>
                <input
                  type="text"
                  value={formData.parentOccupation}
                  onChange={(e) => setFormData({ ...formData, parentOccupation: e.target.value })}
                  className="w-full px-4 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-xl outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-xl outline-none"
                />
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <GraduationCap size={20} /> Academic Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(formData.marks).map(subject => (
                <div key={subject} className="space-y-1">
                  <label className="text-xs font-bold text-text/40 uppercase tracking-widest">{subject}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.marks[subject]}
                    onChange={(e) => setFormData({
                      ...formData,
                      marks: { ...formData.marks, [subject]: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-4 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-xl outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="p-4 bg-primary/5 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest">Average Marks</p>
                <p className="text-2xl font-bold text-primary">{averageMarks}%</p>
              </div>
              <Calculator className="text-primary/20" size={32} />
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <Calendar size={20} /> Attendance & Engagement
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest">Total Working Days</label>
                <input
                  type="number"
                  value={formData.attendance.totalDays}
                  onChange={(e) => setFormData({
                    ...formData,
                    attendance: { ...formData.attendance, totalDays: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-xl outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-text/40 uppercase tracking-widest">Days Present</label>
                <input
                  type="number"
                  value={formData.attendance.presentDays}
                  onChange={(e) => setFormData({
                    ...formData,
                    attendance: { ...formData.attendance, presentDays: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-xl outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-text/40 uppercase tracking-widest">Engagement Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'High'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, engagement: level })}
                    className={cn(
                      "py-3 rounded-xl font-bold text-sm transition-all border-2",
                      formData.engagement === level 
                        ? "bg-primary text-white border-primary" 
                        : "bg-white text-text/40 border-primary/10"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-text/40 uppercase tracking-widest">Additional Notes</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-4 py-3 bg-background border-2 border-transparent focus:border-primary/20 rounded-xl outline-none h-24 resize-none"
                placeholder="Fellow's remarks..."
              />
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">{id ? 'Edit Student Record' : 'Advanced Data Entry'}</h1>
          <p className="text-text/60">Step {step} of 4</p>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className={cn(
                "w-8 h-1 rounded-full transition-all",
                step >= i ? "bg-primary" : "bg-primary/10"
              )} 
            />
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-primary/10 shadow-sm min-h-[500px] flex flex-col">
        <div className="flex-grow">
          {renderStep()}
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-between gap-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-8 py-4 bg-background text-primary rounded-2xl font-bold flex items-center gap-2 hover:bg-secondary/20 transition-all"
            >
              <ChevronLeft size={20} /> Back
            </button>
          )}
          
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="ml-auto px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Next <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="ml-auto px-10 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              {isSubmitting ? 'Saving...' : id ? 'Update Record' : 'Submit Record'} <Save size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataEntry;
