import React, { useState } from "react";
import styles from "./MentorRequest.module.css";

function MentorRequest() {
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
      : selectedDays.filter((d) => d !== day);

    const updatedAvailability = { ...availability };
    if (!checked) {
      delete updatedAvailability[day];
    }

    setSelectedDays(updatedDays);
    setAvailability(updatedAvailability);
  };

  const handleTimeChange = (day, time) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: time,
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
      Object.keys(availability).length === selectedDays.length &&
      resume
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormComplete()) {
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>אנא מלא/י את הפרטים הבאים</h1>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <h2 className={styles.subHeading}>שם מלא</h2>
          <input
            type="text"
            placeholder="הקלד/י את שמך"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputText}
          />
        </div>

        <div className={styles.formGroup}>
          <h2 className={styles.subHeading}>טלפון</h2>
          <input
            type="text"
            placeholder="הקלד/י מספר טלפון"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={styles.inputText}
          />
        </div>

        <div className={styles.formGroup}>
          <h2 className={styles.subHeading}>תחום התמחות (תואר)</h2>
          <input
            type="text"
            placeholder="הקלד/י את שם התואר"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className={styles.inputText}
          />
        </div>

        <div className={styles.formGroup}>
          <h2 className={styles.subHeading}>ציון ממוצע שנתי</h2>
          <input
            type="text"
            placeholder="הקלד/י את ממוצע הציונים"
            value={average}
            onChange={(e) => setAverage(e.target.value)}
            className={styles.inputText}
          />
        </div>

        <div className={styles.formGroup}>
          <h2 className={styles.subHeading}>שנת לימודים נוכחית</h2>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={styles.select}
          >
            <option value="">בחר/י שנה</option>
            <option>א'</option>
            <option>ב'</option>
            <option>ג'</option>
            <option>ד'</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <h2 className={styles.subHeading}>זמינות ימים ושעות</h2>
          {days.map((day) => (
            <div key={day} className={styles.dayItem}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={(e) => handleDayChange(day, e.target.checked)}
                />{" "}
                {day}
              </label>

              {selectedDays.includes(day) && (
                <select
                  className={styles.timeSelect}
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

        <div className={styles.formGroup}>
          <h2 className={styles.subHeading}>העלה/י קורות חיים</h2>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
          />
        </div>

        <button
          type="submit"
          className={styles.nextButton}
          disabled={!isFormComplete()}
        >
          שלח
        </button>
      </form>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h1>בקשתך נשלחה</h1>
            <p>ניצור עמך קשר בהקדם.</p>
            <button className={styles.popupButton} onClick={closePopup}>
              סגור
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorRequest;
