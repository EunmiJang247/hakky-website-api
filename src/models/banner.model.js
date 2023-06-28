const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const mainPageBannerSchema = mongoose.Schema(
  {
    banner1: bannerSchema,
    banner2: bannerSchema,
    banner3: bannerSchema,
    banner4: bannerSchema,
  },
);

const MainPageBanner = mongoose.model('MainPageBanner', mainPageBannerSchema);

module.exports = MainPageBanner;
