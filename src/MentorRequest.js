import React, { useState } from "react";
import './MentorRequest.css';

function App() {
  const [year, setYear] = useState("");
  const [availability, setAvailability] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [degree, setDegree] = useState("");
  const [average, setAverage] = useState("");
  const [resume, setResume] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];
  const times = ["בוקר", "צהריים", "ערב"];

  const handleDayChange = (day, checked) => {
    const updatedDays = checked
      ? [...selectedDays, day]
      : selectedDays.filter(d => d !== day);

    const updatedAvailability = { ...availability };
    if (!checked) {
      delete updatedAvailability[day];
    }

    setSelectedDays(updatedDays);
    setAvailability(updatedAvailability);
  };

  const handleTimeChange = (day, time) => {
    setAvailability(prev => ({
      ...prev,
      [day]: time
    }));
  };

  const handleResumeUpload = (e) => {
    setResume(e.target.files[0]);
  };

  const isFormComplete = () => {
    return (
      name &&
      phone &&
      degree &&
      average &&
      year &&
      selectedDays.length > 0 &&
      Object.keys(availability).length > 0 &&
      resume
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container">
      {/* סרגל הכלים למעלה */}
      <nav className="navbar">
        <ul>
          <li>דף בית</li>
          <li>פרופיל שלי</li>
          <li>חניכים</li>
          <li>יציאה</li>
        </ul>
      </nav>

      <h1>אנא מלא/י את הפרטים הבאים</h1>

      {/* כל שאר הטופס כמו קודם */}
      <div className="form-group">
        <h2>שם מלא</h2>
        <input
          type="text"
          placeholder="הקלד/י את שמך"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <h2>טלפון</h2>
        <input
          type="text"
          placeholder="הקלד/י מספר טלפון"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      </div>

      <div className="form-group">
        <h2>תחום התמחות (תואר)</h2>
        <input
          type="text"
          placeholder="הקלד/י את שם התואר"
          value={degree}
          onChange={e => setDegree(e.target.value)}
        />
      </div>

      <div className="form-group">
        <h2>ציון ממוצע שנתי</h2>
        <input
          type="text"
          placeholder="הקלד/י את ממוצע הציונים"
          value={average}
          onChange={e => setAverage(e.target.value)}
        />
      </div>

      <div className="form-group">
        <h2>שנת לימודים נוכחית</h2>
        <select value={year} onChange={e => setYear(e.target.value)}>
          <option value="">בחר/י שנה</option>
          <option>א'</option>
          <option>ב'</option>
          <option>ג'</option>
          <option>ד'</option>
        </select>
      </div>

      <div className="form-group">
        <h2>זמינות ימים ושעות</h2>
        {days.map(day => (
          <div key={day} style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={selectedDays.includes(day)}
                onChange={(e) => handleDayChange(day, e.target.checked)}
              />{" "}
              {day}
            </label>

            {selectedDays.includes(day) && (
              <select
                style={{ marginRight: "10px", marginTop: "5px" }}
                onChange={(e) => handleTimeChange(day, e.target.value)}
                value={availability[day] || ""}
              >
                <option value="">בחר/י שעה</option>
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {/* קובץ קורות חיים */}
      <div className="form-group">
        <h2>העלה/י קורות חיים</h2>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeUpload}
        />
      </div>

      <button className="next-button" onClick={handleSubmit} disabled={!isFormComplete()}>
        שלח
      </button>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h1>בקשתך נשלחה</h1>
            <p>ניצור עמך קשר בהקדם.</p>
            <button onClick={closePopup}>סגור</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
