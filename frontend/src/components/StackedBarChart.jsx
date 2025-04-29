import React from 'react';
import PropTypes from 'prop-types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LabelList
} from 'recharts';
import '../components/Charts.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);
    
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} (${(entry.value / total * 100).toFixed(1)}%)`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StackedBarChart = ({
  data,
  xAxisKey = 'name',
  stackKeys = [],
  title = 'Stacked Bar Chart',
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'],
  isPercentage = false,
  horizontal = false,
  showLabels = false
}) => {
  // Transform data for percentage stacked if needed
  const transformedData = isPercentage 
    ? data.map(item => {
        const total = stackKeys.reduce((sum, key) => sum + (parseFloat(item[key]) || 0), 0);
        const newItem = { ...item };
        
        // Convert each value to percentage
        stackKeys.forEach(key => {
          newItem[key] = total === 0 ? 0 : (item[key] / total) * 100;
        });
        
        return newItem;
      })
    : data;

  return (
    <div className="chart-wrapper">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={transformedData}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          stackOffset={isPercentage ? "expand" : "none"}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {horizontal ? (
            <>
              <XAxis type="number" domain={[0, isPercentage ? 100 : 'auto']} tickFormatter={isPercentage ? (value) => `${value}%` : null} />
              <YAxis dataKey={xAxisKey} type="category" />
            </>
          ) : (
            <>
              <XAxis dataKey={xAxisKey} />
              <YAxis domain={[0, isPercentage ? 100 : 'auto']} tickFormatter={isPercentage ? (value) => `${value}%` : null} />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {stackKeys.map((key, index) => (
            <Bar 
              key={key} 
              dataKey={key} 
              stackId="a" 
              fill={colors[index % colors.length]}
            >
              {showLabels && (
                <LabelList 
                  dataKey={key} 
                  position="inside" 
                  formatter={isPercentage ? (value) => `${value.toFixed(1)}%` : null}
                  style={{ fill: '#fff', fontSize: 12, fontWeight: 'bold' }}
                />
              )}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="chart-note">
        {isPercentage 
          ? 'Each bar shows percentage distribution across categories' 
          : 'Shows distribution of values across categories'}
      </div>
    </div>
  );
};

StackedBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  xAxisKey: PropTypes.string,
  stackKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  isPercentage: PropTypes.bool,
  horizontal: PropTypes.bool,
  showLabels: PropTypes.bool
};

export default StackedBarChart; 