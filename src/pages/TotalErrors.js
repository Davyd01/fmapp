import React, { useState, useEffect } from "react";
import { loadFromStorage } from "../utils/storage";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";

const TotalErrors = () => {
  const [employees, setEmployees] = useState([]);
  const [totalErrors, setTotalErrors] = useState({});
  const [maxErrorsEmployee, setMaxErrorsEmployee] = useState(null);

  useEffect(() => {
    const storedEmployees = loadFromStorage("employees") || [];
    setEmployees(storedEmployees);

    const dates = loadFromStorage("dates") || [];
    let aggregatedErrors = {};

    // Считаем ошибки
    dates.forEach((date) => {
      const errors = loadFromStorage(`errors_${date}`) || {};

      Object.entries(errors).forEach(([employee, errorData]) => {
        if (!aggregatedErrors[employee]) {
          aggregatedErrors[employee] = { blueBox: 0, overCount: 0, underCount: 0, total: 0 };
        }

        aggregatedErrors[employee].blueBox += errorData.blueBox || 0;
        aggregatedErrors[employee].overCount += errorData.overCount || 0;
        aggregatedErrors[employee].underCount += errorData.underCount || 0;
      });
    });

    // Подсчитываем общий `total`
    let maxErrors = 0;
    let maxEmployee = null;
    
    Object.keys(aggregatedErrors).forEach((employee) => {
      aggregatedErrors[employee].total =
        aggregatedErrors[employee].blueBox +
        aggregatedErrors[employee].overCount +
        aggregatedErrors[employee].underCount;

      // Определяем человека с наибольшим числом ошибок
      if (aggregatedErrors[employee].total > maxErrors) {
        maxErrors = aggregatedErrors[employee].total;
        maxEmployee = employee;
      }
    });

    setTotalErrors(aggregatedErrors);
    setMaxErrorsEmployee(maxEmployee);
  }, []);

  return (
    <div className="total-errors-container">
      <h2>Algemeen foutenrapport</h2>
      <table className="errors-table">
        <thead>
          <tr>
            <th>Medewerker</th>
            <th>Blauw bakke</th>
            <th>Meer boeken</th>
            <th>Minder boeken</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee} className={employee === maxErrorsEmployee ? "highlighted" : ""}>
              <td>{employee}</td>
              <td>{totalErrors[employee]?.blueBox || 0}</td>
              <td>{totalErrors[employee]?.overCount || 0}</td>
              <td>{totalErrors[employee]?.underCount || 0}</td>
              <td>{totalErrors[employee]?.total || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TotalErrors;
