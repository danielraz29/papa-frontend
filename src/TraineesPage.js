import styles from './TraineesPage.module.css';
import React, { useEffect, useState } from 'react';
import { FaHome, FaUser, FaSignOutAlt, FaGraduationCap, FaUsers, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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

  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://papa-backend.onrender.com/api/mentees')
      .then(res => res.json())
      .then(data => setTrainees(data))
      .catch(() => setTrainees([]));
  }, []);

  const handleCreateUser = () => {
    fetch('https://papa-backend.onrender.com/api/create-mentee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then(res => res.json())
      .then(data => {
        alert(`החניך נוסף בהצלחה! הסיסמה שלו היא: ${data.password}`);
        setTrainees([...trainees, data]);
        setShowForm(false);
        setNewUser({
          fullName: '',
          idNumber: '',
          userName: '',
          phoneNumber: '',
          school: '',
          studyYear: '',
          menteeHourQuota: 30
        });
      })
      .catch(() => alert("לא הצלחנו להוסיף את החניך :("));
  };

  return (
    <div className={styles.traineesLayout}>
      <nav className={styles.topbarPro}>
        <div className={styles.logoTitle}>
          <FaGraduationCap className={styles.icon} />
          <span>מערכת שיבוץ חונכות</span>
        </div>
        <div className={styles.topbarButtons}>
          <button onClick={() => navigate('/')}><FaHome /> דף בית</button>
          <button><FaUser /> הפרופיל שלי</button>
          <button onClick={() => navigate('/dashboard/admin')}><FaUsers /> חזרה לניהול</button>
        </div>
      </nav>

      <main className={styles.traineesWrapper}>
        <div className={styles.headerRow}>
          <h1>חניכים 🎓</h1>
          <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            <FaPlus /> הוסף חניך
          </button>
        </div>

        {showForm && (
          <div className={styles.formSection}>
            <input placeholder="שם מלא" value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} />
            <input placeholder="תעודת זהות" value={newUser.idNumber} onChange={e => setNewUser({ ...newUser, idNumber: e.target.value })} />
            <input placeholder="מייל" value={newUser.userName} onChange={e => setNewUser({ ...newUser, userName: e.target.value })} />
            <input placeholder="טלפון" value={newUser.phoneNumber} onChange={e => setNewUser({ ...newUser, phoneNumber: e.target.value })} />
            <input placeholder="תואר" value={newUser.school} onChange={e => setNewUser({ ...newUser, school: e.target.value })} />
            <input placeholder="שנת לימודים" value={newUser.studyYear} onChange={e => setNewUser({ ...newUser, studyYear: e.target.value })} />
            <button className={styles.saveBtn} onClick={handleCreateUser}>שמור</button>
          </div>
        )}

        <table className={styles.traineesTable}>
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
                    <button className={styles.exportBtn} onClick={() => {
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
                    }}>
                      ייצוא שיבוצים
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={styles.emptyMsg}>לא נמצאו חניכים</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default TraineesPage;
