import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FunnelChart, Funnel, LabelList, Cell } from 'recharts';
import '../components/Charts.css';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{data.name}</p>
        <p style={{ color: data.color }}>
          {`Value: ${data.value.toLocaleString()}`}
        </p>
        {data.payload.rate !== undefined && (
          <p style={{ color: data.color }}>
            {`Conversion: ${(data.payload.rate * 100).toFixed(1)}%`}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const FunnelChartComponent = ({
  data,
  title = 'Funnel Chart',
  colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'],
  dataKey = 'value',
  nameKey = 'name',
  showLabels = true,
  showLegend = true,
  gradientEnabled = true,
  showValues = true,
  showPercentage = true
}) => {
  // Calculate percentages and conversion rates if not already provided
  const processedData = data.map((item, index, arr) => {
    const prevValue = index > 0 ? arr[index - 1][dataKey] : null;
    const currentValue = item[dataKey];
    
    return {
      ...item,
      // Calculate percentage of first step
      percentage: arr[0][dataKey] !== 0 
        ? ((currentValue / arr[0][dataKey]) * 100).toFixed(1) 
        : 0,
      // Calculate conversion rate from previous step
      rate: prevValue !== null && prevValue !== 0 
        ? currentValue / prevValue 
        : 1
    };
  });

  return (
    <div className="chart-wrapper">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <FunnelChart>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend />}
          <Funnel
            dataKey={dataKey}
            nameKey={nameKey}
            data={processedData}
            isAnimationActive
          >
            <LabelList
              position="right"
              fill="#000"
              stroke="none"
              dataKey={(entry) => {
                const labels = [];
                if (showValues) {
                  labels.push(`${entry[nameKey]}: ${entry[dataKey].toLocaleString()}`);
                }
                if (showPercentage) {
                  labels.push(`(${entry.percentage}%)`);
                }
                return labels.join(' ');
              }}
            />
            {processedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                gradient={gradientEnabled}
              />
            ))}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
      <div className="chart-note">
        Shows conversion flow from initial step through completion stages
      </div>
    </div>
  );
};

FunnelChartComponent.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    })
  ).isRequired,
  title: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  dataKey: PropTypes.string,
  nameKey: PropTypes.string,
  showLabels: PropTypes.bool,
  showLegend: PropTypes.bool,
  gradientEnabled: PropTypes.bool,
  showValues: PropTypes.bool,
  showPercentage: PropTypes.bool
};

export default FunnelChartComponent; 