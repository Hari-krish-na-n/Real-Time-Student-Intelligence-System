import React from 'react';

const AttendanceHeader = ({
  school = 'Govt High School XYZ',
  grade = 'Grade 8A',
  status = 'Online',
  onMarkAttendance = () => {},
}) => {
  const date = new Date();
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isOnline = status.toLowerCase() === 'online';

  return (
    <header
      className="w-full h-[120px] px-4 py-3"
      style={{
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      <div className="h-full flex items-center justify-between gap-3">
        <div className="flex flex-col justify-center">
          <div className="text-[24px] font-bold" style={{ color: '#F4A823' }}>
            SeedTrack
          </div>
          <div className="text-[16px] text-slate-500">{school}</div>
        </div>

        <div className="flex flex-col items-center justify-center text-center gap-1">
          <span className="text-[18px] font-medium text-slate-900">{formattedDate}</span>
          <span
            className="px-3 py-1 rounded-full text-[14px] font-semibold text-white"
            style={{ backgroundColor: '#3182ce' }}
          >
            {grade}
          </span>
        </div>

        <div className="flex flex-col justify-center items-end gap-2">
          <button
            onClick={onMarkAttendance}
            className="w-[120px] h-[44px] rounded-[8px] text-[16px] font-bold text-white"
            style={{
              backgroundColor: '#F4A823',
              boxShadow: '0 4px 10px rgba(244, 168, 35, 0.28)',
            }}
          >
            Mark Attendance
          </button>
          <span
            className="text-[12px] font-semibold"
            style={{ color: isOnline ? '#16A34A' : '#6B7280' }}
          >
            <span className="mr-1" style={{ fontSize: '12px' }}>
              {isOnline ? '●' : '●'}
            </span>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AttendanceHeader;
