const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const teamSchema = mongoose.Schema(
  {
    viceChiefName: {
      type: String,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    pd: {
      type: String,
      required: true,
    },
    coach: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    borrowTime: {
      type: String,
      required: true,
    },
    chiefName: {
      type: String,
      required: true,
    },
    active: {
      type: String,
      required: true,
    },
    file: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
teamSchema.plugin(toJSON);
teamSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
