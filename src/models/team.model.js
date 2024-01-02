const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const teamSchema = mongoose.Schema(
  {
    viceChiefName: {
      type: String,
      required: false,
    },
    place: {
      type: String,
      required: false,
    },
    pd: {
      type: String,
      required: false,
    },
    coach: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    borrowTime: {
      type: String,
      required: false,
    },
    chiefName: {
      type: String,
      required: false,
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
