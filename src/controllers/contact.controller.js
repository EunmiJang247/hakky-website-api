const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { contactService } = require('../services');
const pick = require('../utils/pick');

const createContact = catchAsync(async (req, res) => {
  const user = await contactService.createContact(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getContacts = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await contactService.queryContacts({}, options);
  res.send(result);
});

const getContact = catchAsync(async (req, res) => {
  const user = await contactService.getContactById(req.params.contactId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Contact not found');
  }
  res.send(user);
});

const updateContact = catchAsync(async (req, res) => {
  const user = await contactService.updateContactById(req.params.contactId, req.body);
  res.send(user);
});

const deleteContact = catchAsync(async (req, res) => {
  await contactService.deleteContactById(req.params.contactId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
};
