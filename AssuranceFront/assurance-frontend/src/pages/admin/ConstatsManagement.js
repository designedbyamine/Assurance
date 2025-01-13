import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../constatManagement.css"; // Create a separate CSS file for styling

axios.defaults.baseURL = "http://127.0.0.1:5000/api";

const ConstatsManagement = () => {
  const [constats, setConstats] = useState([]);
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://127.0.0.1:5000";

  useEffect(() => {
    const fetchConstats = async () => {
      try {
        const response = await axios.get("/admin/constats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Authorization token
          },
        });

        if (response.data && response.data.constats) {
          setConstats(response.data.constats);
        }

        const expertResponse = await axios.get("/admin/available-experts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (expertResponse.data && expertResponse.data.availableExperts) {
          setExperts(expertResponse.data.availableExperts);
        }
      } catch (err) {
        setError("Error fetching constats or experts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConstats();
  }, []);

  const handleApproveReject = async (constatId, status) => {
    try {
      await axios.put(`/admin/constat/${constatId}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      setConstats((prevConstats) =>
        prevConstats.map((constat) =>
          constat._id === constatId ? { ...constat, status } : constat
        )
      );
    } catch (err) {
      setError("Error updating constat status.");
      console.error(err);
    }
  };

  const handleAssignExpert = async (constatId, expertId) => {
    try {
      await axios.put(
        `/admin/constat/${constatId}/assign-expert`,
        { expertId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setConstats((prevConstats) =>
        prevConstats.map((constat) =>
          constat._id === constatId ? { ...constat, assignedExpert: expertId } : constat
        )
      );
    } catch (err) {
      setError("Error assigning expert.");
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
    <div className="constats-management">
      <h1>Manage Constats</h1>

      <div className="constats-list">
        {constats.map((constat) => (
          <div key={constat._id} className="constat-card">
            <p>Client: {constat.client ? constat.client.name : "Unknown Client"}</p>
            <p>Status: {constat.status}</p>
            <p>Description: {constat.description || "No description provided"}</p>
            <p>Location: {constat.location || "No location specified"}</p>
            <p>Date/Time: {new Date(constat.dateTime).toLocaleString()}</p>

            {constat.photos && constat.photos.length > 0 && (
              <div className="constat-photos">
                <h4>Photos:</h4>
                {constat.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={`${API_BASE_URL}${photo}`} // Prepend the API base URL
                    alt={`Constat Photo ${index + 1}`}
                    className="constat-photo"
                  />
                ))}
              </div>
            )}

            {constat.status === "Pending" && (
              <div>
                <button onClick={() => handleApproveReject(constat._id, "In Progress")}>
                  Approve
                </button>
                <button onClick={() => handleApproveReject(constat._id, "Rejected")}>
                  Reject
                </button>
              </div>
            )}

            {constat.status === "In Progress" && !constat.assignedExpert && (
              <div>
                <h4>Assign Expert:</h4>
                <select
                  onChange={(e) =>
                    handleAssignExpert(constat._id, e.target.value)
                  }
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select an expert
                  </option>
                  {experts.map((expert) => (
                    <option key={expert._id} value={expert._id}>
                      {expert.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConstatsManagement;
