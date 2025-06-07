import styles from './AdminPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { FaHome, FaUser, FaSignOutAlt, FaGraduationCap, FaUsers } from 'react-icons/fa';

function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [openDirection, setOpenDirection] = useState("down");
  const rowRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    fetch('https://papa-backend.onrender.com/api/mentors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          console.error("לא קיבלתי מערך! הנתון שהגיע:", data);
          setRequests([]);
        }
      })
      .catch(err => {
        console.error("שגיאה בטעינה מהשרת:", err);
        setRequests([]);
      });
  }, [navigate]);

  const togglePopup = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
      return;
    }

    const row = rowRefs.current[index];
    if (row) {
      const rect = row.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceAbove > spaceBelow;
      setOpenDirection(openUp ? 'up' : 'down');
    }

    setOpenIndex(index);
  };

  const selectStatus = (index, newStatus) => {
    const selected = requests[index];
    const payload = {
      fullName: selected.fullName,
      userName: selected.userName,
      phone: selected.phoneNumber,
      degree: selected.school,
      avgScore: selected.averageGrade,
      availability: `${selected.availableDays?.join(", ")} | ${selected.availableHours?.join(", ")}`,
      days: selected.availableDays,
      status: newStatus
    };

    fetch('https://papa-backend.onrender.com/api/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        const updated = [...requests];
        updated[index].status = newStatus;
        setRequests(updated);
        setOpenIndex(null);
      })
      .catch(err => console.error('שגיאה בעדכון:', err));
  };

  const exportMeetings = async (userName) => {
    try {
      const response = await fetch('https://papa-backend.onrender.com/api/meetings-by-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ תוכן השגיאה:", errorText);
        throw new Error("שגיאה בשרת");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute("download", "");
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("שגיאה ביצוא מפגשים:", error);
      alert("לא הצלחנו לייצא את הקובץ 😢");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className={styles.adminLayout}>
      <nav className={styles.topbarPro}>
        <div className={styles.logoTitle}>
          <FaGraduationCap className={styles.icon} />
          <span>מערכת שיבוץ חונכות</span>
        </div>
        <div className={styles.topbarButtons}> 
          <a onClick={handleLogout} className={styles.topbarLink} style={{ cursor: 'pointer' }}>
  <FaSignOutAlt /> יציאה
</a>

          <Link to="/trainees"><FaUsers /> חניכים</Link>
          <a href="#"><FaUser /> הפרופיל שלי</a>
          <a href="#"><FaHome /> דף בית</a>
        </div>
      </nav>

      <main className={styles.adminWrapper}>
        <h1>ניהול בקשות לחונכות 🛠</h1>
        <p className={styles.adminSubtitle}>
          בדף זה מוצגות כל הבקשות מסטודנטים שמעוניינים להפוך לחונכים.
        </p>

        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>שם מלא</th>
              <th>תעודת זהות</th>
              <th>מייל</th>
              <th>טלפון</th>
              <th>תחום התמחות</th>
              <th>ציון ממוצע</th>
              <th>זמינות</th>
              <th>קישור לקו"ח</th>
              <th>סטטוס</th>
              <th>ייצוא מפגשים</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={index} ref={(el) => (rowRefs.current[index] = el)}>
                <td>{req.fullName}</td>
                <td>{req.idNumber}</td>
                <td>{req.userName}</td>
                <td>{req.phoneNumber}</td>
                <td>{req.school}</td>
                <td>{req.averageGrade}</td>
                <td>
                  {(req.availableDays || []).join(", ")} | {(req.availableHours || []).join(", ")}
                </td>
                <td>
                  {req.cvUrl ? (
                   <a
  href={`https://papa-mentor-app.onrender.com/${req.cvUrl}`}
  target="_blank"
  rel="noreferrer"
>
  📄 צפייה ב־PDF
</a>

                  ) : (
                    <span style={{ color: "gray" }}>אין קובץ</span>
                  )}
                </td>
                <td style={{ position: 'relative' }}>
                  <button
                    className={`${styles.statusDisplay} ${
                      req.status === "פעיל"
                        ? styles.green
                        : req.status === "לא פעיל"
                        ? styles.red
                        : styles.pending
                    }`}
                    onClick={() => togglePopup(index)}
                  >
                    {req.status || 'ממתין לאישור'}
                  </button>
                  {openIndex === index && (
                    <div className={`${styles.statusPopup} ${styles[openDirection]}`}>
                      <div onClick={() => selectStatus(index, "פעיל")}>✅ פעיל</div>
                      <div onClick={() => selectStatus(index, "לא פעיל")}>❌ לא פעיל</div>
                      <div onClick={() => selectStatus(index, "ממתין לאישור ⏳")}>⏳ ממתין לאישור</div>
                    </div>
                  )}
                </td>
                <td>
                  <button className={styles.exportBtn} onClick={() => exportMeetings(req.userName)}>
                    ייצוא מפגשים
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default AdminPage;
