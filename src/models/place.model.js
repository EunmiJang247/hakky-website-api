const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const businessHoursSchema = mongoose.Schema({
  mon: {
    type: String,
    required: true,
  },
  tue: {
    type: String,
    required: true,
  },
  wed: {
    type: String,
    required: true,
  },
  thu: {
    type: String,
    required: true,
  },
  fri: {
    type: String,
    required: true,
  },
  sat: {
    type: String,
    required: true,
  },
  sun: {
    type: String,
    required: true,
  },
});

const scheduleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    term: businessHoursSchema,
  },
  {
    timestamps: true,
  }
);

const excludeScheduleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    businessHours: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const includeScheduleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const placeSchema = mongoose.Schema(
  {
    images: {
      type: [String],
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      tag: {
        type: String,
        required: true,
        trim: true,
      },
      instagram: {
        type: String,
        required: true,
        trim: true,
      },
      images: {
        type: [String],
        required: true,
        trim: true,
      },
    },
    schedule: [scheduleSchema],
    excludeSchedule: [excludeScheduleSchema],
    includeSchedule: [includeScheduleSchema],
    product: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'Product',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
placeSchema.plugin(toJSON);
placeSchema.plugin(paginate);

/**
 * @typedef Place
 */
const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
