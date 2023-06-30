const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
    place: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
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
  },
);

const excludeScheduleSchema = mongoose.Schema(
  {
    place: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
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
  },
);

const includeScheduleSchema = mongoose.Schema(
  {
    place: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    term: businessHoursSchema,
  },
  {
    timestamps: true,
  },
);

const placeSchema = mongoose.Schema(
  {
    subAdmin: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    images: {
      type: [Object],
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
    address1: {
      type: String,
      required: true,
      trim: true,
    },
    address2: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
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
        type: [Object],
        required: true,
        trim: true,
      },
    },
    product: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'Product',
    },
  },
  {
    timestamps: true,
  },
);

placeSchema.pre('save', async function (next) {
  const place = this;
  if (place.isModified('password')) {
    place.password = await bcrypt.hash(place.password, 8);
  }
  next();
});

// add plugin that converts mongoose to json
placeSchema.plugin(toJSON);
placeSchema.plugin(paginate);

const Place = mongoose.model('Place', placeSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);
const IncludeSchedule = mongoose.model('IncludeSchedule', includeScheduleSchema);
const ExcludeSchedule = mongoose.model('ExcludeSchedule', excludeScheduleSchema);

module.exports = {
  Place,
  Schedule,
  IncludeSchedule,
  ExcludeSchedule,
};
