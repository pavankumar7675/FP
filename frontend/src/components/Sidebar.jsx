import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Sidebar.css";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    // Add a class to the body for global state tracking
    if (newState) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  };

  // Initialize on mount
  useEffect(() => {
    return () => {
      // Clean up on unmount
      document.body.classList.remove('sidebar-collapsed');
    };
  }, []);

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
          <li>
            <Link to="/"><span>Dashboard</span></Link>
          </li>
          <li className="active">
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