// MentorDashboard.jsx
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
      .then(data => setMentorName(data.fullName || ""))
      .catch(() => setMentorName(""));

    fetch(`${API_URL}/api/mentor-meetings?userId=${user.id}`)
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setMeetings(data) : setMeetings([]))
      .catch(() => setMeetings([]));

    fetch(`${API_URL}/api/mentor-assigned?userId=${user.id}`)
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setMentees(data) : setMentees([]))
      .catch(() => setMentees([]));
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
    if (
      newMeeting.startDateTime > newMeeting.endDateTime ||
      newMeeting.startDateTime.toDateString() !== newMeeting.endDateTime.toDateString()
    ) {
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
        if (editingMeetingId) {
          setMeetings(meetings.map(m => (m._id === editingMeetingId ? data : m)));
        } else {
          setMeetings(prev => [...prev, data]);
        }
        resetForm();
      });
  };

  const handleEditMeeting = (meeting) => {
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
    fetch(`${API_URL}/api/meetings/${id}`, {
      method: "DELETE",
    }).then(res => {
      if (res.ok) {
        setMeetings(meetings.filter(m => m._id !== id));
        setShowOptionsId(null);
      } else {
        alert("שגיאה במחיקה");
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
          <button onClick={() => setShowMentees(!showMentees)}><FaUsers /> החניכים שלי</button>
          <button onClick={handleLogout}><FaSignOutAlt /> יציאה</button>
        </div>
        <div className={styles.navTitle}><FaCalendarAlt /> לוח חונכות אישי</div>
      </nav>

      <main className={styles.mainContent}>
        <h1 className={styles.mentorNameHeader}>שלום, {mentorName}</h1>

        <div className={styles.calendarWrapper}>
          <div className={styles.calendarTopBarRight}>
            <h2 className={styles.calendarTitle}>היומן שלי</h2>
            <div className={styles.calendarControlsInline}>
              <button onClick={() => setCurrentWeekStart(new Date(currentWeekStart.setDate(currentWeekStart.getDate() - 7)))}><FaChevronRight /></button>
              <span>{currentWeekStart.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}</span>
              <button onClick={() => setCurrentWeekStart(new Date(currentWeekStart.setDate(currentWeekStart.getDate() + 7)))}><FaChevronLeft /></button>
            </div>
            <button onClick={() => setShowForm(!showForm)} className={styles.addMeetingButtonBlue}><FaPlus /> {editingMeetingId ? "עדכן פגישה" : "הוסף פגישה"}</button>
          </div>

          <div className={styles.calendarHeader}>
            {currentWeekDates.map((date, idx) => (
              <div key={idx} className={styles.dayColumnHeader}>
                <div>{daysOfWeek[idx]}</div>
                <div className={styles.dayDate}>{date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })}</div>
              </div>
            ))}
          </div>

          <div className={styles.calendarGrid}>
            {currentWeekDates.map((date, colIdx) => (
              <div key={colIdx} className={styles.dayColumn}>
                {meetings.filter(m => new Date(m.startDateTime).toDateString() === date.toDateString()).map((m, idx) => (
                  <div key={idx} className={styles.meetingBlock}>
                    <div className={styles.meetingInfo}>
                      <div className={styles.meetingHeader}>
                        <FaEllipsisV
                          className={styles.optionsIcon}
                          onClick={() => setShowOptionsId(m._id === showOptionsId ? null : m._id)}
                        />
                        {showOptionsId === m._id && (
                          <div className={styles.optionsMenu}>
                            <button onClick={() => handleEditMeeting(m)}>✏️ ערוך</button>
                            <button onClick={() => handleDeleteMeeting(m._id)}>🗑 מחק</button>
                          </div>
                        )}
                      </div>
                      <strong>
                        {new Date(m.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        {' - '}
                        {new Date(m.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </strong>
                      <span>
                        {m.summary}<br />
                        {mentees.find(mt => mt.menteeId === m.menteeId)?.fullName ? `עם ${mentees.find(mt => mt.menteeId === m.menteeId)?.fullName}` : ''}<br />
                        סטטוס: {m.status || '—'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {showForm && (
            <div className={styles.formSection}>
              <label>נושא הפגישה</label>
              <input
                type="text"
                value={newMeeting.summary}
                onChange={e => setNewMeeting({ ...newMeeting, summary: e.target.value })}
              />
              <label>תיאור הפגישה</label>
              <textarea
                rows="3"
                value={newMeeting.description}
                onChange={e => setNewMeeting({ ...newMeeting, description: e.target.value })}
              />
              <label>סטטוס</label>
              <select
                value={newMeeting.status}
                onChange={e => setNewMeeting({ ...newMeeting, status: e.target.value })}
              >
                <option value="open">תואמה</option>
                <option value="done">התקיימה</option>
                <option value="cancel">בוטלה</option>
              </select>
              <label>בחר חניך</label>
              <select
                className={styles.input}
                value={newMeeting.menteeId}
                onChange={e => setNewMeeting({ ...newMeeting, menteeId: e.target.value })}
              >
                <option value="">-- בחר חניך --</option>
                {mentees.map((m, idx) => (
                  <option key={idx} value={m.menteeId}>{m.fullName}</option>
                ))}
              </select>
              <div className={styles.dateRow}>
                <div>
                  <label>התחלה</label>
                  <DatePicker
                    locale="he"
                    selected={newMeeting.startDateTime}
                    onChange={(date) => setNewMeeting({ ...newMeeting, startDateTime: date })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="Pp"
                  />
                </div>
                <div>
                  <label>סיום</label>
                  <DatePicker
                    locale="he"
                    selected={newMeeting.endDateTime}
                    onChange={(date) => setNewMeeting({ ...newMeeting, endDateTime: date })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="Pp"
                  />
                </div>
              </div>
              <button className={styles.saveButton} onClick={handleAddMeeting}>{editingMeetingId ? "עדכן פגישה" : "שמור פגישה"}</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MentorDashboard;
