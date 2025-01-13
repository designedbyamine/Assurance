import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../clientprofile.css";

axios.defaults.baseURL = "http://127.0.0.1:5000/api";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("/client/myprofile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
    } catch (err) {
      setError("Failed to load profile. Please try again later.");
    }
  };

  useEffect(() => {
    if (!user) {
      window.location.href = "/login"; // Redirect if not logged in
    } else {
      fetchProfile();
    }
  }, [user]);

  // Handle input change for profile fields
  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle input change for password fields
  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit updated profile (including password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { oldPassword, newPassword, confirmNewPassword } = passwords;
    
    // Check if the password fields are valid
    const passwordUpdate = oldPassword && newPassword && confirmNewPassword;
  
    if (passwordUpdate && newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
      setLoading(false);
      return;
    }
  
    try {
      const token = localStorage.getItem("authToken");
      
      const requestData = { 
        name: profile.name, 
        email: profile.email 
      };
  
      // Add password fields to the request body only if they are provided
      if (passwordUpdate) {
        requestData.password = newPassword; // Include new password in request
      }
  
      const response = await axios.put(
        "/client/profile",
  {
    name: profile.name,
    email: profile.email,
    oldPassword: passwords.oldPassword,
    password: passwords.newPassword, // Ensure field names match backend
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
      );
  
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
      fetchProfile(); // Re-fetch the updated profile data
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-form-card">
        <h1>Your Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              className="form-control"
              value={profile.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Password change section */}
        <div className="password-change-section">
          <h2>Change Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Old Password:</label>
              <input
                type="password"
                className="form-control"
                value={passwords.oldPassword}
                onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
                required={passwords.newPassword || passwords.confirmNewPassword}
              />
            </div>

            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                className="form-control"
                value={passwords.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                required={passwords.oldPassword || passwords.confirmNewPassword}
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password:</label>
              <input
                type="password"
                className="form-control"
                value={passwords.confirmNewPassword}
                onChange={(e) => handlePasswordChange("confirmNewPassword", e.target.value)}
                required={passwords.oldPassword || passwords.newPassword}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
