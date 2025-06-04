import './AdminPage.css';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { FaHome, FaUser, FaSignOutAlt, FaGraduationCap, FaUsers } from 'react-icons/fa';

function AdminPage() {
  const [requests, setRequests] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [openDirection, setOpenDirection] = useState("down");
  const rowRefs = useRef([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/mentors')
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
  }, []);

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

    fetch('http://localhost:8000/api/update-status', {
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

  // ✅ exportMeetings – ייצוא אקסל עם שם שמגיע מהשרת (ללא @)
 const exportMeetings = async (userName) => {
  try {
    const response = await fetch('http://localhost:8000/api/meetings-by-mentor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userName })
    });

    console.log("📦 סטטוס תגובה מהשרת:", response.status);
    console.log("🧾 Content-Type מהשרת:", response.headers.get("Content-Type"));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ תוכן השגיאה:", errorText);
      throw new Error("שגיאה בשרת");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute("download", ""); // ← השם יגיע מהשרת
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("שגיאה ביצוא מפגשים:", error);
    alert("לא הצלחנו לייצא את הקובץ 😢");
  }
};


  return (
    <div className="admin-layout">
      <nav className="topbar-pro">
        <div className="logo-title">
          <FaGraduationCap className="icon" />
          <span>מערכת שיבוץ חונכות</span>
        </div>
        <div className="topbar-buttons">
          <a href="#"><FaSignOutAlt /> יציאה</a>
          <Link to="/trainees"><FaUsers /> חניכים</Link>
          <a href="#"><FaUser /> הפרופיל שלי</a>
          <a href="#"><FaHome /> דף בית</a>
        </div>
      </nav>

      <main className="admin-wrapper">
        <h1>ניהול בקשות לחונכות 🛠</h1>
        <p className="admin-subtitle">
          בדף זה מוצגות כל הבקשות מסטודנטים שמעוניינים להפוך לחונכים.
        </p>

        <table className="admin-table">
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
                    <a href={req.cvUrl} target="_blank" rel="noreferrer">
                      📄 צפייה ב־PDF
                    </a>
                  ) : (
                    <span style={{ color: "gray" }}>אין קובץ</span>
                  )}
                </td>
                <td style={{ position: 'relative' }}>
                  <button
                    className={`status-display ${
                      req.status === "פעיל"
                        ? 'green'
                        : req.status === "לא פעיל"
                        ? 'red'
                        : 'pending'
                    }`}
                    onClick={() => togglePopup(index)}
                  >
                    {req.status || 'ממתין לאישור'}
                  </button>
                  {openIndex === index && (
                    <div className={`status-popup ${openDirection}`}>
                      <div onClick={() => selectStatus(index, "פעיל")}>✅ פעיל</div>
                      <div onClick={() => selectStatus(index, "לא פעיל")}>❌ לא פעיל</div>
                      <div onClick={() => selectStatus(index, "ממתין לאישור ⏳")}>⏳ ממתין לאישור</div>
                    </div>
                  )}
                </td>
                <td>
                  <button className="export-btn" onClick={() => exportMeetings(req.userName)}>
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
