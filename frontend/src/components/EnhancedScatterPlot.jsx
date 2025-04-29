import React from 'react';
import PropTypes from 'prop-types';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LabelList, Cell
} from 'recharts';
import '../components/Charts.css';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{data.name}</p>
        <p>{`${payload[0].name}: ${data.x}`}</p>
        <p>{`${payload[1].name}: ${data.y}`}</p>
        {data.z && <p>{`Size: ${data.z}`}</p>}
        {data.additionalInfo && <p>{data.additionalInfo}</p>}
      </div>
    );
  }
  return null;
};

const EnhancedScatterPlot = ({ 
  data, 
  xAxisDataKey = 'x',
  yAxisDataKey = 'y',
  zAxisDataKey = 'z',
  xAxisLabel = 'X Axis', 
  yAxisLabel = 'Y Axis', 
  title = 'Scatter Plot',
  colorScheme = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE']
}) => {
  // Determine min and max values for axes
  const xMin = Math.min(...data.map(item => item[xAxisDataKey])) * 0.9;
  const xMax = Math.max(...data.map(item => item[xAxisDataKey])) * 1.1;
  const yMin = Math.min(...data.map(item => item[yAxisDataKey])) * 0.9;
  const yMax = Math.max(...data.map(item => item[yAxisDataKey])) * 1.1;
  
  // Group data by category if it exists
  const categories = [...new Set(data.map(item => item.category || 'default'))];
  
  return (
    <div className="chart-wrapper">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey={xAxisDataKey} 
            name={xAxisLabel}
            domain={[xMin, xMax]}
            label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            type="number" 
            dataKey={yAxisDataKey} 
            name={yAxisLabel}
            domain={[yMin, yMax]}
            label={{ value: yAxisLabel, position: 'insideLeft', angle: -90, offset: -5 }}
          />
          {data.some(item => item[zAxisDataKey]) && (
            <ZAxis 
              type="number" 
              dataKey={zAxisDataKey} 
              range={[60, 400]} 
              name="Size" 
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {categories.length > 1 ? (
            // Render multiple scatters if there are categories
            categories.map((category, index) => (
              <Scatter 
                key={category}
                name={category} 
                data={data.filter(item => (item.category || 'default') === category)}
                fill={colorScheme[index % colorScheme.length]}
              >
                <LabelList dataKey="name" position="top" />
              </Scatter>
            ))
          ) : (
            // Render a single scatter with individual colors if needed
            <Scatter 
              name="Data Points" 
              data={data}
              fill="#8884d8"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || colorScheme[index % colorScheme.length]} 
                />
              ))}
              <LabelList dataKey="name" position="top" />
            </Scatter>
          )}
        </ScatterChart>
      </ResponsiveContainer>
      <div className="chart-note">
        Bubble size represents {zAxisDataKey === 'z' ? 'value magnitude' : zAxisDataKey}
      </div>
    </div>
  );
};

EnhancedScatterPlot.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  xAxisDataKey: PropTypes.string,
  yAxisDataKey: PropTypes.string,
  zAxisDataKey: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  title: PropTypes.string,
  colorScheme: PropTypes.arrayOf(PropTypes.string)
};

export default EnhancedScatterPlot; 