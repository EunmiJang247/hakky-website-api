const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const playerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    englishName: {
      type: String,
      required: false,
    },
    file: {
      type: Object,
      required: true,
    },
    mainHand: {
      type: String,
      required: false,
    },
    position: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: false,
    },
    birth: {
      type: String,
      required: false,
    },
    backNumber: {
      type: String,
      required: true,
    },
    teamId: {
      type: mongoose.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    active: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
playerSchema.plugin(toJSON);
playerSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
