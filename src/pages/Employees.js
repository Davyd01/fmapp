import React, { useState, useEffect } from "react";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { loadData, saveData } from "../utils/dataService";

const Employees = () => {
  const [employees, setEmployees] = useState([]);

  // Загружаем данные из localStorage и файла
  useEffect(() => {
    const localData = loadFromStorage("employees") || [];
    loadData().then((fileData) => {
      const mergedData = [...new Set([...localData, ...fileData])]
        .sort((a, b) => a.localeCompare(b)); // Сортируем по алфавиту
      setEmployees(mergedData);
      saveToStorage("employees", mergedData);
    });
  }, []);

  // Добавить сотрудника
  const addEmployee = () => {
    const name = prompt("Введите имя сотрудника:").trim();
    if (!name) return;

    if (employees.includes(name)) {
      alert("Этот сотрудник уже есть в списке!");
      return;
    }

    const updatedEmployees = [...employees, name]
      .sort((a, b) => a.localeCompare(b)); // Сортируем по алфавиту

    setEmployees(updatedEmployees);
    saveToStorage("employees", updatedEmployees);
  };

  // Удалить сотрудника
  const removeEmployee = (name) => {
    const isConfirmed = window.confirm(`Вы уверены, что хотите удалить сотрудника "${name}"?`);
    if (!isConfirmed) return;
  
    const updatedEmployees = employees.filter((emp) => emp !== name);
    setEmployees(updatedEmployees);
    saveToStorage("employees", updatedEmployees);
  };
  

  // Переименовать сотрудника
  const renameEmployee = (oldName) => {
    const newName = prompt("Введите новое имя:", oldName).trim();
    if (!newName || newName === oldName) return;

    if (employees.includes(newName)) {
      alert("Сотрудник с таким именем уже есть!");
      return;
    }

    const updatedEmployees = employees.map((emp) =>
      emp === oldName ? newName : emp
    ).sort((a, b) => a.localeCompare(b));

    setEmployees(updatedEmployees);
    saveToStorage("employees", updatedEmployees);
  };

  const handleSaveToFile = () => {
    saveData(employees);
  };

  return (
    <div className="employees-container">
      <h2>Lijst van medewerkers</h2>
      <div className="buttons">
        <button onClick={addEmployee} className="add-btn">Medewerker toevoegen</button>
        <button onClick={handleSaveToFile} className="save-btn">Opslaan in bestand</button>
      </div>
      <table className="employees-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Medewerker</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee}>
              <td>{index + 1}</td>
              <td>{employee}</td>
              <td>
                <button onClick={() => renameEmployee(employee)} className="edit-btn">✏️ Bewerken</button>
                <button onClick={() => removeEmployee(employee)} className="remove-btn">🗑️ Verwijderen</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
