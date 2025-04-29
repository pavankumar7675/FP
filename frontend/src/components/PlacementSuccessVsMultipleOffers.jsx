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
            {`${entry.name}: ${entry.value.toFixed(2)}%`}
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

const PlacementSuccessVsMultipleOffers = ({ data }) => {
  // Process data to calculate success rates and multiple offer percentages per branch
  const processData = () => {
    const branchStats = {};
    
    // Aggregate data by branch
    data.forEach(entry => {
      const { branch, placementCount, totalStudents, multipleOffers } = entry;
      
      if (!branchStats[branch]) {
        branchStats[branch] = {
          branch,
          placementCount: 0,
          totalStudents: 0,
          multipleOffers: 0
        };
      }
      
      branchStats[branch].placementCount += placementCount || 0;
      branchStats[branch].totalStudents += totalStudents || 0;
      branchStats[branch].multipleOffers += multipleOffers || 0;
    });
    
    // Calculate percentages
    return Object.values(branchStats).map(entry => {
      return {
        branch: entry.branch,
        successRate: entry.placementCount > 0 ? 
          (entry.placementCount / entry.totalStudents) * 100 : 0,
        multipleOffersRate: entry.placementCount > 0 ? 
          (entry.multipleOffers / entry.placementCount) * 100 : 0
      };
    });
  };
  
  const chartData = processData();
  
  return (
    <div className="chart-wrapper">
      <h3>Placement Success Rate vs Multiple Offers</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="branch"
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis
            label={{ 
              value: 'Percentage (%)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="successRate" 
            name="Placement Success Rate" 
            fill="#8884d8" 
          />
          <Bar 
            dataKey="multipleOffersRate" 
            name="Multiple Offers Rate" 
            fill="#82ca9d" 
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="chart-note">
        This chart compares the overall placement success rate (students placed / total students) with 
        the percentage of placed students who received multiple offers across different branches.
      </div>
    </div>
  );
};

PlacementSuccessVsMultipleOffers.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      branch: PropTypes.string.isRequired,
      placementCount: PropTypes.number,
      totalStudents: PropTypes.number,
      multipleOffers: PropTypes.number
    })
  ).isRequired
};

export default PlacementSuccessVsMultipleOffers; 