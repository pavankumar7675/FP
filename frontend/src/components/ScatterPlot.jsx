import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ZAxis
} from 'recharts';
import '../components/Charts.css';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{data.name}</p>
        <p>{`${payload[0].name}: ${data[payload[0].dataKey]}`}</p>
        <p>{`${payload[1].name}: ${data[payload[1].dataKey]}`}</p>
        {data.z !== undefined && <p>{`Size: ${data.z}`}</p>}
        {data.additionalInfo && (
          <>
            {Object.entries(data.additionalInfo).map(([key, value]) => (
              <p key={key}>{`${key}: ${value}`}</p>
            ))}
          </>
        )}
      </div>
    );
  }
  return null;
};

const ScatterPlotComponent = ({
  data,
  xAxisKey,
  yAxisKey,
  zAxisKey,
  title = 'Scatter Plot',
  xAxisLabel = 'X Axis',
  yAxisLabel = 'Y Axis',
  colors = ['#8884d8'],
  showGrid = true,
  nameKey = 'name',
  dotShape = 'circle'
}) => {
  // Calculate domain values for automatic sizing if zAxisKey is specified
  const zDomain = zAxisKey 
    ? [Math.min(...data.map(d => d[zAxisKey] || 0)), Math.max(...data.map(d => d[zAxisKey] || 100))]
    : [50, 50];

  // Default dot size range
  const sizeRange = [50, 400];

  return (
    <div className="chart-wrapper">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{ top: 20, right: 50, bottom: 60, left: 60 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis 
            dataKey={xAxisKey} 
            name={xAxisLabel} 
            type="number"
            domain={['auto', 'auto']}
          >
            <Label value={xAxisLabel} position="bottom" offset={20} />
          </XAxis>
          <YAxis 
            dataKey={yAxisKey} 
            name={yAxisLabel} 
            type="number"
            domain={['auto', 'auto']}
          >
            <Label value={yAxisLabel} angle={-90} position="left" offset={-40} />
          </YAxis>
          {zAxisKey && (
            <ZAxis 
              dataKey={zAxisKey} 
              domain={zDomain} 
              range={sizeRange}
              name="size"
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Scatter 
            name={title}
            data={data} 
            fill={colors[0]}
            shape={dotShape}
            nameKey={nameKey}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="chart-note">
        Scatter plot showing relationship between {xAxisLabel} and {yAxisLabel}
        {zAxisKey && `, with dot size representing ${zAxisKey}`}
      </div>
    </div>
  );
};

ScatterPlotComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  xAxisKey: PropTypes.string.isRequired,
  yAxisKey: PropTypes.string.isRequired,
  zAxisKey: PropTypes.string,
  title: PropTypes.string,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  showGrid: PropTypes.bool,
  nameKey: PropTypes.string,
  dotShape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
};

export default ScatterPlotComponent; 