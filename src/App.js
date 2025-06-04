import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import MenteeDashboard from "./MenteeDashboard"; // במידה ורלוונטי
import MentorRequest from './MentorRequest'; 
import AdminPage from './AdminPage'; 
import MentorHomePage from './MentorHomePage';
import MentorSwipe from './MentorSwipe'; 
import TraineesPage from './TraineesPage'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard/mentee" element={<MenteeDashboard />} />
         <Route path="/dashboard/admin" element={<AdminPage />} />
        <Route path="/trainees" element={<TraineesPage />} />
         <Route path="/dashboard/mentor" element={<MentorHomePage />} />

        <Route path="/mentor-request" element={<MentorRequest />} />
        <Route path="/mentor-swipe" element={<MentorSwipe />} />
      </Routes>
    </Router>
  );
}

export default App;
