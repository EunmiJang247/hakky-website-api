const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const tournamentSchema = mongoose.Schema(
  {
    divisionId: {
      type: mongoose.Types.ObjectId,
      ref: 'Division',
      required: true,
    },
    tournamentDate: {
      type: Date,
      required: true,
    },
    venuePlace: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    supervisor: {
      type: String,
      required: true,
    },
    referee: {
      type: String,
      required: true,
    },
    homeTeamId: {
      type: mongoose.Types.ObjectId,
      ref: 'Division',
      required: false,
    },
    awayTeamId: {
      type: mongoose.Types.ObjectId,
      ref: 'Division',
      required: false,
    },
    optionsGoalsHome: {
      type: Array,
      required: false,
    },
    optionPaneltiesHome: {
      type: Array,
      required: false,
    },
    optionGoalieSavesHome: {
      type: Array,
      required: false,
    },
    optionsGoalsAway: {
      type: Array,
      required: false,
    },
    optionPaneltiesAway: {
      type: Array,
      required: false,
    },
    optionGoalieSavesAway: {
      type: Array,
      required: false,
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
