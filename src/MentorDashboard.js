// MentorDashboard.jsx - גרסה סופית מתוקנת
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
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 0 : -day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
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
    summary: '', description: '', startDateTime: new Date(),
    endDateTime: new Date(), menteeId: '', status: 'open'
  });
  const [editingMeetingId, setEditingMeetingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showOptionsId, setShowOptionsId] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [mentorName, setMentorName] = useState('');
  const [showMentees, setShowMentees] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/");
    setLoggedUser(user);

    fetch(`${API_URL}/api/mentor-name?userId=${user.id}`)
      .then(res => res.json()).then(data => setMentorName(data.fullName || ""));

    fetch(`${API_URL}/api/mentor-meetings?userId=${user.id}`)
      .then(res => res.json()).then(data => setMeetings(Array.isArray(data) ? data : []));

    fetch(`${API_URL}/api/mentor-assigned?userId=${user.id}`)
      .then(res => res.json()).then(data => setMentees(Array.isArray(data) ? data : []));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const resetForm = () => {
    setNewMeeting({ summary: '', description: '', startDateTime: new Date(), endDateTime: new Date(), menteeId: '', status: 'open' });
    setEditingMeetingId(null);
    setShowForm(false);
  };

  const handleAddMeeting = () => {
    if (newMeeting.startDateTime > newMeeting.endDateTime) {
      alert("תאריך או שעה שגויים"); return;
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
    const url = editingMeetingId ? `${API_URL}/api/meetings/${editingMeetingId}` : `${API_URL}/api/meetings`;
    const method = editingMeetingId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingToSave)
    }).then(res => res.json()).then(data => {
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
      .then(res => res.ok && setMeetings(meetings.filter(m => m._id !== id)));
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

        <div className={styles.calendarTopBarRight}>
  <h2 className={styles.calendarTitle}>היומן שלי</h2>

  <div className={styles.calendarControlsInline}>
    <button onClick={() => setCurrentWeekStart(getStartOfWeek(new Date(currentWeekStart.setDate(currentWeekStart.getDate() - 7))))}>
      <FaChevronRight />
    </button>
    <span>{currentWeekStart.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}</span>
    <button onClick={() => setCurrentWeekStart(getStartOfWeek(new Date(currentWeekStart.setDate(currentWeekStart.getDate() + 7))))}>
      <FaChevronLeft />
    </button>
  </div>

  <button
    onClick={() => {
      if (editingMeetingId) resetForm();
      else setShowForm(!showForm);
    }}
    className={styles.addMeetingButtonBlue}
  >
    <FaPlus /> {editingMeetingId ? "ביטול שינויים" : "הוסף פגישה"}
  </button>
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
                        {mentees.find(mt => mt.menteeId === m.menteeId)?.fullName && `עם ${mentees.find(mt => mt.menteeId === m.menteeId)?.fullName}`}<br />
                        סטטוס: {STATUS_LABELS[m.status] || m.status}
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
                className={styles.input}
                type="text"
                value={newMeeting.summary}
                onChange={e => setNewMeeting({ ...newMeeting, summary: e.target.value })}
              />
              <label>תיאור הפגישה</label>
              <textarea
                className={styles.input}
                rows="3"
                value={newMeeting.description}
                onChange={e => setNewMeeting({ ...newMeeting, description: e.target.value })}
              />
              <label>סטטוס</label>
              <select
                className={styles.input}
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
