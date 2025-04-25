import React from 'react';
import './SummaryStats.css';

const SummaryStats = ({ data }) => {
  const totals = data?.Cleaned_Branch_Wise?.find(item => item.Branch === "Total ");
  if (!totals) return null;

  const stats = [
    {
      title: "Total Students",
      mainValue: totals.Total,
      subValues: [
        { label: "Regular", value: totals["On Rolls - R"] },
        { label: "Lateral Entry", value: totals["On Rolls - LE"] }
      ]
    },
    {
      title: "Registration Status",
      mainValue: totals.Registered,
      subValues: [
        { label: "Not Registered", value: totals["Not Registered"] },
        { label: "Not Eligible", value: totals["Not Eligible"] }
      ]
    },
    {
      title: "Eligible Students",
      mainValue: totals["Total Registered Eligible"],
      subValues: [
        { label: "Regular", value: totals["Registered Eligible Regular"] },
        { label: "Lateral Entry", value: totals["Registered Eligible LE"] }
      ]
    },
    {
      title: "Placed Students",
      mainValue: totals["Total Single Offer Placed"],
      subValues: [
        { label: "Regular", value: totals["Placed Regular"] },
        { label: "Lateral Entry", value: totals["Placed LE"] }
      ],
      percentage: totals["Total %(Single)"].toFixed(2)
    },
    {
      title: "Placement Details",
      mainValue: totals["Total  Offers "],
      subValues: [
        { label: "Multiple Offers", value: totals["Total Multiple Offer Placed "] },
        { label: "Remaining Students", value: totals["remaing\n students"] }
      ]
    }
  ];

  return (
    <div className="summary-stats">
      <h2>Placement Summary {new Date().getFullYear()}</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <h3>{stat.title}</h3>
            <p className="main-value">{stat.mainValue}</p>
            <div className="sub-values">
              {stat.subValues.map((sub, idx) => (
                <small key={idx}>{sub.label}: {sub.value}</small>
              ))}
            </div>
            {stat.percentage && (
              <div className="percentage">
                {stat.percentage}% Placement Rate
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryStats;