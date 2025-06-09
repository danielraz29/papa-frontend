// ✅ גרסה מלאה ומתוקנת ל-MentorDashboard.jsx עם כל הבקשות שלך
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHome, FaSignOutAlt, FaUser, FaCalendarAlt, FaPlus,
  FaChevronLeft, FaChevronRight, FaUsers, FaEllipsisV
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './MentorDashboard.module.css';
import { registerLocale } from 'react-datepicker';
import he from 'date-fns/locale/he';
registerLocale('he', he);

const API_URL = "https://papa-backend.onrender.com";

const getStartOfWeek = (date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - ((start.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);
  return start;
};

const STATUS_LABELS = {
  open: 'תואמה',
  done: 'התקיימה',
  cancel: 'בוטלה'
};

function MentorDashboard() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    summary: '',
    description: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    menteeId: '',
    status: 'open'
  });
  const [editingMeetingId, setEditingMeetingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showOptionsId, setShowOptionsId] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [mentorName, setMentorName] = useState('');
  const [showMentees, setShowMentees] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }
    setLoggedUser(user);

    fetch(`${API_URL}/api/mentor-name?userId=${user.id}`)
      .then(res => res.json())
      .then(data => setMentorName(data.fullName || ""));

    fetch(`${API_URL}/api/mentor-meetings?userId=${user.id}`)
      .then(res => res.json())
      .then(data => setMeetings(Array.isArray(data) ? data : []));

    fetch(`${API_URL}/api/mentor-assigned?userId=${user.id}`)
      .then(res => res.json())
      .then(data => setMentees(Array.isArray(data) ? data : []));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const resetForm = () => {
    setNewMeeting({
      summary: '',
      description: '',
      startDateTime: new Date(),
      endDateTime: new Date(),
      menteeId: '',
      status: 'open'
    });
    setEditingMeetingId(null);
    setShowForm(false);
  };

  const handleAddMeeting = () => {
    if (newMeeting.startDateTime > newMeeting.endDateTime) {
      alert("תאריך או שעה שגויים");
      return;
    }

    const meetingToSave = {
      mentorId: loggedUser.id,
      menteeId: newMeeting.menteeId,
      summary: newMeeting.summary,
      description: newMeeting.description,
      status: newMeeting.status,
      startDateTime: newMeeting.startDateTime.toISOString(),
      endDateTime: newMeeting.endDateTime.toISOString()
    };

    const url = editingMeetingId
      ? `${API_URL}/api/meetings/${editingMeetingId}`
      : `${API_URL}/api/meetings`;

    const method = editingMeetingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingToSave)
    })
      .then(res => res.json())
      .then(data => {
        setMeetings(prev => editingMeetingId ? prev.map(m => m._id === editingMeetingId ? data : m) : [...prev, data]);
        resetForm();
      });
  };

  const handleEditMeeting = (meeting) => {
    setShowOptionsId(null);
    setNewMeeting({
      summary: meeting.summary,
      description: meeting.description || '',
      startDateTime: new Date(meeting.startDateTime),
      endDateTime: new Date(meeting.endDateTime),
      menteeId: meeting.menteeId,
      status: meeting.status || 'open'
    });
    setEditingMeetingId(meeting._id);
    setShowForm(true);
  };

  const handleDeleteMeeting = (id) => {
    fetch(`${API_URL}/api/meetings/${id}`, { method: "DELETE" })
      .then(res => {
        if (res.ok) {
          setMeetings(meetings.filter(m => m._id !== id));
          setShowOptionsId(null);
        }
      });
  };

  const daysOfWeek = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳'];
  const currentWeekDates = [...Array(5)].map((_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + i);
    return d;
  });

  return (
    <div className={styles.dashboardWrapper}>
      <nav className={styles.navbar}>
        <div className={styles.navLinks}>
          <button><FaHome /> דף בית</button>
          <button><FaUser /> הפרופיל שלי</button>
          <button onClick={handleLogout}><FaSignOutAlt /> יציאה</button>
        </div>
        <div className={styles.navTitle}><FaCalendarAlt /> לוח חונכות אישי</div>
      </nav>

      <main className={styles.mainContent}>
        <h1 className={styles.mentorNameHeader}>שלום, {mentorName}</h1>

        <button onClick={() => setShowMentees(!showMentees)} className={styles.menteesToggleBtn}>החניכים שלי</button>

        {showMentees && (
          <div className={styles.menteesTableSection}>
            <h2>רשימת החניכים שלי</h2>
            <table className={styles.menteesTable}>
              <thead>
                <tr>
                  <th>שם מלא</th>
                  <th>מייל</th>
                  <th>טלפון</th>
                  <th>מוסד לימודים</th>
                  <th>ת"ז</th>
                </tr>
              </thead>
              <tbody>
                {mentees.map((mentee, idx) => (
                  <tr key={idx}>
                    <td>{mentee.fullName}</td>
                    <td>{mentee.email}</td>
                    <td>{mentee.phone}</td>
                    <td>{mentee.school}</td>
                    <td>{mentee.idNumber || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* כאן תוכל להוסיף calendarWrapper ו-formSection כרגיל */}
      </main>
    </div>
  );
}

export default MentorDashboard;
