import './TraineesPage.css';
import React, { useEffect, useState } from 'react';
import { FaHome, FaUser, FaSignOutAlt, FaGraduationCap, FaUsers, FaPlus } from 'react-icons/fa';

function TraineesPage() {
  const [trainees, setTrainees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    idNumber: '',
    userName: '',
    phoneNumber: '',
    school: '',
    studyYear: '',
    menteeHourQuota: 30
  });

  useEffect(() => {
    fetch('https://papa-backend.onrender.com/api/mentees')
      .then(res => res.json())
      .then(data => {
        console.log("🎓 חניכים שהתקבלו מהשרת:", data);
        setTrainees(data);
      })
      .catch(err => {
        console.error("שגיאה בטעינת חניכים:", err);
        setTrainees([]);
      });
  }, []);

  const handleCreateUser = () => {
    fetch('https://papa-backend.onrender.com/api/create-mentee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then(res => res.json())
      .then(data => {
        alert("החניך נוסף בהצלחה!");
        setTrainees([...trainees, data]);
        setShowForm(false);
        setNewUser({ fullName: '', idNumber: '', userName: '', phoneNumber: '', school: '', studyYear: '', menteeHourQuota: 30 });
      })
      .catch(err => {
        console.error("שגיאה ביצירת משתמש:", err);
        alert("לא הצלחנו להוסיף את החניך :(");
      });
  };

  return (
    <div className="trainees-layout">
      <nav className="topbar-pro">
        <div className="logo-title">
          <FaGraduationCap className="icon" />
          <span>מערכת שיבוץ חונכות</span>
        </div>
        <div className="topbar-buttons">
          <a href="/"><FaHome /> דף בית</a>
          <a href="#"><FaUser /> הפרופיל שלי</a>
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = "/dashboard/admin"; }}><FaUsers /> חזרה לניהול</a>
        </div>
      </nav>

      <main className="trainees-wrapper">
        <h1>חניכים 🎓</h1>

        <button className="add-btn" onClick={() => setShowForm(!showForm)}><FaPlus /> הוסף חניך</button>

        {showForm && (
          <div className="form-section">
            <input placeholder="שם מלא" value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} />
            <input placeholder="תעודת זהות" value={newUser.idNumber} onChange={e => setNewUser({ ...newUser, idNumber: e.target.value })} />
            <input placeholder="מייל" value={newUser.userName} onChange={e => setNewUser({ ...newUser, userName: e.target.value })} />
            <input placeholder="טלפון" value={newUser.phoneNumber} onChange={e => setNewUser({ ...newUser, phoneNumber: e.target.value })} />
            <input placeholder="תואר" value={newUser.school} onChange={e => setNewUser({ ...newUser, school: e.target.value })} />
            <input placeholder="שנת לימודים" value={newUser.studyYear} onChange={e => setNewUser({ ...newUser, studyYear: e.target.value })} />
            <button onClick={handleCreateUser}>שמור</button>
          </div>
        )}

        <table className="trainees-table">
          <thead>
            <tr>
              <th>שם מלא</th>
              <th>תעודת זהות</th>
              <th>מייל</th>
              <th>טלפון</th>
              <th>תואר</th>
              <th>שנת לימודים</th>
              <th>מכסת שעות</th>
              <th>ייצוא שיבוצים</th>
            </tr>
          </thead>
          <tbody>
            {trainees.length > 0 ? (
              trainees.map((t, i) => (
                <tr key={i}>
                  <td>{t.fullName}</td>
                  <td>{t.idNumber}</td>
                  <td>{t.userName}</td>
                  <td>{t.phoneNumber}</td>
                  <td>{t.school}</td>
                  <td>{t.studyYear}</td>
                  <td>{t.menteeHourQuota}</td>
                  <td>
                    <button
                      className="export-btn"
                      onClick={() => {
                        fetch(`https://papa-backend.onrender.com/api/export-matches/${t._id}`)
                          .then((res) => res.blob())
                          .then((blob) => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `שיבוץ_${t.fullName}.xlsx`;
                            a.click();
                          })
                          .catch((err) => console.error("שגיאה ביצוא שיבוצים:", err));
                      }}
                    >
                      ייצוא שיבוצים
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-msg">לא נמצאו חניכים</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default TraineesPage;
