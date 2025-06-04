// גרסה מעודכנת להצגת ה-checkboxים בצורה אופקית עם יישור RTL נכון

import React, { useState, useEffect } from 'react';
import { FaHome, FaUser, FaSignOutAlt, FaGraduationCap } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const fetchMentors = async (formData) => {
  const response = await fetch("https://papa-backend.onrender.com/api/match-mentors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      menteeId: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : "",
      course: formData.course,
      preferredDays: formData.preferredDays,
      preferredHours: formData.preferredHours,
      expectations: formData.expectations
    })
  });
  return await response.json();
};


export default function MentorSwipe() {
  const [mentors, setMentors] = useState([]);
  const [index, setIndex] = useState(0);
  const [likedMentors, setLikedMentors] = useState([]);
  const [formData, setFormData] = useState({ preferredHours: [], preferredDays: [], course: '', expectations: '' });
  const [showForm, setShowForm] = useState(true);
  const [finalMessage, setFinalMessage] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = async () => {
    const liked = mentors[index];
    setLikedMentors([...likedMentors, liked]);
    setFinalMessage("📨 נשלחה הודעה לחונך, נעדכן אותך כשהוא ייצור קשר!");
    setHasLiked(true);
  
    await fetch("https://papa-backend.onrender.com/api/select-mentor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        menteeId: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : "",
        mentorId: liked.mentorId,
        course: formData.course,
        preferredDays: formData.preferredDays,
        preferredHours: formData.preferredHours,
        expectations: formData.expectations
      })
    });
  };
  

  const handleDislike = () => {
    const nextIndex = index + 1;
    if (nextIndex >= mentors.length) {
      setFinalMessage("🚨 לא נמצאה התאמה. צוות ההנהלה יקבל הודעה ונעדכן אותך כשיימצא חונך מתאים.");
    } else {
      setIndex(nextIndex);
    }
  };

  

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked ? [...prev[name], value] : prev[name].filter((item) => item !== value)
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const results = await fetchMentors(formData);
  
    if (results.length === 0) {
      setFinalMessage("🚨 לא נמצאה התאמה. צוות ההנהלה יקבל הודעה ונעדכן אותך כשיימצא חונך מתאים.");
      setShowForm(false);
      return;
    }
  
    setMentors(results);
    setShowForm(false);
  };
  

  const mentor = mentors[index];

  return (
    <div className="min-h-screen bg-blue-50 text-right" dir="rtl">
  <nav className="bg-white shadow p-4 flex justify-between items-center px-8" dir="rtl">
  {/* צד ימין (קישורים) */}
  <div className="flex gap-4 text-sm text-blue-600 items-center">
    <a href="/dashboard/mentee" className="flex items-center gap-1 hover:underline"><FaHome /> דף בית</a>
    <a href="#" className="flex items-center gap-1 hover:underline"><FaUser /> הפרופיל שלי</a>
    <a href="/" className="flex items-center gap-1 hover:underline"><FaSignOutAlt /> יציאה</a>
  </div>

  {/* צד שמאל (כותרת) */}
  <div className="text-blue-700 font-bold text-lg flex items-center gap-2">
    <FaGraduationCap /> מערכת שיבוץ חונכות
  </div>
</nav>



{finalMessage && (
  <motion.div
    className="max-w-lg mx-auto mt-10 text-center text-blue-800"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <p className="text-lg font-semibold mb-4">{finalMessage}</p>
    <button
      onClick={() => window.location.href = "/dashboard/mentee"}
      className="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
    >
      חזרה לדף הבית
    </button>
  </motion.div>
)}



      {showForm ? (
        <motion.div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-xl font-semibold text-center mb-4 text-blue-700">מלא את פרטי הבקשה</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">שעות נוחות:</label>
              <div className="flex flex-wrap gap-3 text-right">
                {['בוקר', 'צהריים', 'ערב'].map((hour) => (
                  <label key={hour} className="flex flex-row-reverse items-center gap-1">
                    <input type="checkbox" name="preferredHours" value={hour} onChange={handleFormChange} />
                    {hour}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-1">ימים מועדפים:</label>
              <div className="flex flex-wrap gap-3 text-right">
                {['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי'].map((day) => (
                  <label key={day} className="flex flex-row-reverse items-center gap-1">
                    <input type="checkbox" name="preferredDays" value={day} onChange={handleFormChange} />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-1">קורס נדרש:</label>
              <input type="text" name="course" onChange={handleFormChange} className="w-full border rounded p-2 text-right" placeholder="מבני נתונים למשל" />
            </div>

            <div>
              <label className="block mb-1">מה אתה מחפש בחונך:</label>
              <textarea name="expectations" onChange={handleFormChange} className="w-full border rounded p-2 text-right" rows="3"></textarea>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">הצג חונכים מתאימים</button>
          </form>
        </motion.div>
      ) : (
        <AnimatePresence>
          {!hasLiked && mentor && !finalMessage &&(
            <motion.div key={mentor.mentorId} className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg text-right" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}>
<img
  src={mentor.mentorPicture || 'https://via.placeholder.com/150'}
  alt={mentor.mentorName}
  className="w-32 h-32 rounded-full mx-auto border-4 border-blue-200"
/>

              <h2 className="text-center text-2xl font-semibold mt-4 text-blue-800">{mentor.mentorName}</h2>
              <p className="text-center text-gray-600 mt-2">{mentor.description || 'לא צויין תיאור'}</p>
              <div className="mt-4 text-sm text-gray-700 text-right">
                <p><strong>📚 קורסים:</strong> {mentor.courses?.join(', ')}</p>
                <p><strong>🗓️ ימים:</strong> {mentor.availableDays?.join(', ')}</p>
                <p><strong>🕓 שעות:</strong> {mentor.availableHours?.join(', ')}</p>
              </div>
              <div className="w-full mt-4">
                <div className="h-5 bg-gray-200 rounded-full">
                  <div className="h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-xs text-white text-center" style={{ width: `${mentor.score || 0}%` }}>
                    {mentor.score || 0}%
                  </div>
                </div>
              </div>
              <div className="flex justify-around mt-6">
                <button onClick={handleDislike} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-full text-xl">❌</button>
                <button onClick={handleLike} className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-xl">💙</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
