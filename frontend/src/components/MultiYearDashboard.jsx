import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YearWisePlacementRateTrend from './YearWisePlacementRateTrend';
import AverageSalaryGrowth from './AverageSalaryGrowth';
import TopCompaniesHeatmap from './TopCompaniesHeatmap';
import SectorWisePlacementTrend from './SectorWisePlacementTrend';
import MultipleOffersTrend from './MultipleOffersTrend';
import './Dashboard.css';
import './Charts.css';

const MultiYearDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // We need to fetch data for all years
    const years = ['2021', '2022', '2023', '2024'];
    const promises = years.map(year => 
      axios.get(`http://localhost:5000/api/placements/${year}`)
    );
    
    Promise.all(promises)
      .then(responses => {
        // Process and combine all year data
        const combinedData = responses.reduce((result, res, index) => {
          if (res.data && !res.data.error) {
            const yearData = res.data;
            const year = years[index];
            
            // Process branch-wise data
            const branchData = yearData["Branch-Wise"]?.map(item => ({
              year,
              branch: item.BRANCH?.trim() || "Unknown",
              placed: Number(item.PLACED) || 0,
              eligible: Number(item["REGISTERED ELIGIBLE"]) || 0,
              placementRate: item["REGISTERED ELIGIBLE"] > 0 
                ? ((Number(item.PLACED) / Number(item["REGISTERED ELIGIBLE"])) * 100)
                : 0,
              multipleOffers: Number(item["MULTIPLE OFFERS"] || 0)
            })) || [];
            
            // Process company-wise data
            const companyData = yearData["Company-Wise"]?.map(item => ({
              year,
              company: item.COMPANY?.trim() || "Unknown",
              sector: item.SECTOR?.trim() || "Other",
              salary: Number(item.SALARY) || 0,
              placed: Number(item.PLACED) || 0,
              branches: item.BRANCHES || ""
            })) || [];
            
            // Process salary data by branch
            const branchSalaryMap = {};
            
            // Initialize all branches
            branchData.forEach(item => {
              branchSalaryMap[item.branch] = {
                year,
                branch: item.branch,
                totalSalary: 0,
                count: 0
              };
            });
            
            // Calculate total salary and count for each branch
            companyData.forEach(company => {
              const branches = company.branches.split(',').map(b => b.trim());
              const placedPerBranch = company.placed / branches.length;
              
              branches.forEach(branch => {
                if (branchSalaryMap[branch]) {
                  branchSalaryMap[branch].totalSalary += company.salary * placedPerBranch;
                  branchSalaryMap[branch].count += placedPerBranch;
                }
              });
            });
            
            // Calculate average salary for each branch
            const salaryData = Object.values(branchSalaryMap).map(item => ({
              year,
              branch: item.branch,
              averageSalary: item.count > 0 ? item.totalSalary / item.count : 0
            }));
            
            return {
              branchData: [...result.branchData, ...branchData],
              companyData: [...result.companyData, ...companyData],
              salaryData: [...result.salaryData, ...salaryData]
            };
          }
          return result;
        }, { branchData: [], companyData: [], salaryData: [] });
        
        setData(combinedData);
        setError("");
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setError("Failed to load multi-year placement data");
        setData(null);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <p>Loading multi-year placement data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error">
        <p>No data available for multi-year analysis</p>
      </div>
    );
  }

  const { branchData, companyData, salaryData } = data;

  return (
    <div className="charts">
      <div className="dashboard-header">
        <h1>Multi-Year Placement Analysis</h1>
      </div>
      
      {/* Year-wise Placement Rate Trend per Branch */}
      <div className="chart-section">
        <YearWisePlacementRateTrend data={branchData} />
      </div>
      
      {/* Average Salary Growth per Branch */}
      <div className="chart-section">
        <AverageSalaryGrowth data={salaryData} />
      </div>
      
      {/* Top Companies Hiring Every Year */}
      <div className="chart-section">
        <TopCompaniesHeatmap data={companyData} />
      </div>
      
      {/* Sector-wise Placement Split Over Years */}
      <div className="chart-section">
        <SectorWisePlacementTrend data={companyData} />
      </div>
      
      {/* Multiple Offers Trend */}
      <div className="chart-section">
        <MultipleOffersTrend data={branchData} />
      </div>
    </div>
  );
};

export default MultiYearDashboard; 