// MenteeDashboard.jsx with backend integration for fetching/saving meetings and assignments
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHome, FaSignOutAlt, FaUser, FaSearch,
  FaCalendarAlt, FaPlus, FaEllipsisV,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './MenteeDashboard.module.css';
import { registerLocale } from 'react-datepicker';
import he from 'date-fns/locale/he';
registerLocale('he', he);

const getStartOfWeek = (date) => {
  const start = new Date(date);
  start.setDate(date.getDate() - ((start.getDay() + 6) % 7));
  return start;
};

function MenteeDashboard() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [hasMentor, setHasMentor] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showOptionsId, setShowOptionsId] = useState(null);
  const [newMeeting, setNewMeeting] = useState({
    summary: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    mentorId: ''
  });

  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }
    setLoggedUser(user);

    fetch(`http://localhost:8000/api/meetings?menteeId=${user.id}`)
      .then(res => res.json())
      .then(data => setMeetings(data));

    fetch(`http://localhost:8000/api/mentor-requests?menteeId=${user.id}&status=in%20progress`)
      .then(res => res.json())
      .then(data => {
        setAssignments(data);
        setHasMentor(data.length > 0);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  const handleFindMentor = () => navigate('/mentor-swipe');
  const handleSwipe = () => navigate('/mentor-swipe');

  const handleAddMeeting = () => {
    if (
      newMeeting.startDateTime > newMeeting.endDateTime ||
      newMeeting.startDateTime.toDateString() !== newMeeting.endDateTime.toDateString()
    ) {
      alert('שעת התחלה חייבת להיות לפני שעת סיום ובאותו יום');
      return;
    }
    if (!newMeeting.mentorId || !assignments.find(a => a.mentorId === newMeeting.mentorId)) {
      alert('יש לבחור חונך מתוך השיבוצים הפעילים');
      return;
    }

    const matched = assignments.find(a => a.mentorId === newMeeting.mentorId);
    if (!matched) {
      alert('לא נמצא שיבוץ מתאים לחונך');
      return;
    }

    const meetingToSave = {
      mentorId: newMeeting.mentorId,
      menteeId: loggedUser.id,
      summary: newMeeting.summary,
      startDateTime: newMeeting.startDateTime,
      endDateTime: newMeeting.endDateTime,
      matchId: matched._id,
    };

    fetch("http://localhost:8000/api/meetings", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingToSave)
    })
      .then(res => res.json())
      .then(data => {
        setMeetings([...meetings, data]);
        setShowForm(false);
      });
  };

  const handleDeleteMeeting = (id) => {
    fetch(`http://localhost:8000/api/meetings/${id}`, {
      method: "DELETE",
    })
      .then(res => {
        if (res.ok) {
          setMeetings(meetings.filter((m) => m._id !== id));
          setShowOptionsId(null);
        } else {
          alert("שגיאה במחיקת הפגישה");
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
          <button onClick={() => navigate('/dashboard/mentee')}><FaHome /> דף בית</button>
          <button onClick={() => navigate('/profile')}><FaUser /> הפרופיל שלי</button>
          <button onClick={handleSwipe}><FaSearch /> חפש חניך</button>
          <button onClick={handleLogout}><FaSignOutAlt /> יציאה</button>
        </div>
      </nav>

      <main className={styles.mainContent}>
        {!hasMentor ? (
          <div className={styles.alertBox}>
            עדיין לא שובצת לחונך 🎓 לחץ על “חפש חונכים” כדי להתחיל
           <div><button onClick={handleFindMentor}><FaSearch /> חפש חונכים</button></div> 
          </div>
        ) : (
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
                              <button onClick={() => handleDeleteMeeting(m._id)}>🗑️ מחק</button>
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
                          {assignments.find(a => a.mentorId === m.mentorId)?.mentorName ? `עם ${assignments.find(a => a.mentorId === m.mentorId)?.mentorName}` : ''}
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
                <label>בחר חונך</label>
                <select
                  className={styles.input}
                  value={newMeeting.mentorId}
                  onChange={e => setNewMeeting({ ...newMeeting, mentorId: e.target.value })}
                  style={{ marginBottom: '12px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                >
                  <option value="">-- בחר חונך --</option>
                  {assignments.map((a, idx) => (
                    a.mentorId && (
                      <option key={idx} value={a.mentorId}>{a.mentorName || a.mentorId}</option>
                    )
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
        )}
      </main>
    </div>
  );
}

export default MenteeDashboard;
