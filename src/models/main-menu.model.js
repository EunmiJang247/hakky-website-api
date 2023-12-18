const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const mainMenuSchema = mongoose.Schema(
  {
    menus: {
      type: Array,
      required: true,
    },
  },
);

// add plugin that converts mongoose to json
mainMenuSchema.plugin(toJSON);
mainMenuSchema.plugin(paginate);

/**
 * @typedef Token
 */
const MainMenu = mongoose.model('MainMenu', mainMenuSchema);

module.exports = MainMenu;
