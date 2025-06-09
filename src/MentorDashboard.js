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
  return start;
};

function MentorDashboard() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    summary: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    menteeId: ''
  });
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

    fetch(`${API_URL}/api/mentor-name?mentorId=${user.id}`)
      .then(res => res.json())
      .then(data => setMentorName(data.fullName || ""))
      .catch(() => setMentorName(""));

    fetch(`${API_URL}/api/mentor-meetings?mentorId=${user.id}`)
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setMeetings(data) : setMeetings([]))
      .catch(() => setMeetings([]));

    fetch(`${API_URL}/api/mentor-assigned?mentorId=${user.id}`)
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setMentees(data) : setMentees([]))
      .catch(() => setMentees([]));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
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
      startDateTime: newMeeting.startDateTime,
      endDateTime: newMeeting.endDateTime
    };

    fetch(`${API_URL}/api/meetings`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingToSave)
    })
      .then(res => res.json())
      .then(data => {
        setMeetings(prev => [...prev, data]);
        setShowForm(false);
      });
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
        <div className={styles.navTitle}><FaCalendarAlt /> לוח חונכות אישי</div>
        <div className={styles.navLinks}>
          <button><FaHome /> דף בית</button>
          <button><FaUser /> הפרופיל שלי</button>
          <button onClick={() => setShowMentees(!showMentees)}><FaUsers /> החניכים שלי</button>
          <button onClick={handleLogout}><FaSignOutAlt /> יציאה</button>
        </div>
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
            <button onClick={() => setShowForm(!showForm)} className={styles.addMeetingButtonBlue}><FaPlus /> הוסף פגישה</button>
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
                        {mentees.find(mt => mt.menteeId === m.menteeId)?.fullName
                          ? `עם ${mentees.find(mt => mt.menteeId === m.menteeId)?.fullName}`
                          : ''}
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
              <button className={styles.saveButton} onClick={handleAddMeeting}>שמור פגישה</button>
            </div>
          )}
        </div>

        {showMentees && (
          <div className={styles.menteesTableSection}>
            <h2>רשימת החניכים שלי</h2>
            <table className={styles.menteesTable}>
              <thead>
                <tr>
                  <th>שם מלא</th>
                  <th>מייל</th>
                  <th>מספר טלפון</th>
                  <th>מוסד לימודים</th>
                  <th>תעודת זהות</th>
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
      </main>
    </div>
  );
}

export default MentorDashboard;
