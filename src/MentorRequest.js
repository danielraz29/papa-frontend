// בקובץ MentorRequest.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MentorRequest.module.css";
import { FaEnvelope, FaPhoneAlt, FaFileUpload } from 'react-icons/fa';

function MentorRequest() {
  const [year, setYear] = useState("");
  const [availability, setAvailability] = useState({});
  const [selectedDays, setSelectedDays] = useState([]);
  const [name, setName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [degree, setDegree] = useState("");
  const [school, setSchool] = useState(""); // שדה חדש
  const [average, setAverage] = useState("");
  const [resume, setResume] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];
  const times = ["בוקר", "צהריים", "ערב"];

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^\d{7,}$/.test(phone);
  const validateIdNumber = (id) => /^\d{9}$/.test(id);
  const validateResume = (file) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    return file && validTypes.includes(file.type);
  };
  const validateImage = (file) => {
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
    return file && file.size <= maxSizeInBytes;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = true;
    if (!validateIdNumber(idNumber)) newErrors.idNumber = true;
    if (!validateEmail(personalEmail)) newErrors.personalEmail = true;
    if (!validateEmail(collegeEmail)) newErrors.collegeEmail = true;
    if (!validatePhone(phone)) newErrors.phone = true;
    if (!degree) newErrors.degree = true;
    if (!school) newErrors.school = true;
    if (!average) newErrors.average = true;
    if (!year) newErrors.year = true;
    if (selectedDays.length === 0) newErrors.availability = true;
    if (Object.keys(availability).length !== selectedDays.length) newErrors.availability = true;
    if (!validateResume(resume)) newErrors.resume = true;
    if (!validateImage(profilePic)) newErrors.profilePic = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    const file = e.target.files[0];
    if (validateResume(file)) {
      setResume(file);
      setErrors((prev) => ({ ...prev, resume: false }));
    } else {
      setErrors((prev) => ({ ...prev, resume: true }));
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (validateImage(file)) {
      setProfilePic(file);
      setErrors((prev) => ({ ...prev, profilePic: false }));
    } else {
      alert("תמונת הסטודנט חורגת מהגודל המותר (עד 2MB)");
      setErrors((prev) => ({ ...prev, profilePic: true }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("fulllName", name);
      formData.append("idNumber", idNumber);
      formData.append("personalEmail", personalEmail);
      formData.append("collegeEmail", collegeEmail);
      formData.append("phoneNumber", phone);
      formData.append("school", school); // שדה חדש
      formData.append("averageGrade", average);
      formData.append("studyYear", year);
      formData.append("cvUrl", resume);
      formData.append("profilePic", profilePic);
      formData.append("availableDays", JSON.stringify(availability));
      formData.append("status", "pending");
      formData.append("degrees", JSON.stringify(degree.split(',').map(d => d.trim()))); // לפצל לרשימה

      const response = await fetch("http://localhost:8000/mentor-request", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("שליחה נכשלה, נסה שוב.");
      setShowPopup(true);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      alert("שגיאה בשליחה: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopup = () => setShowPopup(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>ברוכים הבאים למערכת פאפא 🎓</h1>
        <p className={styles.subtitle}>מרכז דיגיטלי לחונכות אקדמית – פשוט, מהיר, אישי</p>
      </header>

      <h2 className={styles.formTitle}>אנא מלא/י את הפרטים הבאים</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>שם מלא</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${styles.inputText} ${errors.name ? styles.errorInput : ""}`}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>תעודת זהות</label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className={`${styles.inputText} ${errors.idNumber ? styles.errorInput : ""}`}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}><FaEnvelope /> מייל אישי</label>
          <input
            type="email"
            value={personalEmail}
            onChange={(e) => setPersonalEmail(e.target.value)}
            className={`${styles.inputText} ${errors.personalEmail ? styles.errorInput : ""}`}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}><FaEnvelope /> מייל מכללה</label>
          <input
            type="email"
            value={collegeEmail}
            onChange={(e) => setCollegeEmail(e.target.value)}
            className={`${styles.inputText} ${errors.collegeEmail ? styles.errorInput : ""}`}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}><FaPhoneAlt /> טלפון</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`${styles.inputText} ${errors.phone ? styles.errorInput : ""}`}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>תחום התמחות</label>
          <input
            type="text"
            placeholder="לדוגמה: מבני נתונים, SQL בסיסי, ניתוח מערכות מידע"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className={`${styles.inputText} ${errors.degree ? styles.errorInput : ""}`}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>בית ספר</label>
          <input
            type="text"
            placeholder="לדוגמה: מערכות מידע"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className={`${styles.inputText} ${errors.school ? styles.errorInput : ""}`}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>ממוצע</label>
          <input
            type="text"
            value={average}
            onChange={(e) => setAverage(e.target.value)}
            className={`${styles.inputText} ${errors.average ? styles.errorInput : ""}`}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>שנה</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={`${styles.select} ${errors.year ? styles.errorInput : ""}`}
          >
            <option value="">בחר/י</option>
            <option>א'</option>
            <option>ב'</option>
            <option>ג'</option>
            <option>ד'</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>זמינות</label>
          {days.map((day) => (
            <div key={day} className={styles.dayItem}>
              <input
                type="checkbox"
                checked={selectedDays.includes(day)}
                onChange={(e) => handleDayChange(day, e.target.checked)}
              /> {day}
              {selectedDays.includes(day) && (
                <div className={styles.selectWrapper}>
                  <label className={styles.smallLabel}>בחר/י שעה</label>
                  <select
                    className={styles.timeSelect}
                    onChange={(e) => handleTimeChange(day, e.target.value)}
                    value={availability[day] || ""}
                  >
                    <option value="">בחר/י</option>
                    {times.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
          {errors.availability && <p className={styles.errorText}>יש לבחור לפחות יום אחד עם שעה</p>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}><FaFileUpload /> קורות חיים</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className={`${styles.inputText} ${errors.resume ? styles.errorInput : ""}`}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}><FaFileUpload /> תמונת סטודנט</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicUpload}
            className={`${styles.inputText} ${errors.profilePic ? styles.errorInput : ""}`}
          />
        </div>

        <button type="submit" className={styles.nextButton} disabled={isSubmitting}>
          {isSubmitting ? "שולח..." : "שלח"}
        </button>
      </form>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h1>בקשתך נשלחה ✅</h1>
            <p>ניצור עמך קשר בהקדם.</p>
            <button className={styles.popupButton} onClick={closePopup}>סגור</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorRequest;
