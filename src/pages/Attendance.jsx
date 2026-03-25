import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Slash, RefreshCcw } from 'lucide-react';

const STORAGE_KEY = 'seedtrack_attendance';

const enrichStudentRecords = (records) => records.map((record, i) => ({
  id: record.id || `s-${i + 1}`,
  name: record.name || `Student ${i + 1}`,
  age: record.age || 14,
  roll: record.roll || (i + 1),
  photo: record.photo || `https://i.pravatar.cc/48?u=${record.id || i + 1}`,
  risk: record.attendancePercentage ? record.attendancePercentage < 75 : false,
  ...record,
}));


const dateKey = () => new Date().toISOString().slice(0, 10);

const openDB = () => new Promise((resolve, reject) => {
  if (!('indexedDB' in window)) {
    resolve(null);
    return;
  }
  const request = indexedDB.open('SeedTrackDB', 1);
  request.onupgradeneeded = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains('attendance')) {
      db.createObjectStore('attendance', { keyPath: 'date' });
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const getAttendanceFromIDB = async (db, date) => {
  if (!db) {
    return null;
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction('attendance', 'readonly');
    const store = tx.objectStore('attendance');
    const request = store.get(date);
    request.onsuccess = () => resolve(request.result?.data || null);
    request.onerror = () => reject(request.error);
  });
};

const saveAttendanceToIDB = async (db, date, data) => {
  if (!db) {
    return;
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction('attendance', 'readwrite');
    const store = tx.objectStore('attendance');
    const request = store.put({ date, data, updatedAt: new Date().toISOString() });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const Attendance = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [attendance, setAttendance] = useState({});
  const [changed, setChanged] = useState(false);
  const [status, setStatus] = useState(navigator.onLine ? 'Online' : 'Offline');
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [db, setDb] = useState(null);
  const [students, setStudents] = useState([]);

  const presentCount = useMemo(() => Object.values(attendance).filter(Boolean).length, [attendance]);
  const currentStudentCount = students.length || 30;
  const progressPercent = Math.round((presentCount / (currentStudentCount || 1)) * 100);
  const todayDisplay = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }), []);

  const setStudentStatus = (id, value) => {
    setAttendance((prev) => {
      const next = { ...prev, [id]: value };
      setChanged(true);
      if (navigator.vibrate) navigator.vibrate(20);
      return next;
    });
  };

  const loadAttendance = useCallback(async () => {
    const currentDate = dateKey();
    let saved = null;
    if (db) {
      try {
        saved = await getAttendanceFromIDB(db, currentDate);
      } catch (err) {
        console.warn('IDB read failed', err);
      }
    }
    if (!saved) {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')[currentDate] || {};
    }
    if (saved) setAttendance(saved);
  }, [db]);

  const loadStudents = useCallback(() => {
    const records = JSON.parse(localStorage.getItem('studentRecords') || '[]');
    if (Array.isArray(records) && records.length > 0) {
      setStudents(enrichStudentRecords(records));
    } else {
      setStudents([]);
    }
  }, []);


  const saveAll = useCallback(async () => {
    const currentDate = dateKey();
    const data = attendance;
    if (db) {
      try {
        await saveAttendanceToIDB(db, currentDate, data);
      } catch (err) {
        console.warn('IDB save failed', err);
      }
    }
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    all[currentDate] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    setChanged(false);
    setMessage('Saved locally. Will sync when online.');
  }, [attendance, db]);

  const syncIfOnline = useCallback(async () => {
    if (navigator.onLine && changed) {
      setSyncing(true);
      await new Promise((res) => setTimeout(res, 800));
      setSyncing(false);
      setStatus('Online');
      setMessage('Synced all attendance data.');
      setChanged(false);
    }
  }, [changed]);

  useEffect(() => {
    openDB().then(setDb).catch((err) => {
      console.warn('IndexedDB not available', err);
      setDb(null);
    });
    const handleOnline = () => { setStatus('Online'); setMessage('Back online, syncing...'); };
    const handleOffline = () => { setStatus('Offline'); setMessage('You are offline'); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    if (db) loadAttendance();
  }, [db, loadAttendance]);

  useEffect(() => {
    if (navigator.onLine) syncIfOnline();
  }, [status, syncIfOnline]);

  const isSubmitDisabled = !changed;

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <header className="fixed top-0 left-0 right-0 h-[120px] border-b border-slate-200 bg-white z-20 px-4 py-2 shadow-sm">
        <div className="flex items-center justify-between h-full">
          <div className="flex flex-col justify-center">
            <div className="text-[20px] font-bold" style={{ color: '#F4A823' }}>SeedTrack</div>
            <div className="text-sm text-slate-600">Govt HS Avadi</div>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-[18px] font-medium text-slate-900">{todayDisplay}</div>
            <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold text-blue-700">{language === 'ta' ? 'தரம் 8A' : 'Grade 8A'}</div>
          </div>
          <div className="flex flex-col items-end justify-center gap-2">
            <button
              onClick={saveAll}
              disabled={isSubmitDisabled}
              className="w-[140px] h-11 rounded-lg text-sm font-bold text-white"
              style={{
                backgroundColor: isSubmitDisabled ? '#fcd19a' : '#F4A823',
                boxShadow: isSubmitDisabled ? 'none' : '0 4px 10px rgba(244, 168, 35, 0.35)',
              }}
            >
              ✓ {presentCount}/{currentStudentCount} Present
            </button>
            <div className="text-[12px] flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: status === 'Online' ? '#10B981' : '#6B7280' }}></span>
              {status}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-[130px] pb-[100px] px-4">
        <div className="mb-4">
          <h1 className="text-2xl font-black" style={{ color: '#F4A823' }}>
            {language === 'ta' ? 'இன்றைய வந்துகை - வகுப்பு 8A' : "Today's Attendance - Grade 8A"}
          </h1>
        </div>

        <div className="mb-4 h-4 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="text-sm font-semibold mb-3">{presentCount}/{currentStudentCount} Present ({progressPercent}%)</div>

        <div className="space-y-3">
          {students.map((student) => {
            const isPresent = attendance[student.id] === true;
            const isAbsent = attendance[student.id] === false;
            return (
              <div
                key={student.id}
                className={`rounded-xl p-3 shadow-sm bg-slate-50 ${isPresent ? 'border-l-4 border-emerald-500 bg-emerald-50' : ''} ${isAbsent ? 'border-l-4 border-red-500 bg-red-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <img src={student.photo} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[18px] truncate">{student.name} ({student.age})</p>
                    <p className="text-sm text-slate-600">Roll: {student.roll}</p>
                    {student.risk && (
                      <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-red-600">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        {language === 'ta' ? 'அழையாத நோய்' : 'Frequent absent risk'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setStudentStatus(student.id, true)}
                    className="h-12 rounded-lg text-base font-semibold text-white"
                    style={{ backgroundColor: '#10B981', minHeight: '48px' }}
                  >
                    {language === 'ta' ? 'வரினார்' : 'Present'}
                  </button>
                  <button
                    onClick={() => setStudentStatus(student.id, false)}
                    className="h-12 rounded-lg text-base font-semibold text-white"
                    style={{ backgroundColor: '#EF4444', minHeight: '48px' }}
                  >
                    {language === 'ta' ? 'இல்லை' : 'Absent'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={saveAll}
            disabled={isSubmitDisabled}
            className="flex-1 h-11 rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: isSubmitDisabled ? '#fcd19a' : '#F4A823' }}
          >
            {language === 'ta' ? 'அனைத்தையும் சமர்ப்பிக்க' : 'Submit All'}
          </button>
          <button
            onClick={() => {
              if (navigator.onLine) {
                setMessage('Already online. Data is synced.');
                syncIfOnline();
              } else {
                setMessage('கணினி இணைக்கப்பட்டதில்லை. இணையத்தில் இணைந்து மீண்டும் முயலவும்');
              }
            }}
            className="flex-1 h-11 rounded-lg border border-slate-300 bg-slate-50 text-sm font-bold text-slate-700"
          >
            {language === 'ta' ? 'இணைபில் ஒருங்கிணைப்பு' : 'Sync When Online'}
          </button>
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
          <span>{syncing ? 'Syncing...' : message}</span>
          <span>{language === 'ta' ? 'தமிழ்/ஆங்கிலம்' : 'Tamil/English'}</span>
          <button onClick={() => setLanguage((l) => (l === 'en' ? 'ta' : 'en'))} className="text-blue-600 font-bold underline text-xs">{language === 'en' ? 'தமிழ்' : 'English'}</button>
        </div>
      </footer>
    </div>
  );
};

export default Attendance;
