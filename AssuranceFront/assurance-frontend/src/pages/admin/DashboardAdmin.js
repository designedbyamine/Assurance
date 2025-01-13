import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../dashboardAdmin.css"; // Create a separate CSS file for styling

axios.defaults.baseURL = "http://127.0.0.1:5000/api";

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null); // Store stats data
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track any errors
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch statistics data on component mount
    const fetchStats = async () => {
      try {
        const response = await axios.get("/admin/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Send token for authentication
          },
        });

        if (response.data && response.data.stats) {
          setStats(response.data.stats);
        }
      } catch (err) {
        setError("Error fetching statistics.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // Empty dependency array means it runs once on mount

  if (loading) {
    return <div>Loading...</div>; // Display loading message while fetching data
  }

  if (error) {
    return <div>{error}</div>; // Display error message if fetching fails
  }

  return (
    <div className="dashboard-admin">
      <h1>Welcome to Admin Dashboard</h1>
      <div className="stats-container">
        <div className="stats-card">
          <h2>Total Constats</h2>
          <p>{stats.totalConstats}</p>
        </div>
        <div className="stats-card approved">
          <h2>Approved Constats</h2>
          <p>{stats.approvedConstats}</p>
        </div>
        <div className="stats-card rejected">
          <h2>In Progress Constats</h2>
          <p>{stats.rejectedConstats}</p>
        </div>
        <div className="stats-card pending">
          <h2>Pending Constats</h2>
          <p>{stats.pendingConstats}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
