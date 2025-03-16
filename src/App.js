import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Employees from "./pages/Employees";
import ErrorsByDate from "./pages/ErrorsByDate";
import TotalErrors from "./pages/TotalErrors";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Employees />} />
        <Route path="/errors" element={<ErrorsByDate />} />
        <Route path="/total" element={<TotalErrors />} />
      </Routes>
    </Router>
  );
}

export default App;
