const User = require('../models/User');
const Constat = require('../models/Constat'); // Assuming you have a Constat model
const sendEmail = require('../utils/mailer');

// Approve Expert Account
exports.approveExpert = async (req, res) => {
  try {
    const { userId } = req.params; // ID of the expert to be approved
    const user = await User.findById(userId);

    if (!user || user.role !== 'expert') {
      return res.status(404).json({ message: 'Utilisateur expert non trouvé.' });
    }

    if (user.status === 'Active') {
      return res.status(400).json({ message: 'Le compte expert est déjà actif.' });
    }

    user.status = 'Active';
    await user.save();

    res.status(200).json({ message: 'Compte expert approuvé.', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l’approbation de l’expert.', error: error.message });
  }
};

// Reject Expert Account
exports.rejectExpert = async (req, res) => {
  try {
    const { userId } = req.params; // ID of the expert to be rejected
    const user = await User.findById(userId);

    if (!user || user.role !== 'expert') {
      return res.status(404).json({ message: 'Utilisateur expert non trouvé.' });
    }

    if (user.status === 'Active') {
      return res.status(400).json({ message: 'Le compte expert est déjà actif et ne peut pas être rejeté.' });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Compte expert rejeté et supprimé.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du rejet de l’expert.', error: error.message });
  }
};

// List Pending Experts
exports.listPendingExperts = async (req, res) => {
  try {
    const pendingExperts = await User.find({ role: 'expert', status: 'Pending' });

    res.status(200).json({ message: 'Liste des experts en attente récupérée.', pendingExperts });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des experts en attente.', error: error.message });
  }
};

// View All Constats Submitted by Clients
exports.viewAllConstats = async (req, res) => {
  try {
    const constats = await Constat.find().populate('client', 'name email'); // Assuming constats have a reference to the client
    res.status(200).json({ message: 'Liste de tous les constats récupérée.', constats });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des constats.', error: error.message });
  }
};

// Approve or Reject a Constat
exports.approveOrRejectConstat = async (req, res) => {
  try {
    const { constatId } = req.params;
    const { status } = req.body; // Expected to be "Approved" or "Rejected"

    const validStatuses = ['In Progress', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide. Utilisez "In Progress" ou "Rejected".' });
    }

    const constat = await Constat.findById(constatId);
    if (!constat) {
      return res.status(404).json({ message: 'Constat non trouvé.' });
    }

    constat.status = status;
    await constat.save();

    res.status(200).json({ message: `Constat ${status.toLowerCase()} avec succès.`, constat });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du constat.', error: error.message });
  }
};

// Assign Expert to Approved Constat
exports.assignExpertToConstat = async (req, res) => {
    try {
      const { constatId } = req.params;
      const { expertId } = req.body;
  
      // Fetch the constat and verify it's in progress
      const constat = await Constat.findById(constatId);
      if (!constat || constat.status !== 'In Progress') {
        return res.status(400).json({ message: 'Constat introuvable ou non approuvé.' });
      }
  
      // Fetch the expert and verify their role and status
      const expert = await User.findById(expertId);
      if (!expert || expert.role !== 'expert' || expert.status !== 'Active') {
        return res.status(400).json({ message: 'Expert introuvable ou non actif.' });
      }
  
      // Assign the expert to the constat
      constat.assignedExpert = expertId; // Assuming the Constat model has an `assignedExpert` field
      await constat.save();
  
      // Notify the expert via email
      const expertEmail = expert.email;
      const subject = `Vous avez été assigné à un nouveau constat`;
      const html = `
        <p>Bonjour ${expert.name},</p>
        <p>Vous avez été assigné au constat suivant :</p>
        <ul>
          <li><strong>Type :</strong> ${constat.type}</li>
          <li><strong>Lieu :</strong> ${constat.location}</li>
          <li><strong>Description :</strong> ${constat.description}</li>
          <li><strong>Date :</strong> ${new Date(constat.dateTime).toLocaleString()}</li>
        </ul>
        <p>Veuillez vous connecter à la plateforme pour consulter plus de détails et gérer ce constat.</p>
      `;
  
      try {
        await sendEmail(expertEmail, subject, html);
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email à l\'expert :', emailError);
        // Optionally include a warning in the response
      }
  
      res.status(200).json({ message: 'Expert assigné au constat avec succès et notification envoyée.', constat });
    } catch (error) {
      console.error('Erreur lors de l\'assignation de l\'expert :', error);
      res.status(500).json({ message: 'Erreur lors de l’assignation de l’expert.', error: error.message });
    }
  };
  
// View List of Available Experts
exports.listAvailableExperts = async (req, res) => {
  try {
    const availableExperts = await User.find({ role: 'expert', status: 'Active' });
    res.status(200).json({ message: 'Liste des experts disponibles récupérée.', availableExperts });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des experts disponibles.', error: error.message });
  }
};

// Global Dashboard Stats
exports.getGlobalStats = async (req, res) => {
  try {
    const totalConstats = await Constat.countDocuments();
    const approvedConstats = await Constat.countDocuments({ status: 'Done' });
    const rejectedConstats = await Constat.countDocuments({ status: 'In Progress' });
    const pendingConstats = await Constat.countDocuments({ status: 'Pending' });

    const stats = {
      totalConstats,
      approvedConstats,
      rejectedConstats,
      pendingConstats,
    };

    res.status(200).json({ message: 'Statistiques globales récupérées.', stats });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques globales.', error: error.message });
  }
};


