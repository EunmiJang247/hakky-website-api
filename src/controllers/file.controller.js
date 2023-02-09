const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { errorData } = require('../utils/errorData');
const { preSignS3Object } = require('../utils/upload');

const file = catchAsync(async (req, res) => {
  if (req.file === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, errorData.FILE_REQUIRED);
  }

  const tempUrl = preSignS3Object(req.file.key);

  res.status(httpStatus.CREATED).send({
    originalName: req.file.originalname,
    key: req.file.key,
    tempUrl,
  });
});

module.exports = {
  file,
};
