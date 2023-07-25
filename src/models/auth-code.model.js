const mongoose = require('mongoose');

const authCodeSchema = mongoose.Schema(
  {
    identifier: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const AuthCode = mongoose.model('AuthCode', authCodeSchema);

module.exports = AuthCode;
