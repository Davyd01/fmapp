import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Employees from "./pages/Employees";
import ErrorsByDate from "./pages/ErrorsByDate";
import TotalErrors from "./pages/TotalErrors";
import { loadData, saveData } from "./utils/dataService";

function App() {
  const [data, setData] = useState([]);

  // Загружаем данные при старте
  useEffect(() => {
    loadData().then(setData);
  }, []);

  return (
    <Router>
      <Header />
      <button onClick={() => saveData(data)}>💾 Сохранить данные</button>
      <Routes>
        <Route path="/" element={<Employees data={data} setData={setData} />} />
        <Route path="/errors" element={<ErrorsByDate data={data} setData={setData} />} />
        <Route path="/total" element={<TotalErrors data={data} />} />
      </Routes>
    </Router>
  );
}

export default App;
