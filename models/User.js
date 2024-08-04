const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  staffId: { type: String, required: true, unique: true },
  adminKey: { type: String } // New field for admin key
});

const User = mongoose.model('User', userSchema);

module.exports = User;
