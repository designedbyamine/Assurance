
const Constat = require('../models/Constat');
const User = require('../models/User');

const sendEmail = require('../utils/mailer');

/// List Assigned Constats
exports.listAssignedConstats = async (req, res) => {
    try {
      const expertId = req.user.id; // Get the logged-in expert's ID from req.user
      const constats = await Constat.find({ assignedExpert: expertId }).populate('client', 'name email');
      
      res.status(200).json({ message: 'Liste des constats assignés récupérée.', constats });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des constats assignés.', error: error.message });
    }
  };

// View Constat Details
exports.viewConstatDetails = async (req, res) => {
  try {
    const { constatId } = req.params;
    const constat = await Constat.findById(constatId).populate('client', 'name email');

    if (!constat) {
      return res.status(404).json({ message: 'Constat non trouvé.' });
    }

    res.status(200).json({ message: 'Détails du constat récupérés.', constat });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des détails du constat.', error: error.message });
  }
};

// Update Dossier
exports.updateDossier = async (req, res) => {
    try {
      const { constatId } = req.params;
      const { observations, status } = req.body;
  
      // Only allow status to be set to "Done"
      if (status && status !== 'Done') {
        return res.status(400).json({ message: 'Le statut peut uniquement être défini sur "Done".' });
      }
  
      // Find and populate the client field to get the user's email
      const constat = await Constat.findById(constatId).populate('client');
      if (!constat) {
        return res.status(404).json({ message: 'Constat non trouvé.' });
      }
  
      // Update observations if provided
      if (observations) {
        constat.description += `\nObservation: ${observations}`;
      }
  
      // Update status if provided and notify the client
      if (status === 'Done') {
        constat.status = status;
  
        // Notify the client about the status update
        const clientEmail = constat.client.email; // Access client's email after populating
        const subject = `Mise à jour de votre constat : ${constat.type}`;
        const html = `<p>Le statut de votre constat a été mis à jour : <strong>${status}</strong>.</p>`;
  
        try {
          await sendEmail(clientEmail, subject, html);
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email au client :', emailError);
          // Optionally, include a warning in the response
        }
      }
  
      // Save the updated constat
      await constat.save();
  
      res.status(200).json({ message: 'Dossier mis à jour avec succès.', constat });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du dossier:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du dossier.', error: error.message });
    }
  };
  