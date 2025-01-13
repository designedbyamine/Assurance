import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "../../createconstat.css"; // Import custom styles for CreateConstat

axios.defaults.baseURL = "http://127.0.0.1:5000/api";

const CreateConstat = () => {
  const [constat, setConstat] = useState({
    type: "",
    location: "",
    dateTime: "",
    description: "",
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConstat((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPhotos(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("type", constat.type);
    formData.append("location", constat.location);
    formData.append("dateTime", constat.dateTime);
    formData.append("description", constat.description);

    for (const file of photos) {
      formData.append("photos", file);
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken"); // Ensure token is set in localStorage
      const response = await axios.post(
        "constats/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message || "Constat created successfully!");
      setConstat({ type: "", location: "", dateTime: "", description: "" });
      setPhotos([]);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to create constat.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Create a Constat</h1>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Type:
          </label>
          <input
            type="text"
            id="type"
            name="type"
            className="form-control"
            value={constat.type}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Location:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-control"
            value={constat.location}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dateTime" className="form-label">
            Date and Time:
          </label>
          <input
            type="datetime-local"
            id="dateTime"
            name="dateTime"
            className="form-control"
            value={constat.dateTime}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={constat.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="photos" className="form-label">
            Upload Photos (up to 6):
          </label>
          <input
            type="file"
            id="photos"
            name="photos"
            className="form-control"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {loading ? "Creating..." : "Create Constat"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateConstat;
