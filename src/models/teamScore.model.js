const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const leagueSchema = mongoose.Schema(
  {
    teamId: {
      type: mongoose.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    GP: {
      type: String,
      required: true,
    },
    W: {
      type: String,
      required: true,
    },
    L: {
      type: String,
      required: false,
    },
    T: {
      type: String,
      required: true,
    },
    OTW: {
      type: String,
      required: false,
    },
    OTL: {
      type: String,
      required: false,
    },
    GF: {
      type: String,
      required: false,
    },
    GA: {
      type: String,
      required: false,
    },
    GD: {
      type: String,
      required: false,
    },
    PTS: {
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
