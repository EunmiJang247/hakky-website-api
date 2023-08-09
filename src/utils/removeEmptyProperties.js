// eslint-disable-next-line no-unused-vars
const removeEmptyProperties = (obj) => Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

module.exports = removeEmptyProperties;
