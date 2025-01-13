import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../constats.css"; // CSS for styling the component

axios.defaults.baseURL = "http://127.0.0.1:5000/api";
const API_BASE_URL = "http://127.0.0.1:5000";

const Constats = () => {
  const [constats, setConstats] = useState([]); // List of constats
  const [selectedConstat, setSelectedConstat] = useState(null); // Selected constat for detail view
  const [loading, setLoading] = useState(true); // Loading state
  const [observations, setObservations] = useState(''); // Observations for update

  // Get the token from localStorage or wherever it's stored
  const token = localStorage.getItem('authToken');

  // Set the token as the default Authorization header for axios
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Fetch all assigned constats
  useEffect(() => {
    const fetchConstats = async () => {
      try {
        const response = await axios.get('expert/assigned-constats');
        setConstats(response.data.constats);
      } catch (error) {
        console.error('Erreur lors de la récupération des constats assignés:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConstats();
  }, []);

  // Handle viewing details of a constat
  const handleViewDetails = async (constatId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/expert/constat-details/${constatId}`);
      setSelectedConstat(response.data.constat); // Load selected constat
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du constat:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle updating a constat
  const handleUpdateConstat = async (e) => {
    e.preventDefault();
    if (!selectedConstat) return;
    
 // Vérification si le constat est déjà "Done"
 if (selectedConstat.status === "Done") {
    alert("Ce constat a déjà été clôturé et ne peut plus être modifié.");
    return; // Empêche la mise à jour si le statut est déjà "Done"
  }
    try {
      const updatedData = { observations, status: 'Done' }; // Always set status to "Done"
      await axios.put(`/expert/update-dossier/${selectedConstat._id}`, updatedData);
      alert('Constat mis à jour avec succès.');

      // Refresh the constats list and reset the state
      const response = await axios.get('/expert/assigned-constats/');
      setConstats(response.data.constats);
      setSelectedConstat(null);
      setObservations('');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du constat:', error);
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="constats-component">
      {!selectedConstat ? (
        // List View
        <div className="assigned-constats">
          <h1>Mes Constats Assignés</h1>
          <ul>
            {constats.map((constat) => (
              <li key={constat._id} className="constat-card">
                <h3>{constat.type}</h3>
                <p><strong>Lieu :</strong> {constat.location}</p>
                <p><strong>Statut :</strong> {constat.status}</p>
                <p><strong>Client :</strong> {constat.client.name}</p>
                <button onClick={() => handleViewDetails(constat._id)}>Voir Détails</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Detail View
        <div className="constat-details">
          <h1>Détails du Constat</h1>
          <p><strong>Type :</strong> {selectedConstat.type}</p>
          <p><strong>Lieu :</strong> {selectedConstat.location}</p>
          <p><strong>Description :</strong> {selectedConstat.description}</p>
          <p><strong>Statut :</strong> {selectedConstat.status}</p>
          <p><strong>Client :</strong> {selectedConstat.client.name} ({selectedConstat.client.email})</p>

          {/* Display Photos */}
          {selectedConstat.photos && selectedConstat.photos.length > 0 && (
            <div className="constat-photos">
              <h3>Photos du Constat</h3>
              <div className="photo-gallery">
                {selectedConstat.photos.map((photo, index) => (
                  <img key={index} src={`${API_BASE_URL}${photo}`} alt={`Photo ${index + 1}`} className="constat-photo" />
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleUpdateConstat}>
            <label htmlFor="observations">Ajouter des observations :</label>
            <textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            ></textarea>
            <button type="submit">Clôturer le Constat</button>
          </form>

          <button onClick={() => setSelectedConstat(null)}>Retour à la liste</button>
        </div>
      )}
    </div>
  );
};

export default Constats;
