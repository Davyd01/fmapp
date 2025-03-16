import React, { useState, useEffect } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    setEmployees(loadFromStorage("employees") || []);
  }, []);

  const addEmployee = () => {
    const name = prompt("Введите имя сотрудника:");
    if (name) {
      const updatedEmployees = [...employees, name];
      setEmployees(updatedEmployees);
      saveToStorage("employees", updatedEmployees);
    }
  };

  const removeEmployee = (name) => {
    const updatedEmployees = employees.filter((emp) => emp !== name);
    setEmployees(updatedEmployees);
    saveToStorage("employees", updatedEmployees);
  };

  return (
    <div className="employees-container">
      <h2>Lijst van medewerkers</h2>
      <button onClick={addEmployee} className="add-btn">Medewerker toevoegen</button>
      <ul>
        {employees.map((employee) => (
          <li key={employee}>
            {employee} <button onClick={() => removeEmployee(employee)} className="remove-btn">Medewerker verwijderen</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Employees;
