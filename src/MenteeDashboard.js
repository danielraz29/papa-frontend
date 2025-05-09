import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSignOutAlt, FaUser, FaSearch, FaCalendarAlt } from 'react-icons/fa';

function MenteeDashboard() {
  const [meetings, setMeetings] = useState([]);
  const [hasMentor, setHasMentor] = useState(false); // Simulate no mentor for now
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch meetings from backend or simulate
    // Example mock data:
    const sampleMeetings = [
      {
        date: '2025-05-05',
        time: '10:00',
        description: 'פגישה עם נועה - SQL בסיסי'
      },
      {
        date: '2025-05-10',
        time: '12:00',
        description: 'פגישה עם נועה - חזרה לקראת מבחן'
      }
    ];
    setMeetings(sampleMeetings);
    setHasMentor(true); // Change to false to simulate no mentor assigned
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const handleFindMentor = () => {
    navigate('/mentors');
  };

  return (
    <div className="min-h-screen bg-blue-50 text-right">
      <nav className="bg-white shadow p-4 flex justify-between items-center px-8">
        <div className="text-blue-700 font-bold text-lg flex items-center gap-2">
          <FaCalendarAlt /> לוח חונכות אישי
        </div>
        <div className="flex gap-4 text-sm text-blue-600 items-center">
          <button onClick={() => navigate('/dashboard/mentee')} className="flex items-center gap-1 hover:underline"><FaHome /> דף בית</button>
          <button onClick={() => navigate('/profile')} className="flex items-center gap-1 hover:underline"><FaUser /> הפרופיל שלי</button>
          <button onClick={handleLogout} className="flex items-center gap-1 hover:underline"><FaSignOutAlt /> יציאה</button>
        </div>
      </nav>

      <main className="p-6 max-w-3xl mx-auto">
        {!hasMentor && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded mb-6 text-center">
            עדיין לא שובצת לחונך 🎓 לחץ על “חפש חונכים” כדי להתחיל
            <button onClick={handleFindMentor} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded flex items-center mx-auto"><FaSearch className="ml-2" /> חפש חונכים</button>
          </div>
        )}

        {hasMentor && (
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">יומן מפגשים</h2>
            {meetings.length === 0 ? (
              <p className="text-gray-500">אין מפגשים עתידיים כרגע.</p>
            ) : (
              <ul className="space-y-3">
                {meetings.map((m, idx) => (
                  <li key={idx} className="bg-blue-100 p-3 rounded shadow">
                    <p className="font-bold">📅 {m.date} ⏰ {m.time}</p>
                    <p>{m.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default MenteeDashboard;
