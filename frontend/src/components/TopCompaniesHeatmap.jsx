import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ResponsiveContainer } from 'recharts';
import '../components/Charts.css';

const TopCompaniesHeatmap = ({ data }) => {
  const [maxDisplay, setMaxDisplay] = useState(10);
  
  // Process data to create a heatmap structure
  const processData = () => {
    // First get all unique years and companies
    const years = [...new Set(data.map(item => item.year))].sort();
    
    // Aggregate hiring data by company and year
    const companyYearMap = {};
    
    data.forEach(entry => {
      const { year, company, placed } = entry;
      
      if (!companyYearMap[company]) {
        companyYearMap[company] = {
          company,
          total: 0,
          // Initialize with zero for all years
          ...years.reduce((acc, year) => ({ ...acc, [year]: 0 }), {})
        };
      }
      
      companyYearMap[company][year] = (companyYearMap[company][year] || 0) + placed;
      companyYearMap[company].total += placed;
    });
    
    // Convert to array and sort by total placements
    return {
      companies: Object.values(companyYearMap)
        .sort((a, b) => b.total - a.total)
        .slice(0, maxDisplay),
      years
    };
  };
  
  const { companies, years } = processData();
  
  // Calculate the maximum value for color scaling
  const maxValue = Math.max(...companies.flatMap(company => 
    years.map(year => company[year])
  ));
  
  // Function to get color intensity based on value
  const getColor = (value) => {
    const ratio = value / maxValue;
    const intensity = Math.floor(255 * (1 - ratio));
    return `rgb(70, ${intensity}, 255)`;
  };
  
  return (
    <div className="chart-wrapper">
      <h3>Top Companies Hiring Trend by Year</h3>
      <div className="chart-controls">
        <label>
          Show top: 
          <select 
            value={maxDisplay}
            onChange={(e) => setMaxDisplay(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select> companies
        </label>
      </div>
      <div className="heatmap-container" style={{ overflowX: 'auto' }}>
        <table className="heatmap-table">
          <thead>
            <tr>
              <th>Company</th>
              {years.map(year => (
                <th key={year}>{year}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 'bold', textAlign: 'left', padding: '8px' }}>
                  {company.company}
                </td>
                {years.map(year => (
                  <td 
                    key={year}
                    style={{
                      backgroundColor: getColor(company[year]),
                      color: company[year] > maxValue * 0.7 ? 'white' : 'black',
                      textAlign: 'center',
                      padding: '8px',
                      width: '80px'
                    }}
                  >
                    {company[year]}
                  </td>
                ))}
                <td style={{ fontWeight: 'bold', textAlign: 'center', padding: '8px' }}>
                  {company.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="heatmap-legend" style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>Less</span>
          <div style={{ 
            display: 'flex', 
            width: '200px', 
            height: '20px',
            margin: '0 10px',
            background: 'linear-gradient(to right, rgb(70, 255, 255), rgb(70, 0, 255))'
          }}></div>
          <span>More</span>
        </div>
      </div>
      <div className="chart-note">
        This heatmap shows which companies consistently hire students across multiple years.
        Darker cells indicate higher numbers of placements.
      </div>
    </div>
  );
};

TopCompaniesHeatmap.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      company: PropTypes.string.isRequired,
      placed: PropTypes.number.isRequired
    })
  ).isRequired
};

export default TopCompaniesHeatmap; 