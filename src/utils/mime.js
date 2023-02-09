const mimeToExt = (mime) => {
  switch (mime) {
    case 'image/png':
      return 'png';

    case 'image/jpeg':
      return 'jpeg';

    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'docx';

    default:
      return undefined;
  }
};

const isAllowedMime = (mime) => {
  switch (mime) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/svg':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return true;
    default:
      return false;
  }
};

module.exports = {
  mimeToExt,
  isAllowedMime,
};
