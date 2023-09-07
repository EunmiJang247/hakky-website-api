const httpStatus = require('http-status');
const {
  PlaceIdle,
  Reservation,
  Product,
  User,
} = require('../models');
const ApiError = require('../utils/ApiError');
const removeEmptyProperties = require('../utils/removeEmptyProperties');

const createPlace = async (placeBody) => PlaceIdle.Place.create(placeBody);

const getPlaces = async () => {
  const places = await PlaceIdle.Place.find();
  return places;
};

const getPlaceById = async (id) => {
  const detailData = await PlaceIdle.Place.findById(id);
  return detailData;
};

const getPlaceBySubAdmin = async (id) => {
  const detailData = await PlaceIdle.Place.findOne({ subAdmin: id });
  if (!detailData) {
    throw new ApiError(400, '아직 관리자가 할당되지 않은 지점입니다.');
  }
  return detailData;
};

const reservationCheck = (reservations, timeSchedule) => {
  const businessHours = timeSchedule.split(',');
  const reservList = [];

  for (let i = 0; i < businessHours.length; i += 1) {
    const [start, end] = businessHours[i].split('-');
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const differenceHour = endHour - startHour;
    let h = startHour;

    for (let j = 0; j < differenceHour; j += 1) {
      if (startMinute === 0 && h === startHour) {
        reservList.push({ time: `${h}:00`, available: true });
        reservList.push({ time: `${h}:30`, available: true });
      } else if (startMinute === 30 && h === startHour) {
        reservList.push({ time: `${h}:30`, available: true });
      } else if (endMinute === 0 && h === endHour) {
        reservList.push({ time: `${h}:00`, available: false });
      } else if (endMinute === 30 && h + 1 === endHour) {
        reservList.push({ time: `${h}:00`, available: true });
        reservList.push({ time: `${h}:30`, available: true });
        reservList.push({ time: `${h + 1}:00`, available: true });
      } else {
        // eslint-disable-next-line no-lonely-if
        if (h !== endHour) {
          reservList.push({ time: `${h}:00`, available: true });
          reservList.push({ time: `${h}:30`, available: true });
        } else {
          reservList.push({ time: `${h}:00`, available: true });
          reservList.push({ time: `${h}:30`, available: false });
        }
      }
      h += 1;
    }

    const endOfDayHour = parseInt(businessHours[businessHours.length - 1].split('-')[1].split(':')[0], 10);
    if (h !== endOfDayHour) {
      const nextHour = parseInt(businessHours[i + 1].split('-')[0].split(':')[0], 10);
      const nextMinute = parseInt(businessHours[i + 1].split('-')[0].split(':')[1], 10);
      if (nextHour - endHour >= 1) {
        if (nextMinute === 0 && endMinute === 30) {
          for (let k = endHour; k + 1 <= nextHour; k += 1) {
            if (endHour === k) {
              reservList.push({ time: `${k}:30`, available: false });
            } else {
              reservList.push({ time: `${k}:00`, available: false });
              reservList.push({ time: `${k}:30`, available: false });
            }
          }
        } else if (nextMinute === 30 && endMinute === 0) {
          for (let k = endHour; k + 1 <= nextHour; k += 1) {
            if (nextHour === endHour && nextMinute === 30) {
              reservList.push({ time: `${k}:00`, available: false });
            } else if (k + 1 === nextHour) {
              reservList.push({ time: `${k}:00`, available: false });
              reservList.push({ time: `${k}:30`, available: false });
              reservList.push({ time: `${k + 1}:00`, available: false });
            } else {
              reservList.push({ time: `${k}:00`, available: false });
              reservList.push({ time: `${k}:30`, available: false });
            }
          }
        } else if (nextMinute === 30 && endMinute === 30) {
          for (let k = endHour; k + 1 <= nextHour; k += 1) {
            if (nextHour === endHour && nextMinute === 30) {
              reservList.push({ time: `${k}:00`, available: false });
            } else if (k + 1 === nextHour) {
              reservList.push({ time: `${k}:00`, available: false });
              reservList.push({ time: `${k}:30`, available: false });
              reservList.push({ time: `${k + 1}:00`, available: false });
            } else {
              reservList.push({ time: `${k}:30`, available: false });
            }
          }
        } else {
          for (let k = endHour; k + 1 <= nextHour; k += 1) {
            reservList.push({ time: `${k}:00`, available: false });
            reservList.push({ time: `${k}:30`, available: false });
          }
        }
        h += 1;
      }
    }
  }

  for (let i = 0; i < reservations.length; i += 1) {
    for (let j = 0; j < reservList.length; j += 1) {
      const reservationStart = new Date(reservations[i].reservationFrom);
      const reservationEnd = new Date(reservations[i].reservationTo);
      const reservationStartHours = reservationStart.getHours() + 9;
      const reservationStartMinutes = reservationStart.getMinutes();
      const reservationEndHours = reservationEnd.getHours() + 9;
      const reservationEndMinutes = reservationEnd.getMinutes();

      const reservTime = reservList[j].time.split(':');
      const reservHours = parseInt(reservTime[0], 10);
      const reservMinutes = parseInt(reservTime[1], 10);
      if (
        reservHours >= reservationStartHours && reservMinutes >= reservationStartMinutes && reservHours <= reservationEndHours
      ) {
        reservList[j].available = false;
        if (reservHours === reservationEndHours && reservationEndMinutes === 0 && reservMinutes === 30) {
          reservList[j].available = true;
        }
      }
    }
  }
  return reservList;
};

const availableTimeCheck = (reservList) => {
  let maxReservationTime = 0;
  let picker = 0;

  for (let i = 0; i < reservList.length; i += 1) {
    if (reservList[i].available) {
      picker += 30;
    } else if (maxReservationTime < picker) {
      maxReservationTime = picker;
      picker = 0;
    }
  }
  if (picker > maxReservationTime) {
    maxReservationTime = picker;
  }

  return maxReservationTime;
};

const getPlaceDetail = async (id, date, dayOfWeek) => {
  const schedule = await PlaceIdle.Schedule.findOne({
    place: id,
    startAt: { $lte: date },
    endAt: { $gte: date },
  });

  const ExcludeSchedules = await PlaceIdle.ExcludeSchedule.findOne({
    place: id,
    startAt: { $lte: date },
    endAt: { $gte: date },
  });

  if (!schedule) {
    return 'CAN_NOT_RESERVATION';
  }

  if (ExcludeSchedules) {
    return {
      max: 0,
      schedule: [],
      date,
      available: false,
    };
  }

  const scheduleMap = {
    0: schedule.term.sun,
    1: schedule.term.mon,
    2: schedule.term.tue,
    3: schedule.term.wed,
    4: schedule.term.thu,
    5: schedule.term.fri,
    6: schedule.term.sat,
  };
  const timeSchedule = scheduleMap[dayOfWeek];

  if (timeSchedule === '') {
    return {
      max: 0,
      schedule: [],
      date,
      available: false,
    };
  }
  const reservations = await Reservation.find({
    placeId: id,
    reservationDate: date,
    isCanceled: false,
    depositDeadline: { $gt: new Date() },
  }).sort('reservationFrom').exec();

  const includeSchedules = await PlaceIdle.IncludeSchedule.findOne({
    place: id,
    date,
  });

  let reservList;
  if (includeSchedules) {
    reservList = reservationCheck(reservations, includeSchedules.term);
  } else {
    reservList = reservationCheck(reservations, timeSchedule);
  }

  const maxReservationTime = availableTimeCheck(reservList);

  return {
    max: maxReservationTime,
    schedule: reservList,
    date,
    available: true,
  };
};

const getDateStartToLast = (start, last) => {
  const result = [];
  const curDate = new Date(start);

  while (curDate <= new Date(last)) {
    result.push(curDate.toISOString().split('T')[0]);
    curDate.setDate(curDate.getDate() + 1);
  }

  return result;
};

const getPlaceReservationList = async (id, date) => {
  const schedule = await PlaceIdle.Schedule.findOne({
    place: id,
    startAt: { $lte: date },
    endAt: { $gte: date },
  });
  if (!schedule) {
    return 'CAN_NOT_RESERVATION';
  }
  const dateList = getDateStartToLast(date, schedule.endAt);

  const result = await Promise.all(dateList.map(async (dateElem) => {
    const dayOfWeek = new Date(dateElem).getDay();
    const data = await getPlaceDetail(id, dateElem, dayOfWeek);
    return data;
  }));

  return result;
};

const updatePlace = async (placeId, updateBody) => {
  const place = await getPlaceById(placeId);
  if (!place) {
    throw new ApiError(httpStatus.NOT_FOUND, 'place not found');
  }
  Object.assign(place, removeEmptyProperties(updateBody));
  await place.save();
  return place;
};

const deletePlaceById = async (placeId) => {
  const place = await getPlaceById(placeId);
  if (!place) {
    throw new ApiError(httpStatus.NOT_FOUND, 'place not found');
  }
  await place.remove();
  return place;
};

const serializer = async (place) => {
  const productList = [];
  const subAdmin = await User.findById(place.subAdmin);
  const promiseList = place.product.map((prod) => Product.findById(prod));

  // promise all 순서보장이 안되서
  await promiseList.reduce((promise, currentPromise) => promise.then(async () => {
    const result = await currentPromise;
    productList.push(result);
    return result;
  }), Promise.resolve());

  // await Promise.all(place.product.map(async (prod) => {
  //   const product = await Product.findById(prod);
  //   productList.push(product);
  // }));
  return {
    id: place._id,
    subAdmin: subAdmin._id,
    subAdminName: subAdmin.name,
    images: place.images,
    name: place.name,
    phone: place.phone,
    address1: place.address1,
    address2: place.address2,
    postalCode: place.postalCode,
    author: place.author,
    product: productList,
    createAt: place.createdAt,
  };
};

module.exports = {
  createPlace,
  getPlaces,
  getPlaceById,
  getPlaceDetail,
  getPlaceReservationList,
  getPlaceBySubAdmin,
  deletePlaceById,
  updatePlace,
  serializer,
};
