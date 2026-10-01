import React from "react";
import { saveAs } from "file-saver";

// This function converts an array of objects to a CSV string.
const convertArrayOfObjectsToCSV = (array, preheader) => {
  if (!array || !array.length) {
    return null;
  }

  const headers = Object.keys(array[0]);
  const csvData = [
    ...preheader,
    headers.join(","), // header row
    ...array.map((row) =>
      headers
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    ),
  ];

  return csvData.join("\r\n");
};

const replacer = (key, value) => (value === null ? "" : value); // Handle null values

const CsvDownloader = ({ preheader, data, fileName, buttonName }) => {
  const buttonText = buttonName || "Download CSV";
  const downloadCSV = () => {
    const csvString = convertArrayOfObjectsToCSV(data, preheader);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, fileName);
  };

  return (
    <button className="btn btn-dark" onClick={downloadCSV}>
      {buttonText}
    </button>
  );
};

export default CsvDownloader;
