import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [placementData, setPlacementData] = useState([]);

  useEffect(() => {
    axios
      .get("/api/placements/2023") // Replace with the correct year or dynamic value
      .then((response) => setPlacementData(response.data))
      .catch((error) => console.error("Error fetching placement data:", error));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <pre>{JSON.stringify(placementData, null, 2)}</pre>
    </div>
  );
};

export default AdminDashboard;
