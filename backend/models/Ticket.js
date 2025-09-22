const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  flightNumber: String,
  destination: String,
  date: String,
  paid: Boolean
});

module.exports = mongoose.model('Ticket', TicketSchema);
