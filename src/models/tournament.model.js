const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const tournamentSchema = mongoose.Schema(
  {
    leagueId: {
      type: mongoose.Types.ObjectId,
      ref: 'League',
      required: true,
    },
    divisionId: {
      type: mongoose.Types.ObjectId,
      ref: 'Division',
      required: true,
    },
    homeTeamId: {
      type: mongoose.Types.ObjectId,
      ref: 'Division',
      required: true,
    },
    awayTeamId: {
      type: mongoose.Types.ObjectId,
      ref: 'Division',
      required: true,
    },
    leagueName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    team: {
      type: Array,
      require: false,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
tournamentSchema.plugin(toJSON);
tournamentSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;
