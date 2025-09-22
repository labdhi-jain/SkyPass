const express = require('express');
const jwt = require('jsonwebtoken');
const Ticket = require('../models/Ticket'); // Adjust path if needed
const User = require('../models/User');     // Adjust path if needed

const router = express.Router();

// ✅ Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ error: 'No token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    req.userId = decoded.userId;
    next();
  });
};

// 🎫 Basic Ticket Route (for testing)
router.post('/ticket', async (req, res) => {
  res.json({ message: 'Ticket route working' });
});

// ✈️ Book a ticket
router.post('/book', authMiddleware, async (req, res) => {
  const { flightNumber, destination, date } = req.body;
  const ticket = new Ticket({
    userId: req.userId,
    flightNumber,
    destination,
    date,
    paid: false,
  });
  await ticket.save();
  res.json(ticket);
});

// 🧾 Get user tickets
router.post('/tickets', authMiddleware, async (req, res) => {
  const tickets = await Ticket.find({ userId: req.userId });
  res.json(tickets);
});

// 👤 Get user profile
router.post('/user', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

module.exports = router;
