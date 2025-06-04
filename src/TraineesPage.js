import './TraineesPage.css';
import React, { useEffect, useState } from 'react';
import { FaHome, FaUser, FaSignOutAlt, FaGraduationCap, FaUsers } from 'react-icons/fa';

function TraineesPage() {
  const [trainees, setTrainees] = useState([]);

  useEffect(() => {
    fetch('https://papa-mentor-app.onrender.com/api/mentees')
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

  return (
    <div className="trainees-layout">
      <nav className="topbar-pro">
        <div className="logo-title">
          <FaGraduationCap className="icon" />
          <span>מערכת שיבוץ חונכות</span>
        </div>
        <div className="topbar-buttons">
          <a href="#"><FaSignOutAlt /> יציאה</a>
           <a href="#"><FaUser /> הפרופיל שלי</a>
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = "/dashboard/admin";}}
>         <FaUsers /> דף בית </a>

        </div>
      </nav>

      <main className="trainees-wrapper">
        <h1>חניכים 🎓</h1>
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
                        console.log("📤 נלחץ כפתור ייצוא לחניך:", t._id);
                        fetch(`https://papa-mentor-app.onrender.com/api/export-matches/${t._id}`)
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
