import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from 'recharts';
import '../components/Charts.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">Branch: {label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value} students
          </p>
        ))}
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string
};

const BranchWiseTopCompanies = ({ data }) => {
  const [viewMode, setViewMode] = useState('stacked'); // 'stacked' or 'grouped'
  
  // Process the data to get top companies per branch
  const processData = () => {
    // Find top 5 companies across all branches
    const allCompanies = {};
    
    data.forEach(item => {
      item.companies.forEach(company => {
        if (!allCompanies[company.name]) {
          allCompanies[company.name] = 0;
        }
        allCompanies[company.name] += company.count;
      });
    });
    
    // Sort and get top 5 companies
    const topCompanies = Object.entries(allCompanies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
      
    // Create processed data for the chart
    return data.map(branch => {
      const result = { branch: branch.name };
      
      // Create a map for quick lookup
      const companyMap = {};
      branch.companies.forEach(company => {
        companyMap[company.name] = company.count;
      });
      
      // Add top companies data
      topCompanies.forEach(company => {
        result[company] = companyMap[company] || 0;
      });
      
      return result;
    });
  };

  const processedData = processData();
  
  // Generate colors for each company bar
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
  
  // Get top 5 companies for legend
  const getTopCompanies = () => {
    const allCompanies = {};
    
    data.forEach(item => {
      item.companies.forEach(company => {
        if (!allCompanies[company.name]) {
          allCompanies[company.name] = 0;
        }
        allCompanies[company.name] += company.count;
      });
    });
    
    return Object.entries(allCompanies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);
  };
  
  const topCompanies = getTopCompanies();

  return (
    <div className="chart-wrapper">
      <h3>Branch-wise Top Hiring Companies</h3>
      <div className="chart-controls">
        <label>
          <input
            type="radio"
            value="stacked"
            checked={viewMode === 'stacked'}
            onChange={() => setViewMode('stacked')}
          />
          Stacked
        </label>
        <label>
          <input
            type="radio"
            value="grouped"
            checked={viewMode === 'grouped'}
            onChange={() => setViewMode('grouped')}
          />
          Grouped
        </label>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number">
            <Label value="Number of Placements" position="bottom" offset={0} />
          </XAxis>
          <YAxis dataKey="branch" type="category" tick={{ fontSize: 12 }} width={100} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={40} />
          {topCompanies.map((company, index) => (
            <Bar
              key={company}
              dataKey={company}
              stackId={viewMode === 'stacked' ? 'a' : index}
              fill={COLORS[index % COLORS.length]}
              name={company}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="chart-note">
        Note: Showing top 5 companies by total placement count across all branches
      </div>
    </div>
  );
};

BranchWiseTopCompanies.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      companies: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          count: PropTypes.number.isRequired
        })
      ).isRequired
    })
  ).isRequired
};

export default BranchWiseTopCompanies; 