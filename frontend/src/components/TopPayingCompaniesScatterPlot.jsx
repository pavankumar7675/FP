import React from 'react';
import PropTypes from 'prop-types';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from 'recharts';
import '../components/Charts.css';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-company"><strong>{data.company}</strong></p>
        <p>Average Salary: ₹{data.averageSalary.toLocaleString()}</p>
        <p>Students Placed: {data.placementCount}</p>
        <p>Sector: {data.sector}</p>
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array
};

const TopPayingCompaniesScatterPlot = ({ data }) => {
  // Process data to aggregate by company
  const processData = () => {
    const companyStats = {};
    
    // Aggregate data by company
    data.forEach(entry => {
      const { company, salary, sector } = entry;
      
      if (!companyStats[company]) {
        companyStats[company] = {
          company,
          totalSalary: 0,
          placementCount: 0,
          sector: sector || 'Unknown'
        };
      }
      
      companyStats[company].totalSalary += salary || 0;
      companyStats[company].placementCount += 1;
    });
    
    // Calculate average salary per company
    return Object.values(companyStats)
      .map(entry => ({
        company: entry.company,
        averageSalary: entry.totalSalary / entry.placementCount,
        placementCount: entry.placementCount,
        sector: entry.sector
      }))
      .filter(entry => entry.placementCount > 0 && entry.averageSalary > 0)
      .sort((a, b) => b.averageSalary - a.averageSalary);
  };
  
  const chartData = processData();
  
  // Calculate marker sizes based on placement count
  const getMarkerSize = (count) => {
    // Minimum size of 10, scaling up based on placement count
    return Math.max(10, Math.min(40, 10 + count * 3));
  };
  
  // Determine domain for z-axis (marker size)
  const maxCount = Math.max(...chartData.map(item => item.placementCount));
  
  return (
    <div className="chart-wrapper">
      <h3>Top Paying Companies vs Placement Count</h3>
      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="placementCount"
            name="Placement Count"
          >
            <Label 
              value="Number of Students Placed" 
              position="bottom" 
              offset={10} 
            />
          </XAxis>
          <YAxis 
            type="number" 
            dataKey="averageSalary" 
            name="Average Salary"
            tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`}
          >
            <Label 
              value="Average Salary (₹)" 
              position="left" 
              angle={-90} 
              offset={-40} 
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <ZAxis 
            type="number" 
            dataKey="placementCount" 
            range={[10, 40]} 
            domain={[0, maxCount]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter 
            name="Companies" 
            data={chartData} 
            fill="#8884d8"
          />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="chart-note">
        This scatter plot shows the relationship between average salary offered by companies and 
        the number of students they hired. Each bubble represents a company, with the size of the 
        bubble corresponding to the number of placements.
      </div>
    </div>
  );
};

TopPayingCompaniesScatterPlot.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      company: PropTypes.string.isRequired,
      salary: PropTypes.number,
      sector: PropTypes.string
    })
  ).isRequired
};

export default TopPayingCompaniesScatterPlot; 