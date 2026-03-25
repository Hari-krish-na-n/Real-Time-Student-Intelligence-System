import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DataEntry from './pages/DataEntry';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import Attendance from './pages/Attendance';
import Tracker from './pages/Tracker';
import StudentProfile from './pages/StudentProfile';
import ErrorBoundary from './components/ErrorBoundary';

// Initial demo data with advanced fields
const DEMO_DATA = [
  { 
    id: '1', name: 'Aarav Sharma', grade: '8th Grade', age: '14', gender: 'Male',
    parentName: 'Ramesh Sharma', parentPhone: '9876543210', parentOccupation: 'Farmer', address: 'Village A',
    marks: { math: 85, science: 78, english: 92, social: 88 },
    attendance: { totalDays: 20, presentDays: 19 },
    engagement: 'High', remarks: 'Excellent performance across all subjects.',
    totalMarks: 343, averageMarks: 86, attendancePercentage: 95,
    timestamp: new Date().toISOString() 
  },
  { 
    id: '2', name: 'Ishaan Gupta', grade: '8th Grade', age: '13', gender: 'Male',
    parentName: 'Suresh Gupta', parentPhone: '9876543211', parentOccupation: 'Shopkeeper', address: 'Village B',
    marks: { math: 35, science: 42, english: 45, social: 38 },
    attendance: { totalDays: 20, presentDays: 14 },
    engagement: 'Low', remarks: 'Needs more focus on core subjects.',
    totalMarks: 160, averageMarks: 40, attendancePercentage: 70,
    timestamp: new Date().toISOString() 
  },
  { 
    id: '3', name: 'Ananya Verma', grade: '8th Grade', age: '14', gender: 'Female',
    parentName: 'Meena Verma', parentPhone: '9876543212', parentOccupation: 'Teacher', address: 'Village A',
    marks: { math: 42, science: 35, english: 55, social: 48 },
    attendance: { totalDays: 20, presentDays: 12 },
    engagement: 'Medium', remarks: 'Shows potential but attendance is an issue.',
    totalMarks: 180, averageMarks: 45, attendancePercentage: 60,
    timestamp: new Date().toISOString() 
  }
];

export default function App() {
  useEffect(() => {
    // Initialize demo data if empty
    const existing = localStorage.getItem('studentRecords');
    if (!existing || JSON.parse(existing).length === 0) {
      localStorage.setItem('studentRecords', JSON.stringify(DEMO_DATA));
    }
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/entry" element={<DataEntry />} />
          <Route path="/entry/:id" element={<DataEntry />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/student/:id" element={
            <ErrorBoundary>
              <StudentProfile />
            </ErrorBoundary>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}
