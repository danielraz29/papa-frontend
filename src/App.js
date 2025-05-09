import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import MenteeDashboard from "./MenteeDashboard"; // במידה ורלוונטי
import MentorRequest from './MentorRequest'; // הקובץ החדש שלך


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard/mentee" element={<MenteeDashboard />} />
        <Route path="/mentor-request" element={<MentorRequest />} />
      </Routes>
    </Router>
  );
}

export default App;
