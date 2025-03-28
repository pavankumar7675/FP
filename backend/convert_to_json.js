const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

// Define the input Excel file path
const inputFilePath = path.join(__dirname, "./data/placements_2024.xlsx");

// Read Excel File
const workbook = xlsx.readFile(inputFilePath);

// Extract sheets and convert them to JSON
const sheetsToConvert = ["CONSOLIDATED", "Branch-Wise"]; // Ensure correct sheet names
const outputData = {};

sheetsToConvert.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    if (sheet) {
        outputData[sheetName] = xlsx.utils.sheet_to_json(sheet);
    } else {
        console.warn(`Sheet '${sheetName}' not found in the Excel file.`);
    }
});

// Save JSON data to file
const outputFilePath = path.join(__dirname, "./data/placements_2024.json");
fs.writeFileSync(outputFilePath, JSON.stringify(outputData, null, 2));

console.log("Excel data successfully converted to JSON!");
