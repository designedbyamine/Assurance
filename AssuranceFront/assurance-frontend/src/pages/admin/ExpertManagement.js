import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../expertManagement.css"; // CSS for styling the component

axios.defaults.baseURL = "http://127.0.0.1:5000/api";

const ExpertManagement = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingExperts = async () => {
      try {
        const response = await axios.get("/admin/pending-experts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (response.data && response.data.pendingExperts) {
          setExperts(response.data.pendingExperts);
        }
      } catch (err) {
        setError("Error fetching pending experts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingExperts();
  }, []);

  const handleApproveExpert = async (userId) => {
    try {
      await axios.put(`/admin/approve-expert/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Update the local state after approving the expert
      setExperts((prevExperts) =>
        prevExperts.filter((expert) => expert._id !== userId)
      );
    } catch (err) {
      setError("Error approving the expert.");
      console.error(err);
    }
  };

  const handleRejectExpert = async (userId) => {
    try {
      await axios.delete(`/admin/reject-expert/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Update the local state after rejecting the expert
      setExperts((prevExperts) =>
        prevExperts.filter((expert) => expert._id !== userId)
      );
    } catch (err) {
      setError("Error rejecting the expert.");
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="expert-management">
      <h1>Manage Pending Experts</h1>

      {experts.length === 0 ? (
        <p>No pending experts found.</p>
      ) : (
        <div className="experts-list">
          {experts.map((expert) => (
            <div key={expert._id} className="expert-card">
              <p>Name: {expert.name}</p>
              <p>Email: {expert.email}</p>
              <p>Status: {expert.status}</p>
              <div className="action-buttons">
                <button
                  className="approve-button"
                  onClick={() => handleApproveExpert(expert._id)}
                >
                  Approve
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleRejectExpert(expert._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertManagement;
