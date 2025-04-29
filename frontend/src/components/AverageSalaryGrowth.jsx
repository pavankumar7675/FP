import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../components/Charts.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{`Year: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ₹${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AverageSalaryGrowth = ({ data }) => {
  const [chartType, setChartType] = useState('line');
  
  // Process data to get average salaries by year and branch
  const processData = () => {
    // Group by year
    const yearMap = {};
    
    data.forEach(entry => {
      const { year, branch, averageSalary } = entry;
      
      if (!yearMap[year]) {
        yearMap[year] = { year };
      }
      
      // Store average salary by branch
      if (branch && averageSalary > 0) {
        yearMap[year][branch] = averageSalary;
      }
    });
    
    // Convert to array and sort by year
    return Object.values(yearMap).sort((a, b) => a.year - b.year);
  };
  
  const chartData = processData();
  
  // Get unique branches
  const branches = [...new Set(data.map(item => item.branch))];
  
  // Format for Y-axis
  const formatYAxis = (value) => {
    return `₹${(value / 100000).toFixed(1)}L`;
  };
  
  return (
    <div className="chart-wrapper">
      <h3>Average Salary Growth per Branch</h3>
      <div className="chart-controls">
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
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'line' ? (
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              type="category"
            />
            <YAxis 
              tickFormatter={formatYAxis}
              label={{ value: 'Average Salary', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {branches.map((branch, index) => (
              <Line
                key={branch}
                type="monotone"
                dataKey={branch}
                name={branch}
                stroke={COLORS[index % COLORS.length]}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              type="category"
            />
            <YAxis 
              tickFormatter={formatYAxis}
              label={{ value: 'Average Salary', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {branches.map((branch, index) => (
              <Bar
                key={branch}
                dataKey={branch}
                name={branch}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
      <div className="chart-note">
        This chart shows how average salaries for each branch changed over the years.
        It helps identify which branches are experiencing better salary growth over time.
      </div>
    </div>
  );
};

AverageSalaryGrowth.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      branch: PropTypes.string.isRequired,
      averageSalary: PropTypes.number.isRequired
    })
  ).isRequired
};

export default AverageSalaryGrowth; 