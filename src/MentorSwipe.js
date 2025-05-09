import React, { useState, useEffect } from 'react';
import { FaHome, FaUser, FaSignOutAlt, FaGraduationCap } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const fetchMentors = async () => {
  return [
    {
      id: 1,
      name: 'יוסי כהן',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      courses: ['מבני נתונים', 'SQL בסיסי'],
      availableDays: ['שני', 'רביעי'],
      availableHours: 'ערב',
      description: 'סטודנט שנה ג׳ עם ניסיון בחונכות במבני נתונים ו-SQL.'
    },
    {
      id: 2,
      name: 'הדס לוי',
      imageUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
      courses: ['מבוא למדעי המחשב'],
      availableDays: ['ראשון', 'שלישי'],
      availableHours: 'בוקר',
      description: 'חונכת בעלת ניסיון בהדרכת קבוצות. תומכת ומאורגנת.'
    }
  ];
};

export default function MentorSwipe() {
  const [mentors, setMentors] = useState([]);
  const [index, setIndex] = useState(0);
  const [likedMentors, setLikedMentors] = useState([]);
  const [showNextStep, setShowNextStep] = useState(false);
  const [formData, setFormData] = useState({ preferredHours: '', preferredDays: [], course: '', expectations: '' });
  const [showForm, setShowForm] = useState(true);
  const [rejections, setRejections] = useState(0);
  const [finalMessage, setFinalMessage] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    fetchMentors().then(setMentors);
  }, []);

  const handleLike = () => {
    const liked = mentors[index];
    setLikedMentors([...likedMentors, liked]);
    setFinalMessage("📨 נשלחה הודעה לחונך, נעדכן אותך כשהוא ייצור קשר!");
    setHasLiked(true);
    // כאן תוכל להוסיף קריאה ל-API לשמירת השיבוץ
  };

  const handleDislike = () => {
    const nextIndex = index + 1;
    setRejections(prev => prev + 1);
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
        preferredDays: checked ? [...prev.preferredDays, value] : prev.preferredDays.filter((day) => day !== value)
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowForm(false);
  };

  const mentor = mentors[index];

  return (
    <div className="min-h-screen bg-blue-50 text-right">
      <nav className="bg-white shadow p-4 flex justify-between items-center px-8">
        <div className="text-blue-700 font-bold text-lg flex items-center gap-2 order-2">
          <FaGraduationCap /> מערכת שיבוץ חונכות
        </div>
        <div className="flex gap-4 text-sm text-blue-600 items-center order-1">
          <a href="#" className="flex items-center gap-1 hover:underline"><FaHome /> דף בית</a>
          <a href="#" className="flex items-center gap-1 hover:underline"><FaUser /> הפרופיל שלי</a>
          <a href="#" className="flex items-center gap-1 hover:underline"><FaSignOutAlt /> יציאה</a>
        </div>
      </nav>

      {finalMessage && (
        <motion.div 
          className="max-w-lg mx-auto mt-10 text-center text-blue-800 text-lg font-semibold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          {finalMessage}
        </motion.div>
      )}

      {showForm ? (
        <motion.div 
          className="max-w-xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <h2 className="text-xl font-semibold text-center mb-4 text-blue-700">מלא את פרטי הבקשה</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">:שעות נוחות</label>
              <input type="text" name="preferredHours" onChange={handleFormChange} className="w-full border rounded p-2 text-right" placeholder="בוקר / ערב / כללי" />
            </div>
            <div>
              <label className="block mb-1">:ימים מועדפים</label>
              <div className="flex flex-wrap gap-2 justify-end">
                {["ראשון", "שני", "שלישי", "רביעי", "חמישי"].map((day) => (
                  <label key={day} className="flex items-center gap-1">
                    <input type="checkbox" value={day} onChange={handleFormChange} /> {day}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1">:קורס נדרש</label>
              <input type="text" name="course" onChange={handleFormChange} className="w-full border rounded p-2 text-right" placeholder="מבני נתונים למשל" />
            </div>
            <div>
              <label className="block mb-1">:מה אתה מחפש בחונך</label>
              <textarea name="expectations" onChange={handleFormChange} className="w-full border rounded p-2 text-right" rows="3"></textarea>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">הצג חונכים מתאימים</button>
          </form>
        </motion.div>
      ) : (
        <AnimatePresence>
          {!hasLiked && mentor && (
            <motion.div 
              key={mentor.id}
              className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg text-right"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}>
              <img src={mentor.imageUrl} alt={mentor.name} className="w-32 h-32 rounded-full mx-auto border-4 border-blue-200" />
              <h2 className="text-center text-2xl font-semibold mt-4 text-blue-800">{mentor.name}</h2>
              <p className="text-center text-gray-600 mt-2">{mentor.description}</p>
              <div className="mt-4 text-sm text-gray-700 text-right">
                <p><strong>📚 קורסים:</strong> {mentor.courses.join(', ')}</p>
                <p><strong>🗓️ ימים:</strong> {mentor.availableDays.join(', ')}</p>
                <p><strong>🕓 שעות:</strong> {mentor.availableHours}</p>
              </div>
              <div className="flex justify-around mt-6">
                <button onClick={handleDislike} className="bg-gray-200 text-gray-700 px-5 py-2 rounded-full text-xl">❌</button>
                <button onClick={handleLike} className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-xl">💙</button>
              </div>
              {showNextStep && (
                <motion.div 
                  className="text-center mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}>
                  <p className="text-green-600">💾 התאמה נרשמה! תוכל לעבור לשלב הבא</p>
                  <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">מעבר לדף הבא</button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}