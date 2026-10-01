import React from "react";
const InventoryCountTableDisplay = ({ data }) => {
  const columns = data[0] && Object.keys(data[0]);

  return (
    <table className="table">
      <thead>
        <tr>
          {data[0] &&
            columns.map((header) => (
              <th className="text-uppercase">{header}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.date}>
            {columns.map((column) => (
              <td>{row[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryCountTableDisplay;
