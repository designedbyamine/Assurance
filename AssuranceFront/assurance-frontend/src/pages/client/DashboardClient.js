import React from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../dashboardClient.css"; // For custom CSS styles

const DashboardClient = () => {
  const navigate = useNavigate();

  const clientData = {
    name: "Client", 
    totalConstats: 5,
    completedConstats: 3,
    pendingConstats: 2,
  };

  return (
    <div className="container dashboard-container">
      <h1 className="welcome-message">
        Welcome, {clientData.name}!
      </h1>
      <p className="intro-text">
        Here's a summary of your activities. You can create a new constat or view your existing constats.
      </p>

      <div className="dashboard-actions">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/create-constat")}
        >
          Create New Constat
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/my-constats")}
        >
          View My Constats
        </button>
      </div>

      <div className="summary">
        <h2>Your Constat Summary</h2>
        <p>Total Constats: {clientData.totalConstats}</p>
        <p>Completed Constats: {clientData.completedConstats}</p>
        <p>Pending Constats: {clientData.pendingConstats}</p>
      </div>
    </div>
  );
};

export default DashboardClient;
