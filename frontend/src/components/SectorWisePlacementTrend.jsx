import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../components/Charts.css';

const SECTOR_COLORS = {
  'IT': '#3498db',
  'CORE': '#2ecc71',
  'BFSI': '#e74c3c',
  'Other': '#f1c40f'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);
    
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{`Year: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} (${((entry.value / total) * 100).toFixed(1)}%)`}
          </p>
        ))}
        <p><strong>{`Total: ${total}`}</strong></p>
      </div>
    );
  }
  return null;
};

const SectorWisePlacementTrend = ({ data }) => {
  const [isPercentage, setIsPercentage] = useState(false);
  
  // Process data to get sector-wise placements by year
  const processData = () => {
    // Group by year
    const yearMap = {};
    
    // Standardize sector names to main categories
    const normalizeSector = (sector) => {
      sector = (sector || '').toUpperCase();
      if (sector.includes('IT') || sector.includes('SOFTWARE') || sector.includes('TECH')) 
        return 'IT';
      if (sector.includes('CORE') || sector.includes('ENGINEERING') || sector.includes('MANUFAC')) 
        return 'CORE';
      if (sector.includes('BFSI') || sector.includes('BANK') || sector.includes('FINANCE')) 
        return 'BFSI';
      return 'Other';
    };
    
    data.forEach(entry => {
      const { year, sector, placed } = entry;
      const normalizedSector = normalizeSector(sector);
      
      if (!yearMap[year]) {
        yearMap[year] = { 
          year,
          'IT': 0,
          'CORE': 0,
          'BFSI': 0,
          'Other': 0
        };
      }
      
      yearMap[year][normalizedSector] += placed;
    });
    
    // Convert to array and sort by year
    return Object.values(yearMap).sort((a, b) => a.year - b.year);
  };
  
  const chartData = processData();
  
  // If percentage view, convert absolute values to percentages
  const transformedData = isPercentage 
    ? chartData.map(yearData => {
        const total = Object.keys(yearData)
          .filter(key => key !== 'year')
          .reduce((sum, key) => sum + yearData[key], 0);
        
        const result = { year: yearData.year };
        
        Object.keys(yearData).forEach(key => {
          if (key !== 'year') {
            result[key] = total > 0 ? (yearData[key] / total) * 100 : 0;
          }
        });
        
        return result;
      })
    : chartData;
  
  // Get sectors for display
  const sectors = Object.keys(SECTOR_COLORS);
  
  return (
    <div className="chart-wrapper">
      <h3>Sector-wise Placement Split Over Years</h3>
      <div className="chart-controls">
        <label>
          <input
            type="checkbox"
            checked={isPercentage}
            onChange={() => setIsPercentage(!isPercentage)}
          />
          Show as percentage
        </label>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={transformedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          stackOffset={isPercentage ? "expand" : "none"}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year" 
            type="category"
          />
          <YAxis 
            tickFormatter={isPercentage ? (value) => `${value}%` : undefined}
            domain={isPercentage ? [0, 100] : [0, 'auto']}
            label={{ 
              value: isPercentage ? 'Percentage (%)' : 'Number of Students', 
              angle: -90, 
              position: 'insideLeft' 
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {sectors.map(sector => (
            <Area
              key={sector}
              type="monotone"
              dataKey={sector}
              name={sector}
              stackId="1"
              fill={SECTOR_COLORS[sector]}
              stroke={SECTOR_COLORS[sector]}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <div className="chart-note">
        This chart shows how the distribution of placements across different sectors 
        (IT, CORE, BFSI, Other) has changed over the years.
      </div>
    </div>
  );
};

SectorWisePlacementTrend.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      sector: PropTypes.string,
      placed: PropTypes.number.isRequired
    })
  ).isRequired
};

export default SectorWisePlacementTrend; 