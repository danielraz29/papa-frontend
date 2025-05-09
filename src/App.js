import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import MenteeDashboard from "./MenteeDashboard"; // במידה ורלוונטי

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard/mentee" element={<MenteeDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
