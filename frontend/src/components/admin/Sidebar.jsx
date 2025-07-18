import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Sidebar.css";

function Sidebar({ onToggle }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>CSV Dashboard</h2>
      </div>
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? "→" : "←"}
      </button>
      <nav className="sidebar-nav">
        <ul>
          <li className="active">
            <Link to="/"><span>Dashboard</span></Link>
          </li>
          <li>
            <Link to="/visualization"><span>Visualization</span></Link>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p>Admin User</p>
      </div>
    </div>
  );
}

export default Sidebar;
