import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import '../components/Charts.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: ₹{entry.value.toLocaleString()}
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

const SalaryTrendsPerBranch = ({ data }) => {
  const [chartType, setChartType] = useState('line');
  const [metric, setMetric] = useState('average'); // 'average', 'highest', or 'lowest'
  
  // Process data to organize by branch and year
  const processData = () => {
    // Create a map to store salary data by year
    const yearData = {};
    
    // Process all entries
    data.forEach(entry => {
      const { branch, year, averagePackage, highestPackage, lowestPackage } = entry;
      
      if (!yearData[year]) {
        yearData[year] = { year };
      }
      
      // Store salary data for each branch
      yearData[year][`${branch}_avg`] = averagePackage;
      yearData[year][`${branch}_high`] = highestPackage;
      yearData[year][`${branch}_low`] = lowestPackage;
      yearData[year][branch] = averagePackage; // Default view
    });
    
    // Convert map to array
    return Object.values(yearData).sort((a, b) => a.year - b.year);
  };

  // Get unique branches
  const getBranches = () => {
    const branches = new Set();
    data.forEach(entry => {
      branches.add(entry.branch);
    });
    return Array.from(branches);
  };

  const processedData = processData();
  const branches = getBranches();
  
  // Colors for different branches
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#ffc658', '#ff8042'];
  
  // Update chart data based on selected metric
  const updateDataKeys = () => {
    if (metric === 'average') {
      return branches.map(branch => `${branch}_avg`);
    } else if (metric === 'highest') {
      return branches.map(branch => `${branch}_high`);
    } else {
      return branches.map(branch => `${branch}_low`);
    }
  };
  
  const dataKeys = updateDataKeys();

  // Format data for display in the tooltip
  const formatYAxis = (value) => {
    return `₹${(value / 100000).toFixed(1)}L`;
  };

  return (
    <div className="chart-wrapper">
      <h3>Salary Trends per Branch</h3>
      <div className="chart-controls">
        <div>
          <label>
            <input
              type="radio"
              value="line"
              checked={chartType === 'line'}
              onChange={() => setChartType('line')}
            />
            Line Chart
          </label>
          <label>
            <input
              type="radio"
              value="bar"
              checked={chartType === 'bar'}
              onChange={() => setChartType('bar')}
            />
            Bar Chart
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="average"
              checked={metric === 'average'}
              onChange={() => setMetric('average')}
            />
            Average Package
          </label>
          <label>
            <input
              type="radio"
              value="highest"
              checked={metric === 'highest'}
              onChange={() => setMetric('highest')}
            />
            Highest Package
          </label>
          <label>
            <input
              type="radio"
              value="lowest"
              checked={metric === 'lowest'}
              onChange={() => setMetric('lowest')}
            />
            Lowest Package
          </label>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'line' ? (
          <LineChart
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {branches.map((branch, index) => (
              <Line
                key={branch}
                type="monotone"
                dataKey={dataKeys[index]}
                name={branch}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {branches.map((branch, index) => (
              <Bar
                key={branch}
                dataKey={dataKeys[index]}
                name={branch}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
      <div className="chart-note">
        {metric === 'average' && 'Showing average package trends by branch over time'}
        {metric === 'highest' && 'Showing highest package trends by branch over time'}
        {metric === 'lowest' && 'Showing lowest package trends by branch over time'}
      </div>
    </div>
  );
};

SalaryTrendsPerBranch.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      branch: PropTypes.string.isRequired,
      year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      averagePackage: PropTypes.number.isRequired,
      highestPackage: PropTypes.number.isRequired,
      lowestPackage: PropTypes.number.isRequired
    })
  ).isRequired
};

export default SalaryTrendsPerBranch; 