import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css'; // CSS Module

function HomePage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // מצב טעינה

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch("https://papa-backend.onrender.com/login", {
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

      localStorage.setItem("user", JSON.stringify({
        id: data.userId,
        name: data.name,
        role: data.role || "mentee"
      }));

      navigate(data.redirectTo || "/dashboard/mentee");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1>ברוכים הבאים למערכת פאפא 🎓</h1>
        <p className={styles.subtitle}>מרכז דיגיטלי לחונכות אקדמית – פשוט, מהיר, אישי</p>
      </header>

      <main className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>שם משתמש</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="הכנס/י את המייל"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <select
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className={styles.select}
            >
              <option value=""> מוסד אקדמי</option>
              <option value="אוניברסיטת תל אביב">אוניברסיטת תל אביב</option>
              <option value="אוניברסיטת חיפה">אוניברסיטת חיפה</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={() => navigate("/mentor-request")}
              disabled={loading}
            >
              בקשה לחונכות
            </button>

            <button type="submit" className={styles.primaryBtn} disabled={loading}>
              {loading ? (
                <span className={styles.loadingWrapper}>
                  <span className={styles.spinner}></span> מתחבר...
                </span>
              ) : (
                "התחברות"
              )}
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </form>
      </main>
    </div>
  );
}

export default HomePage;
