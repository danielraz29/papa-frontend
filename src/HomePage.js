import styles from "./HomePage.module.css"; // <<< זה השלב 2!
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://papa-backend.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: name, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'שגיאה בהתחברות');
      }

      // ניווט לפי התפקיד
      navigate(data.redirectTo);  // דוגמה: /dashboard/admin

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-wrapper">
      <header className="header">
        <h1>ברוכים הבאים למערכת פאפא 🎓</h1>
        <p className="subtitle">מרכז דיגיטלי לחונכות אקדמית – פשוט, מהיר, אישי</p>
      </header>
      <main className="form-card">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>שם משתמש</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="הכנס/י את המייל"
            />
          </div>
          <div className="form-group">
            <label>סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>
          <select value={institution} onChange={(e) => setInstitution(e.target.value)}>
            <option value=""> מוסד אקדמי</option>
            <option value="אוניברסיטת תל אביב">אוניברסיטת תל אביב</option>
            <option value="אוניברסיטת חיפה">אוניברסיטת חיפה</option>
          </select>
          <div className="actions">
            <button type="button" className="secondary-btn"  onClick={() => navigate("/mentor-request")}>בקשה לחונכות</button>
            <button type="submit" className="primary-btn">התחברות</button>
          </div>
          {error && <p className="error">{error}</p>}
        </form>
      </main>
    </div>
  );
}

export default HomePage;
