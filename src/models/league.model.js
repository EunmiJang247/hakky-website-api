const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const leagueSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    active: {
      type: String,
      required: true,
    },
    regulation: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
leagueSchema.plugin(toJSON);
leagueSchema.plugin(paginate);

/**
 * @typedef Token
 */
const League = mongoose.model('League', leagueSchema);

module.exports = League;
