const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const leagueSchema = mongoose.Schema(
  {
    playerId: {
      type: mongoose.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    GP: {
      type: String,
      required: true,
    },
    G: {
      type: String,
      required: true,
    },
    A: {
      type: String,
      required: false,
    },
    P: {
      type: String,
      required: true,
    },
    PIM: {
      type: String,
      required: false,
    },
    SA: {
      type: String,
      required: false,
    },
    GA: {
      type: String,
      required: false,
    },
    SV: {
      type: String,
      required: false,
    },
    SVPercent: {
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
