import React from 'react';
import PropTypes from 'prop-types';
import {
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
        <p className="tooltip-label">{`${label}`}</p>
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

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string
};

const SectorDistributionPerBranch = ({ data }) => {
  // Get unique sectors
  const getSectors = () => {
    const sectors = new Set();
    data.forEach(entry => {
      if (entry.sector) {
        sectors.add(entry.sector);
      }
    });
    return Array.from(sectors);
  };

  // Process data to get sector percentage by branch
  const processData = () => {
    const branches = {};
    const sectors = getSectors();
    
    // Count placements by branch and sector
    data.forEach(entry => {
      const { branch, sector, placementCount } = entry;
      
      if (!branches[branch]) {
        branches[branch] = { branch };
        sectors.forEach(s => { branches[branch][s] = 0; });
      }
      
      if (sector) {
        branches[branch][sector] = (branches[branch][sector] || 0) + placementCount;
      }
    });
    
    // Calculate total placements per branch
    const branchesArray = Object.values(branches);
    branchesArray.forEach(branch => {
      let total = 0;
      sectors.forEach(sector => {
        total += branch[sector] || 0;
      });
      branch.total = total;
      
      // Convert counts to percentages
      sectors.forEach(sector => {
        branch[sector] = (branch[sector] || 0) / total * 100;
      });
    });
    
    return branchesArray;
  };

  const sectors = getSectors();
  const processedData = processData();
  
  // Colors for different sectors
  const COLORS = [
    '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', 
    '#ffc658', '#ff8042', '#d88488', '#8a6ed4', '#d67ced'
  ];

  return (
    <div className="chart-wrapper">
      <h3>Sector Distribution per Branch</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          stackOffset="expand"
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
          <YAxis type="category" dataKey="branch" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {sectors.map((sector, index) => (
            <Bar
              key={sector}
              dataKey={sector}
              name={sector}
              stackId="a"
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="chart-note">
        This chart shows the distribution of different sectors across branches as a percentage of total placements.
      </div>
    </div>
  );
};

SectorDistributionPerBranch.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      branch: PropTypes.string.isRequired,
      sector: PropTypes.string,
      placementCount: PropTypes.number.isRequired
    })
  ).isRequired
};

export default SectorDistributionPerBranch; 