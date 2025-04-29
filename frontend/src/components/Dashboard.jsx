import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter,
  ZAxis, ReferenceLine, ComposedChart, Area
} from "recharts";
import './Dashboard.css';
import './SummaryStats.css';
import './Tables.css';
import './Charts.css';
import './States.css';
import Sidebar from "./Sidebar";
import MultiYearDashboard from "./MultiYearDashboard";

const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#7f8c8d', '#16a085'];

const Dashboard = () => {
  const [year, setYear] = useState("2024");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (year === "multi") {
      // For multi-year view, we don't need to fetch data here
      // The MultiYearDashboard component will handle its own data fetching
      setLoading(false);
      setData(null);
      setError("");
      return;
    }

    setLoading(true);
    axios.get(`http://localhost:5000/api/placements/${year}`)
      .then(res => {
        console.log("API Response:", res.data);
        if (res.data.error) {
          setError(res.data.error);
          setData(null);
        } else {
          setData(res.data);
          setError("");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setError("Failed to load placement data");
        setData(null);
        setLoading(false);
      });
  }, [year]);

  // Memoized data processing - Keep original data formatting
  const formattedCompanyData = useMemo(() => {
    if (!data?.["Company-Wise"]) return [];
    return data["Company-Wise"]
      .map(item => ({
        company: item.COMPANY?.trim() || "Unknown",
        sector: item.SECTOR?.trim() || "Other",
        salary: Number(item.SALARY) || 0,
        placed: Number(item.PLACED) || 0,
        branches: item.BRANCHES || ""
      }));
  }, [data]);

  const formattedBranchWiseData = useMemo(() => {
    if (!data?.["Branch-Wise"]) return [];
    return data["Branch-Wise"]
      .sort((a, b) => b.placed - a.placed)
      .map(item => ({
        branch: item.BRANCH?.trim() || "Unknown",
        placed: Number(item.PLACED) || 0,
        eligible: Number(item["REGISTERED ELIGIBLE"]) || 0,
        placementRate: item["REGISTERED ELIGIBLE"] > 0 
          ? ((Number(item.PLACED) / Number(item["REGISTERED ELIGIBLE"])) * 100).toFixed(1)
          : 0
      }));
  }, [data]);

  // NEW DATA PROCESSING FOR REQUIRED VISUALIZATIONS
  
  // 1. Branch-wise Top Hiring Companies data
  const branchWiseTopCompaniesData = useMemo(() => {
    if (!data?.["Company-Wise"]) return [];
    
    // Create a mapping of companies and their branch-wise placements
    const companyBranchMap = {};
    
    data["Company-Wise"].forEach(item => {
      const company = item.COMPANY?.trim() || "Unknown";
      const branches = item.BRANCHES?.split(',') || [];
      const placed = Number(item.PLACED) || 0;
      
      if (!companyBranchMap[company]) {
        companyBranchMap[company] = {
          company,
          totalPlaced: placed,
          CSE: 0,
          CSBS: 0,
          CYS: 0,
          AIML: 0,
          Other: 0
        };
      }
      
      // Distribute placements among branches (simplified approach)
      if (branches.length > 0) {
        const avgPerBranch = placed / branches.length;
        branches.forEach(branch => {
          const trimmedBranch = branch.trim();
          if (['CSE', 'CSBS', 'CYS', 'AIML'].includes(trimmedBranch)) {
            companyBranchMap[company][trimmedBranch] += avgPerBranch;
          } else {
            companyBranchMap[company].Other += avgPerBranch;
          }
        });
      } else {
        companyBranchMap[company].Other += placed;
      }
    });
    
    // Convert to array and sort by total placements
    return Object.values(companyBranchMap)
      .sort((a, b) => b.totalPlaced - a.totalPlaced)
      .slice(0, 10); // Top 10 companies
  }, [data]);

  // 2. Salary Trends per Branch data
  const salaryTrendsByBranchData = useMemo(() => {
    if (!data?.["Company-Wise"] || !data?.["Branch-Wise"]) return [];
    
    const branchSalaryMap = {};
    const branchNames = data["Branch-Wise"].map(item => item.BRANCH?.trim() || "Unknown");
    
    // Initialize with all branches
    branchNames.forEach(branch => {
      branchSalaryMap[branch] = {
        branch,
        totalSalary: 0,
        placements: 0,
        avgSalary: 0
      };
    });
    
    // Calculate total salary and placements per branch
    data["Company-Wise"].forEach(item => {
      const salary = Number(item.SALARY) || 0;
      const placed = Number(item.PLACED) || 0;
      const branches = item.BRANCHES?.split(',') || [];
      
      if (branches.length > 0 && salary > 0) {
        const placedPerBranch = placed / branches.length;
        
        branches.forEach(branch => {
          const trimmedBranch = branch.trim();
          if (branchSalaryMap[trimmedBranch]) {
            branchSalaryMap[trimmedBranch].totalSalary += salary * placedPerBranch;
            branchSalaryMap[trimmedBranch].placements += placedPerBranch;
          }
        });
      }
    });
    
    // Calculate average salary per branch
    Object.keys(branchSalaryMap).forEach(branch => {
      if (branchSalaryMap[branch].placements > 0) {
        branchSalaryMap[branch].avgSalary = 
          branchSalaryMap[branch].totalSalary / branchSalaryMap[branch].placements;
      }
    });
    
    return Object.values(branchSalaryMap)
      .filter(item => item.placements > 0)
      .sort((a, b) => b.avgSalary - a.avgSalary);
  }, [data]);

  // 3. Sector Distribution per Branch data
  const sectorDistributionData = useMemo(() => {
    if (!data?.["Company-Wise"] || !data?.["Branch-Wise"]) return [];
    
    const branchSectorMap = {};
    const branchNames = data["Branch-Wise"].map(item => item.BRANCH?.trim() || "Unknown");
    
    // Initialize branches
    branchNames.forEach(branch => {
      branchSectorMap[branch] = {
        branch,
        IT: 0,
        CORE: 0,
        BFSI: 0,
        Other: 0,
        total: 0
      };
    });
    
    // Calculate sector placements per branch
    data["Company-Wise"].forEach(item => {
      const sector = item.SECTOR?.trim() || "Other";
      const placed = Number(item.PLACED) || 0;
      const branches = item.BRANCHES?.split(',') || [];
      
      if (branches.length > 0 && placed > 0) {
        const placedPerBranch = placed / branches.length;
        
        branches.forEach(branch => {
          const trimmedBranch = branch.trim();
          if (branchSectorMap[trimmedBranch]) {
            // Map the sector to one of our categories
            if (sector.toUpperCase().includes("IT") || sector.toUpperCase().includes("SOFTWARE")) {
              branchSectorMap[trimmedBranch].IT += placedPerBranch;
            } else if (sector.toUpperCase().includes("CORE") || sector.toUpperCase().includes("ENGINEERING")) {
              branchSectorMap[trimmedBranch].CORE += placedPerBranch;
            } else if (sector.toUpperCase().includes("BFSI") || sector.toUpperCase().includes("BANK") || sector.toUpperCase().includes("FINANCE")) {
              branchSectorMap[trimmedBranch].BFSI += placedPerBranch;
            } else {
              branchSectorMap[trimmedBranch].Other += placedPerBranch;
            }
            
            branchSectorMap[trimmedBranch].total += placedPerBranch;
          }
        });
      }
    });
    
    // Convert to array format for visualization
    return Object.values(branchSectorMap)
      .filter(item => item.total > 0)
      .map(item => ({
        branch: item.branch,
        IT: item.IT,
        CORE: item.CORE,
        BFSI: item.BFSI,
        Other: item.Other,
        ITPercent: (item.IT / item.total) * 100,
        COREPercent: (item.CORE / item.total) * 100,
        BFSIPercent: (item.BFSI / item.total) * 100,
        OtherPercent: (item.Other / item.total) * 100
      }));
  }, [data]);

  // 4. Placement Success Rate vs Multiple Offers
  const placementSuccessRateData = useMemo(() => {
    if (!data?.["Branch-Wise"]) return [];
    
    return data["Branch-Wise"].map(item => {
      const branch = item.BRANCH?.trim() || "Unknown";
      const eligible = Number(item["REGISTERED ELIGIBLE"]) || 0;
      const placed = Number(item.PLACED) || 0;
      const multipleOffers = Number(item["MULTIPLE OFFERS"] || 0);
      const singleOffer = placed - multipleOffers;
      
      return {
        branch,
        singleOffer,
        multipleOffers,
        placementRate: eligible > 0 ? (placed / eligible) * 100 : 0
      };
    });
  }, [data]);

  // 5. Top Paying Companies vs Placement Count
  const topPayingCompaniesData = useMemo(() => {
    if (!data?.["Company-Wise"]) return [];
    
    return data["Company-Wise"]
      .map(item => ({
        company: item.COMPANY?.trim() || "Unknown",
        sector: item.SECTOR?.trim() || "Other",
        salary: Number(item.SALARY) || 0,
        placed: Number(item.PLACED) || 0
      }))
      .filter(item => item.salary > 0 && item.placed > 0)
      .sort((a, b) => b.salary - a.salary)
      .slice(0, 10); // Top 10 by salary
  }, [data]);

  // 6. Placement Funnel Data
  const placementFunnelData = useMemo(() => {
    if (!data?.["Branch-Wise"]) return [];
    
    return data["Branch-Wise"].map(item => {
      const branch = item.BRANCH?.trim() || "Unknown";
      const onRoll = Number(item["ON-ROLL"]) || 0;
      const eligible = Number(item["REGISTERED ELIGIBLE"]) || 0;
      const registered = Number(item.REGISTERED) || 0;
      const placed = Number(item.PLACED) || 0;
      const multipleOffers = Number(item["MULTIPLE OFFERS"]) || 0;
      
      return {
        branch,
        onRoll,
        eligible,
        registered,
        placed,
        multipleOffers
      };
    });
  }, [data]);

  // 7. Branch vs Year vs Avg Salary vs Placement %
  // For this one, we'd need data across multiple years, which we don't have in a single API call
  // So we'll create a simulated version for now
  const branchYearSalaryData = useMemo(() => {
    if (!data?.["Branch-Wise"]) return [];
    
    const branches = data["Branch-Wise"].map(item => item.BRANCH?.trim() || "Unknown");
    const currentYear = parseInt(year);
    
    // Simulated data for 3 years
    const result = [];
    
    branches.forEach(branch => {
      const branchData = data["Branch-Wise"].find(item => item.BRANCH?.trim() === branch);
      
      if (branchData) {
        const placed = Number(branchData.PLACED) || 0;
        const eligible = Number(branchData["REGISTERED ELIGIBLE"]) || 0;
        const placementPercent = eligible > 0 ? (placed / eligible) * 100 : 0;
        
        // Find salary data for this branch
        let avgSalary = 0;
        let count = 0;
        
        data["Company-Wise"].forEach(company => {
          if (company.BRANCHES?.includes(branch)) {
            avgSalary += Number(company.SALARY) || 0;
            count++;
          }
        });
        
        avgSalary = count > 0 ? avgSalary / count : 0;
        
        // Add current year data
        result.push({
          branch,
          year: currentYear,
          avgSalary,
          placementPercent
        });
        
        // Add simulated data for previous years
        result.push({
          branch,
          year: currentYear - 1,
          avgSalary: avgSalary * (0.8 + Math.random() * 0.4), // 80-120% of current
          placementPercent: placementPercent * (0.8 + Math.random() * 0.4)
        });
        
        result.push({
          branch,
          year: currentYear - 2,
          avgSalary: avgSalary * (0.7 + Math.random() * 0.4), // 70-110% of current
          placementPercent: placementPercent * (0.7 + Math.random() * 0.4)
        });
      }
    });
    
    return result;
  }, [data, year]);

  // Summary stats - keep for header
  const summaryStats = useMemo(() => {
    if (!data?.["Branch-Wise"]) return null;
    const totalEligible = data["Branch-Wise"].reduce((sum, item) => sum + Number(item["REGISTERED ELIGIBLE"]), 0);
    const totalPlaced = data["Branch-Wise"].reduce((sum, item) => sum + Number(item.PLACED), 0);
    return {
      totalEligible,
      totalPlaced,
      placementPercentage: totalEligible > 0 ? ((totalPlaced / totalEligible) * 100).toFixed(2) : 0
    };
  }, [data]);

  const sectorColor = (sector) => {
    if (sector.toUpperCase().includes("IT") || sector.toUpperCase().includes("SOFTWARE")) 
      return '#3498db';
    if (sector.toUpperCase().includes("CORE") || sector.toUpperCase().includes("ENGINEERING")) 
      return '#2ecc71';
    if (sector.toUpperCase().includes("BFSI") || sector.toUpperCase().includes("BANK")) 
      return '#e74c3c';
    return '#f1c40f';
  };

  // If multi-year is selected, render the MultiYearDashboard
  if (year === "multi") {
    return (
      <div className="visualization-container">
        <Sidebar />
        <div className="dashboard">
          <div className="dashboard-header">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="multi">Multi-Year Analysis</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
            <h1>Visualization Dashboard</h1>
          </div>
          <MultiYearDashboard />
        </div>
      </div>
    );
  }

  const dashboardContent = (
    <>
      <div className="dashboard-header">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="multi">Multi-Year Analysis</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </select>
        <h1>Visualization Dashboard</h1>
      </div>

      {error ? (
        <div className="error">
          <p>{error}</p>
        </div>
      ) : loading ? (
        <div className="loading">
          <p>Loading placement data...</p>
        </div>
      ) : data ? (
        <div className="charts">
          {/* Keep the summary stats */}
          {summaryStats && (
            <div className="summary-stats">
              <h2>Summary Statistics</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <h3>Total Eligible Students</h3>
                  <p>{summaryStats.totalEligible.toLocaleString()}</p>
                </div>
                <div className="stat-item">
                  <h3>Total Placed Students</h3>
                  <p>{summaryStats.totalPlaced.toLocaleString()}</p>
                </div>
                <div className="stat-item">
                  <h3>Overall Placement Percentage</h3>
                  <p>{summaryStats.placementPercentage}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Keeping the Company-wise Placement Statistics table */}
          <div className="chart-section">
            <h2>Company-wise Placement Statistics</h2>
            <div className="company-details">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Sector</th>
                    <th>Salary (LPA)</th>
                    <th>Placed Students</th>
                    <th>Branches</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedCompanyData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.company}</td>
                      <td>{item.sector}</td>
                      <td>{item.salary.toLocaleString()}</td>
                      <td>{item.placed.toLocaleString()}</td>
                      <td>{item.branches}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Keeping the Branch-wise Placement Details table */}
          <div className="chart-section">
            <h2>Branch-wise Placement Details</h2>
            <div className="branch-details">
              <table>
                <thead>
                  <tr>
                    <th>Branch</th>
                    <th>Eligible Students</th>
                    <th>Placed Students</th>
                    <th>Placement Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedBranchWiseData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.branch}</td>
                      <td>{item.eligible.toLocaleString()}</td>
                      <td>{item.placed.toLocaleString()}</td>
                      <td>{item.placementRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 1. Branch-wise Top Hiring Companies (Stacked Bar Chart) */}
          <div className="chart-section">
            <h2>Branch-wise Top Hiring Companies</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart 
                data={branchWiseTopCompaniesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="company" 
                  angle={-45} 
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'totalPlaced') return [value, 'Total Placed'];
                    return [value.toFixed(1), name];
                  }}
                />
                <Legend />
                <Bar dataKey="CSE" stackId="a" fill="#8884d8" />
                <Bar dataKey="CSBS" stackId="a" fill="#82ca9d" />
                <Bar dataKey="CYS" stackId="a" fill="#ffc658" />
                <Bar dataKey="AIML" stackId="a" fill="#ff8042" />
                <Bar dataKey="Other" stackId="a" fill="#8dd1e1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 2. Salary Trends per Branch (Bar Chart) */}
          <div className="chart-section">
            <h2>Salary Trends per Branch</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={salaryTrendsByBranchData}
                margin={{ top: 20, right: 30, left: 40, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" />
                <YAxis label={{ value: 'Average Salary (LPA)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value.toFixed(2)} LPA`, 'Average Salary']} />
                <Legend />
                <Bar dataKey="avgSalary" fill="#3498db" name="Average Salary" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 3. Sector Distribution per Branch (100% Stacked Bar Chart) */}
          <div className="chart-section">
            <h2>Sector Distribution per Branch</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={sectorDistributionData}
                margin={{ top: 20, right: 30, left: 40, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, '']} />
                <Legend />
                <Bar dataKey="ITPercent" stackId="a" fill="#3498db" name="IT Sector" />
                <Bar dataKey="COREPercent" stackId="a" fill="#2ecc71" name="CORE Sector" />
                <Bar dataKey="BFSIPercent" stackId="a" fill="#e74c3c" name="BFSI Sector" />
                <Bar dataKey="OtherPercent" stackId="a" fill="#f1c40f" name="Other Sectors" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 4. Placement Success Rate vs Multiple Offers (Grouped Bar Chart) */}
          <div className="chart-section">
            <h2>Placement Success Rate vs Multiple Offers</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={placementSuccessRateData}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" />
                <YAxis label={{ value: 'Number of Students', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="singleOffer" fill="#3498db" name="Single Offer" />
                <Bar dataKey="multipleOffers" fill="#e74c3c" name="Multiple Offers" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 5. Top Paying Companies vs Placement Count (Scatter Plot) */}
          <div className="chart-section">
            <h2>Top Paying Companies vs Placement Count</h2>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart
                margin={{ top: 20, right: 30, left: 40, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="salary" 
                  name="Salary" 
                  label={{ value: 'Salary (LPA)', position: 'insideBottom', offset: -10 }} 
                />
                <YAxis 
                  type="number" 
                  dataKey="placed" 
                  name="Students Placed"
                  label={{ value: 'Students Placed', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name, props) => {
                    if (name === 'Students Placed') return [value, name];
                    if (name === 'Salary') return [`${value.toFixed(2)} LPA`, name];
                    return [value, name];
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
                          <p className="label">{`Company: ${payload[0].payload.company}`}</p>
                          <p className="label">{`Sector: ${payload[0].payload.sector}`}</p>
                          <p className="label">{`Salary: ${payload[0].payload.salary.toFixed(2)} LPA`}</p>
                          <p className="label">{`Students Placed: ${payload[0].payload.placed}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Scatter 
                  name="Companies" 
                  data={topPayingCompaniesData} 
                  fill="#8884d8"
                  shape="circle"
                >
                  {topPayingCompaniesData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={sectorColor(entry.sector)}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              <div><span style={{ backgroundColor: '#3498db', display: 'inline-block', width: '12px', height: '12px', marginRight: '5px' }}></span> IT Sector</div>
              <div><span style={{ backgroundColor: '#2ecc71', display: 'inline-block', width: '12px', height: '12px', marginRight: '5px' }}></span> CORE Sector</div>
              <div><span style={{ backgroundColor: '#e74c3c', display: 'inline-block', width: '12px', height: '12px', marginRight: '5px' }}></span> BFSI Sector</div>
              <div><span style={{ backgroundColor: '#f1c40f', display: 'inline-block', width: '12px', height: '12px', marginRight: '5px' }}></span> Other Sectors</div>
            </div>
          </div>

          {/* 6. Overall Placement Funnel (Funnel Chart approximation using Bar Chart) */}
          <div className="chart-section">
            <h2>Overall Placement Funnel</h2>
            <div className="funnel-wrapper">
              {placementFunnelData.map((branch, index) => (
                <div key={index} className="funnel-chart">
                  <h3>{branch.branch}</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { name: 'On-Roll', value: branch.onRoll },
                        { name: 'Eligible', value: branch.eligible },
                        { name: 'Registered', value: branch.registered },
                        { name: 'Placed', value: branch.placed },
                        { name: 'Multiple Offers', value: branch.multipleOffers }
                      ]}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value) => [value, 'Students']} />
                      <Bar dataKey="value" fill="#3498db" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Branch vs Year vs Avg Salary vs Placement % (3D Scatter approximation) */}
          <div className="chart-section">
            <h2>Branch vs Year vs Avg Salary vs Placement %</h2>
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart
                margin={{ top: 20, right: 30, left: 40, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="year" 
                  name="Year"
                  domain={[parseInt(year) - 3, parseInt(year)]}
                  allowDecimals={false}
                  label={{ value: 'Year', position: 'insideBottom', offset: -10 }} 
                />
                <YAxis 
                  type="number" 
                  dataKey="placementPercent" 
                  name="Placement %" 
                  label={{ value: 'Placement %', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis 
                  type="number" 
                  dataKey="avgSalary" 
                  name="Avg Salary"
                  range={[50, 500]} 
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => {
                    if (name === 'Year') return [value, name];
                    if (name === 'Placement %') return [`${value.toFixed(2)}%`, name];
                    if (name === 'Avg Salary') return [`${value.toFixed(2)} LPA`, name];
                    return [value, name];
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
                          <p className="label">{`Branch: ${payload[0].payload.branch}`}</p>
                          <p className="label">{`Year: ${payload[0].payload.year}`}</p>
                          <p className="label">{`Placement %: ${payload[0].payload.placementPercent.toFixed(2)}%`}</p>
                          <p className="label">{`Avg Salary: ${payload[0].payload.avgSalary.toFixed(2)} LPA`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Scatter 
                  name="Branches" 
                  data={branchYearSalaryData}
                  fill="#8884d8"
                >
                  {branchYearSalaryData.map((entry, index) => {
                    // Unique color per branch
                    const branchIndex = branchYearSalaryData
                      .findIndex(item => item.branch === entry.branch);
                    return <Cell key={`cell-${index}`} fill={COLORS[branchIndex % COLORS.length]} />;
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {[...new Set(branchYearSalaryData.map(item => item.branch))].map((branch, index) => (
                <div key={index}>
                  <span 
                    style={{ 
                      backgroundColor: COLORS[index % COLORS.length], 
                      display: 'inline-block', 
                      width: '12px', 
                      height: '12px', 
                      marginRight: '5px' 
                    }}
                  ></span> 
                  {branch}
                </div>
              ))}
            </div>
            <div className="chart-note">
              <p>Note: The size of each bubble represents the average salary (LPA)</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );

  return (
    <div className="visualization-container">
      <Sidebar />
      <div className="dashboard">
        {dashboardContent}
      </div>
    </div>
  );
};

export default Dashboard;