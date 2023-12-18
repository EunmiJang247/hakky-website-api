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
      required: true,
    },
    file: {
      type: Object,
      required: true,
    },
    mainHand: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    birth: {
      type: String,
      required: true,
    },
    backNumber: {
      type: String,
      required: true,
    },
    teamName: {
      type: String,
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
