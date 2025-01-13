import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../myconstats.css";  // Import custom CSS file

axios.defaults.baseURL = "http://127.0.0.1:5000/api";

const MyConstats = () => {
  const [constats, setConstats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch constats on component mount
  useEffect(() => {
    const fetchConstats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await axios.get("/client/myconstats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setConstats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch constats.");
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchConstats();
  }, [error]);

  return (
    <div className="container">
      <h1>My Constats</h1>
      {error && <p className="text-danger">{error}</p>}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : (
        <div className="list-group">
          {constats.length > 0 ? (
            constats.map((constat) => (
              <div key={constat._id} className="list-group-item">
                <h5>{constat.type}</h5>
                <p><strong>Location:</strong> {constat.location}</p>
                <p><strong>Date & Time:</strong> {new Date(constat.dateTime).toLocaleString()}</p>
                <p><strong>Description:</strong> {constat.description}</p>
                <p>
                  <strong>Status:</strong> 
                  <span
                    className={`status ${constat.status?.toLowerCase() || "pending"}`}
                  >
                    {constat.status || "Pending"}
                  </span>
                </p>
              </div>
            ))
          ) : (
            <p className="no-constats-message">No constats found.</p>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default MyConstats;
