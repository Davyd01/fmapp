import React, { useState, useEffect } from "react";
import { loadFromStorage, saveToStorage, removeFromStorage } from "../utils/storage";

const ErrorsByDate = () => {
  const [dates, setDates] = useState([]);
  const [expandedDates, setExpandedDates] = useState({});
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    setDates(loadFromStorage("dates") || []);
    setEmployees(loadFromStorage("employees") || []);
  }, []);

  useEffect(() => {
    const newErrors = {};
    dates.forEach((date) => {
      newErrors[date] = loadFromStorage(`errors_${date}`) || {};
    });
    setErrors(newErrors);
  }, [dates]);

  // Форматирование даты (ДД-ММ-ГГГГ)
  const formatDate = (isoDate) => {
    const [year, month, day] = isoDate.split("-");
    return `${day}-${month}-${year}`;
  };

  // Добавляем новую дату
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    const formattedDate = formatDate(selectedDate);

    if (selectedDate && !dates.includes(formattedDate)) {
      const updatedDates = [formattedDate, ...dates];
      setDates(updatedDates);
      saveToStorage("dates", updatedDates);

      const emptyErrors = {};
      employees.forEach((employee) => {
        emptyErrors[employee] = { blueBox: 0, overCount: 0, underCount: 0 };
      });

      setErrors((prevErrors) => ({
        ...prevErrors,
        [formattedDate]: emptyErrors,
      }));

      saveToStorage(`errors_${formattedDate}`, emptyErrors);
      setExpandedDates((prev) => ({ ...prev, [formattedDate]: true }));
      setNewDate(""); 
    }
  };

  // Удаление даты
  const clearAllDates = () => {
    const isConfirmed = window.confirm("Вы уверены, что хотите удалить ВСЕ даты и ошибки?");
    if (!isConfirmed) return;
  
    setDates([]);
    saveToStorage("dates", []);
  
    // Удаляем все ошибки из localStorage
    dates.forEach((date) => removeFromStorage(`errors_${date}`));
    setErrors({});
  };
  

  // Переключение отображения даты
  const toggleDate = (date) => {
    setExpandedDates((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  // Обновление ошибок
  const updateErrorCount = (date, employee, errorType, change) => {
    const updatedErrors = { ...errors };
    if (!updatedErrors[date]) updatedErrors[date] = {};
    if (!updatedErrors[date][employee])
      updatedErrors[date][employee] = { blueBox: 0, overCount: 0, underCount: 0 };

    updatedErrors[date][employee][errorType] = Math.max(
      0,
      (updatedErrors[date][employee][errorType] || 0) + change
    );

    setErrors(updatedErrors);
    saveToStorage(`errors_${date}`, updatedErrors[date]);
  };

  return (
    <div className="errors-container">
      <h2>Datum</h2>
      
      {/* Календарь для выбора даты */}
      <input 
        type="date" 
        value={newDate} 
        onChange={handleDateChange} 
        className="date-picker"
      />
      <button onClick={clearAllDates} className="clear-btn">🗑 Verwijder alle datums</button>


      <div className="dates-list">
        {dates.map((date) => (
          <div key={date}>
            <div className="date-header">
              <span onClick={() => toggleDate(date)}>
                {date} <span>{expandedDates[date] ? "▲" : "▼"}</span>
              </span>
              <button className="delete-btn" onClick={() => deleteDate(date)}>🗑</button>
            </div>
            {expandedDates[date] && (
              <table className="errors-table">
                <thead>
                  <tr>
                    <th>Medewerker</th>
                    <th>Blauw bakke</th>
                    <th>Meer boeken</th>
                    <th>Minder boeken</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee}>
                      <td>{employee}</td>
                      <td>
                        <button onClick={() => updateErrorCount(date, employee, "blueBox", -1)}>-</button>
                        {errors[date]?.[employee]?.blueBox || 0}
                        <button onClick={() => updateErrorCount(date, employee, "blueBox", 1)}>+</button>
                      </td>
                      <td>
                        <button onClick={() => updateErrorCount(date, employee, "overCount", -1)}>-</button>
                        {errors[date]?.[employee]?.overCount || 0}
                        <button onClick={() => updateErrorCount(date, employee, "overCount", 1)}>+</button>
                      </td>
                      <td>
                        <button onClick={() => updateErrorCount(date, employee, "underCount", -1)}>-</button>
                        {errors[date]?.[employee]?.underCount || 0}
                        <button onClick={() => updateErrorCount(date, employee, "underCount", 1)}>+</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorsByDate;
