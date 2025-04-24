import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/admin/Dashboard";
import Visualization from "./components/Dashboard";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/visualization" element={<Visualization />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
