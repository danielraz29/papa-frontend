import React from "react";
import './App.css';

function MentorHomePage() {
  return (
    <div className="container">
      {/* סרגל ניווט עליון */}
      <nav className="navbar">
        <ul>
          <li>דף בית</li>
          <li>פרופיל שלי</li>
          <li>חניכים</li>
          <li>יציאה</li>
        </ul>
      </nav>

      <h1>דף הבית שלי</h1>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div
          style={cardStyle}
          onClick={() => alert("מעבר ללוח השנה")}
        >
          לוח השנה שלי
        </div>

        <div
          style={cardStyle}
          onClick={() => alert("מעבר לחניכים שלי")}
        >
          החניכים שלי
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#e6f2ff',
  border: '1px solid #cce0ff',
  padding: '20px',
  borderRadius: '10px',
  textAlign: 'center',
  fontSize: '20px',
  color: '#0056b3',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease',
};

export default MentorHomePage;
