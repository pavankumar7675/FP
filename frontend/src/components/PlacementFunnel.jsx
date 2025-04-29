import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  Cell
} from 'recharts';
import '../components/Charts.css';

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label"><strong>{data.name}</strong></p>
        <p>Count: {data.value}</p>
        <p>Percentage: {data.percentage}%</p>
        {data.description && <p>{data.description}</p>}
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array
};

const PlacementFunnel = ({ data }) => {
  // Process data to create funnel steps
  const processFunnelData = () => {
    const totalEligible = data.reduce((sum, entry) => sum + (entry.eligible || 0), 0);
    const totalApplied = data.reduce((sum, entry) => sum + (entry.applied || 0), 0);
    const totalInterviewed = data.reduce((sum, entry) => sum + (entry.interviewed || 0), 0);
    const totalOffered = data.reduce((sum, entry) => sum + (entry.offered || 0), 0);
    const totalPlaced = data.reduce((sum, entry) => sum + (entry.placed || 0), 0);
    const totalMultipleOffers = data.reduce((sum, entry) => sum + (entry.multipleOffers || 0), 0);

    return [
      {
        name: 'Eligible Students',
        value: totalEligible,
        percentage: 100,
        description: 'Total students eligible for placement'
      },
      {
        name: 'Applied to Companies',
        value: totalApplied,
        percentage: totalEligible ? Math.round((totalApplied / totalEligible) * 100) : 0,
        description: 'Students who applied to at least one company'
      },
      {
        name: 'Interviewed',
        value: totalInterviewed,
        percentage: totalEligible ? Math.round((totalInterviewed / totalEligible) * 100) : 0,
        description: 'Students who were interviewed by at least one company'
      },
      {
        name: 'Received Offers',
        value: totalOffered,
        percentage: totalEligible ? Math.round((totalOffered / totalEligible) * 100) : 0,
        description: 'Students who received at least one job offer'
      },
      {
        name: 'Placed',
        value: totalPlaced,
        percentage: totalEligible ? Math.round((totalPlaced / totalEligible) * 100) : 0,
        description: 'Students who accepted an offer and got placed'
      },
      {
        name: 'Multiple Offers',
        value: totalMultipleOffers,
        percentage: totalPlaced ? Math.round((totalMultipleOffers / totalPlaced) * 100) : 0,
        description: 'Placed students who received multiple offers'
      }
    ];
  };

  const funnelData = processFunnelData();

  return (
    <div className="chart-wrapper">
      <h3>Placement Process Funnel</h3>
      <ResponsiveContainer width="100%" height={400}>
        <FunnelChart>
          <Tooltip content={<CustomTooltip />} />
          <Funnel
            dataKey="value"
            data={funnelData}
            isAnimationActive
            labelLine={false}
          >
            <LabelList
              position="right"
              fill="#000"
              stroke="none"
              dataKey="name"
              formatter={(value, entry) => `${value} (${entry.payload.percentage}%)`}
            />
            {funnelData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
      <div className="chart-note">
        This funnel chart visualizes the placement process flow from eligible students 
        to those who received multiple offers. Percentages are calculated relative to the 
        total eligible students, except for "Multiple Offers" which is relative to placed students.
      </div>
    </div>
  );
};

PlacementFunnel.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      eligible: PropTypes.number,
      applied: PropTypes.number,
      interviewed: PropTypes.number,
      offered: PropTypes.number,
      placed: PropTypes.number,
      multipleOffers: PropTypes.number
    })
  ).isRequired
};

export default PlacementFunnel; 