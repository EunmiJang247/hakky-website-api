const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const divisionSchema = mongoose.Schema(
  {
    leagueId: {
      type: mongoose.Types.ObjectId,
      ref: 'League',
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
divisionSchema.plugin(toJSON);
divisionSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Division = mongoose.model('Division', divisionSchema);

module.exports = Division;
