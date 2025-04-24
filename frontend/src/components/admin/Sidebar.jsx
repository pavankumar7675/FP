import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>CSV Dashboard</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className="active">
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/visualization">Visualization</Link>
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
