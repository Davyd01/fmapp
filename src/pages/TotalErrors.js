import React, { useState, useEffect } from "react";
import { loadFromStorage } from "../utils/storage";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";

const TotalErrors = () => {
  const [employees, setEmployees] = useState([]);
  const [totalErrors, setTotalErrors] = useState({});

  useEffect(() => {
    const storedEmployees = loadFromStorage("employees") || [];
    setEmployees(storedEmployees);

    const dates = loadFromStorage("dates") || [];
    let aggregatedErrors = {};

    // Проходим по всем датам и суммируем ошибки для каждого сотрудника
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

    // Рассчитываем общий `total`
    Object.keys(aggregatedErrors).forEach((employee) => {
      aggregatedErrors[employee].total =
        aggregatedErrors[employee].blueBox +
        aggregatedErrors[employee].overCount +
        aggregatedErrors[employee].underCount;
    });

    setTotalErrors(aggregatedErrors);
  }, []);

  // Данные для CSV
  const csvData = [
    ["Сотрудник", "Синий ящик", "Перебор книг", "Недобор книг", "Total"],
    ...employees.map((employee) => [
      employee,
      totalErrors[employee]?.blueBox || 0,
      totalErrors[employee]?.overCount || 0,
      totalErrors[employee]?.underCount || 0,
      totalErrors[employee]?.total || 0,
    ]),
  ];

  // Экспорт в Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      employees.map((employee) => ({
        Сотрудник: employee,
        "Синий ящик": totalErrors[employee]?.blueBox || 0,
        "Перебор книг": totalErrors[employee]?.overCount || 0,
        "Недобор книг": totalErrors[employee]?.underCount || 0,
        Total: totalErrors[employee]?.total || 0,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ошибки");
    XLSX.writeFile(workbook, "Ошибки.xlsx");
  };

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
            <tr key={employee}>
              <td>{employee}</td>
              <td>{totalErrors[employee]?.blueBox || 0}</td>
              <td>{totalErrors[employee]?.overCount || 0}</td>
              <td>{totalErrors[employee]?.underCount || 0}</td>
              <td>{totalErrors[employee]?.total || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Кнопки экспорта */}
      <div className="export-buttons">
        <CSVLink data={csvData} filename="Ошибки.csv" className="export-btn">
          Rapport makken(CSV)
        </CSVLink>
        <button onClick={exportToExcel} className="export-btn">
          Rapport makken(Excel)
        </button>
      </div>
    </div>
  );
};

export default TotalErrors;
