const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket'); // adjust path if needed

// POST /api/pay
router.post('/pay', async (req, res) => {
  const { ticketId } = req.body;

  if (!ticketId) {
    return res.status(400).json({ error: 'Ticket ID is required' });
  }

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    ticket.paid = true;
    await ticket.save();

    res.json({ message: 'Payment successful', ticket });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
