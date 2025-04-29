import React from 'react';
import PropTypes from 'prop-types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
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
            {`${entry.name}: ${entry.value.toFixed(1)}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const YearWisePlacementRateTrend = ({ data }) => {
  // Process data to get placement rates by year and branch
  const processData = () => {
    // Group by year
    const yearMap = {};
    
    data.forEach(entry => {
      const { year, branch, eligible, placed } = entry;
      
      if (!yearMap[year]) {
        yearMap[year] = { year };
      }
      
      // Calculate placement rate and store by branch
      if (branch && eligible > 0) {
        const placementRate = (placed / eligible) * 100;
        yearMap[year][branch] = placementRate;
      }
    });
    
    // Convert to array and sort by year
    return Object.values(yearMap).sort((a, b) => a.year - b.year);
  };
  
  const chartData = processData();
  
  // Get unique branches
  const branches = [...new Set(data.map(item => item.branch))];
  
  return (
    <div className="chart-wrapper">
      <h3>Year-wise Placement Rate Trend per Branch</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year" 
            type="category"
          />
          <YAxis 
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
            label={{ value: 'Placement %', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <ReferenceLine y={50} stroke="#666" strokeDasharray="3 3" />
          
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
      </ResponsiveContainer>
      <div className="chart-note">
        This chart shows what percentage of students were placed each year across different branches.
        Higher values indicate better placement performance.
      </div>
    </div>
  );
};

YearWisePlacementRateTrend.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      branch: PropTypes.string.isRequired,
      eligible: PropTypes.number.isRequired,
      placed: PropTypes.number.isRequired
    })
  ).isRequired
};

export default YearWisePlacementRateTrend; 