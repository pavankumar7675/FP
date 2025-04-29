import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import './Dashboard.css';
import './SummaryStats.css';
import './Tables.css';
import './Charts.css';
import './States.css';
import Sidebar from "./Sidebar";

const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#7f8c8d', '#16a085'];

const Dashboard = () => {
  const [year, setYear] = useState("2024");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  // Memoized data processing
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

  const formattedConsolidatedData = useMemo(() => {
    if (!data?.Consolidated) return [];
    return data.Consolidated
      .map(item => ({
        sector: item.SECTOR?.trim() || "Other",
        companies: Number(item.COMPANIES) || 0,
        placed: Number(item.PLACED) || 0,
        avgSalary: Number(item.AVG_SALARY) || 0,
        totalSalary: Number(item.TOTAL_SALARY) || 0,
        companyList: item.COMPANY_LIST || ""
      }));
  }, [data]);

  // Calculate summary statistics
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

  const dashboardContent = (
    <>
      <div className="dashboard-header">
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
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

            <h2>Company-wise Placement Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={formattedCompanyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="company" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="placed" fill="#3498db" name="Placed Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-section">
            <h2>Branch-wise Placement Statistics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedBranchWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="placed" stroke="#3498db" name="Placed Students" />
                <Line type="monotone" dataKey="eligible" stroke="#2ecc71" name="Eligible Students" />
              </LineChart>
            </ResponsiveContainer>

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

          <div className="chart-section">
            <h2>Sector-wise Statistics</h2>
            <div className="sector-charts">
              <div className="pie-chart-container">
                <h3>Sector-wise Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={formattedConsolidatedData}
                      dataKey="placed"
                      nameKey="sector"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                    >
                      {formattedConsolidatedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="pie-chart-container">
                <h3>Salary Distribution by Sector</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={formattedConsolidatedData}
                      dataKey="totalSalary"
                      nameKey="sector"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                    >
                      {formattedConsolidatedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Average Salary by Sector</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formattedConsolidatedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sector" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgSalary" fill="#3498db" name="Average Salary (LPA)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Companies and Placements by Sector</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formattedConsolidatedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sector" angle={-45} textAnchor="end" height={100} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="companies" fill="#2ecc71" name="Number of Companies" />
                    <Bar yAxisId="right" dataKey="placed" fill="#e74c3c" name="Placed Students" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="sector-details">
              <table>
                <thead>
                  <tr>
                    <th>Sector</th>
                    <th>Companies</th>
                    <th>Placed Students</th>
                    <th>Average Salary (LPA)</th>
                    <th>Total Salary (LPA)</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedConsolidatedData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.sector}</td>
                      <td>{item.companies.toLocaleString()}</td>
                      <td>{item.placed.toLocaleString()}</td>
                      <td>{item.avgSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td>{item.totalSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="chart-section">
            <h2>Branch-wise Placement Analysis</h2>
            <div className="branch-charts">
              <div className="chart-container">
                <h3>Placement Rate by Branch</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={formattedBranchWiseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="branch" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="placementRate" stroke="#3498db" fill="#3498db" fillOpacity={0.3} name="Placement Rate (%)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Eligible vs Placed Students</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formattedBranchWiseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="branch" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="eligible" fill="#2ecc71" name="Eligible Students" />
                    <Bar dataKey="placed" fill="#3498db" name="Placed Students" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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