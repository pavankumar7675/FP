const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors
const path = require("path");
const AdminAPI = require("./APIs/adminApi");
const fs = require("fs");
const PORT = process.env.PORT || 9000;
const app = express();

// Enable CORS
app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from the frontend

// Function to clean and format branch data
const processBranchData = (data) => {
  if (!data || data.length === 0) {
    console.log("Branch-Wise Data is Empty!");
    return [];
  }

  // Filter out the "Total" row and format the data
  return data
    .filter(row => row.Branch && row.Branch.trim() !== "" && row.Branch !== "Total")
    .map(row => ({
      BRANCH: row.Branch,
      "REGISTERED ELIGIBLE": Number(row["Total Registered Eligible"]) || 0,
      PLACED: Number(row["Total Single Offer Placed"]) || 0,
      "PLACEMENT RATE": Number(row["Total %(Single)"]) || 0
    }));
};

// Function to process company-wise data
const processCompanyData = (data) => {
  if (!data || data.length === 0) {
    console.log("Company-Wise Data is Empty!");
    return [];
  }

  // Group by company and calculate total placements
  const companyData = data.reduce((acc, row) => {
    const company = row["Name of the Company"];
    if (!acc[company]) {
      acc[company] = {
        COMPANY: company,
        SECTOR: row.sector || "Other",
        SALARY: Number(row.Salary) || 0,
        PLACED: Number(row.Count) || 0,
        BRANCHES: new Set()
      };
    } else {
      acc[company].PLACED += Number(row.Count) || 0;
      // Update salary if higher
      if (Number(row.Salary) > acc[company].SALARY) {
        acc[company].SALARY = Number(row.Salary);
      }
    }
    acc[company].BRANCHES.add(row.Branch);
    return acc;
  }, {});

  // Convert to array and sort by number of placements
  return Object.values(companyData)
    .map(company => ({
      ...company,
      BRANCHES: Array.from(company.BRANCHES).join(", ")
    }))
    .sort((a, b) => b.PLACED - a.PLACED);
};

// Function to process consolidated data
const processConsolidatedData = (data) => {
  if (!data || data.length === 0) {
    console.log("Consolidated Data is Empty!");
    return [];
  }

  // Group by sector and calculate statistics
  const sectorData = data.reduce((acc, row) => {
    const sector = row.sector || "Other";
    if (!acc[sector]) {
      acc[sector] = {
        SECTOR: sector,
        COMPANIES: 0,
        PLACED: 0,
        "AVG_SALARY": 0,
        "TOTAL_SALARY": 0,
        "COMPANY_LIST": new Set()
      };
    }
    acc[sector].COMPANY_LIST.add(row["Name of the Company"]);
    acc[sector].COMPANIES = acc[sector].COMPANY_LIST.size;
    acc[sector].PLACED += Number(row.Count) || 0;
    acc[sector].TOTAL_SALARY += Number(row.Salary) || 0;
    acc[sector].AVG_SALARY = acc[sector].TOTAL_SALARY / acc[sector].COMPANIES;
    return acc;
  }, {});

  // Convert to array and sort by number of placements
  return Object.values(sectorData)
    .map(sector => ({
      ...sector,
      COMPANY_LIST: Array.from(sector.COMPANY_LIST).join(", ")
    }))
    .sort((a, b) => b.PLACED - a.PLACED);
};

// Function to read JSON files and extract data
const getPlacementData = (year) => {
    const branchFilePath = `./data/placements_${year}.json`;
    const companyFilePath = `./data/Placement_Data${year}.json`;

    if (!fs.existsSync(branchFilePath) || !fs.existsSync(companyFilePath)) {
        return { error: "Files not found" };
    }

    try {
        const branchData = JSON.parse(fs.readFileSync(branchFilePath, 'utf8'));
        const companyData = JSON.parse(fs.readFileSync(companyFilePath, 'utf8'));
        
        return { 
            "Branch-Wise": processBranchData(branchData.Cleaned_Branch_Wise),
            "Company-Wise": processCompanyData(companyData.Cleaned_Data),
            "Consolidated": processConsolidatedData(companyData.Cleaned_Data)
        };
    } catch (error) {
        console.error("Error processing JSON files:", error);
        return { error: "Error processing JSON files" };
    }
};

// API to fetch placement data for a specific year
app.get("/api/placements/:year", (req, res) => {
    const year = req.params.year;
    const data = getPlacementData(year);
    res.json(data);
});

mongoose
  .connect("mongodb+srv://mdarbazking7:Mdarbaz123@cluster0.fir8b.mongodb.net/placements")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API Routes
app.use("/api", AdminAPI);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));