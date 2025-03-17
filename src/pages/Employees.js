import React, { useState, useEffect } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { loadData, saveData } from "../utils/dataService";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  // Загружаем данные из localStorage и файла
  useEffect(() => {
    const localData = loadFromStorage("employees") || [];
    loadData().then((fileData) => {
      const mergedData = [...new Set([...localData, ...fileData])] // Убираем дубли
        .sort((a, b) => a.localeCompare(b)); // Сортируем по алфавиту
      setEmployees(mergedData);
      saveToStorage("employees", mergedData);
    });
  }, []);
  

  const addEmployee = () => {
    const name = prompt("Введите имя сотрудника:").trim();
  
    if (!name) return; // Если имя пустое, не добавляем
  
    // Проверяем, есть ли уже такой сотрудник
    if (employees.includes(name)) {
      alert("Этот сотрудник уже есть в списке!");
      return;
    }
  
    const updatedEmployees = [...employees, name]
      .sort((a, b) => a.localeCompare(b)); // Сортируем по алфавиту
  
    setEmployees(updatedEmployees);
    saveToStorage("employees", updatedEmployees);
  };
  

  const removeEmployee = (name) => {
    const updatedEmployees = employees.filter((emp) => emp !== name);
    setEmployees(updatedEmployees);
    saveToStorage("employees", updatedEmployees);
  };

  const handleSaveToFile = () => {
    saveData(employees);
  };

  return (
    <div className="employees-container">
      <h2>Lijst van medewerkers</h2>
      <button onClick={addEmployee} className="add-btn">Medewerker toevoegen</button>
      <button onClick={handleSaveToFile} className="save-btn">💾 Opslaan in bestand</button>
      <ul>
        {employees.map((employee) => (
          <li key={employee}>
            {employee} 
            <button onClick={() => removeEmployee(employee)} className="remove-btn">Medewerker verwijderen</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Employees;
