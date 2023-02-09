const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { counselorService } = require('../services');
const pick = require('../utils/pick');
const { preSignS3Object } = require('../utils/upload');

const createCounselor = catchAsync(async (req, res) => {
  const user = await counselorService.createCounselor(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getCounselors = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await counselorService.queryCounselors({}, options);

  const serializedResult = result.results.map((r) => {
    return {
      ...r.toObject(),
      id: r.id,
      image: {
        tempUrl: preSignS3Object(r.image),
        key: r.image,
      },
    };
  });
  res.send({
    ...result,
    results: serializedResult,
  });
});

const getCounselor = catchAsync(async (req, res) => {
  const counselor = await counselorService.getCounselorById(req.params.counselorId);
  if (!counselor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Counselor not found');
  }
  res.send({
    ...counselor.toObject(),
    id: counselor.id,
    image: {
      tempUrl: preSignS3Object(counselor.image),
      key: counselor.image,
    },
  });
});

const updateCounselor = catchAsync(async (req, res) => {
  const user = await counselorService.updateCounselorById(req.params.counselorId, req.body);
  res.send(user);
});

const deleteCounselor = catchAsync(async (req, res) => {
  await counselorService.deleteCounselorById(req.params.counselorId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCounselor,
  getCounselors,
  getCounselor,
  updateCounselor,
  deleteCounselor,
};
