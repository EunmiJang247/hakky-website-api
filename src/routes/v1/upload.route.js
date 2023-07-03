const express = require('express');
const { upload, uploadAsPublic } = require('../../utils/upload');
const { fileController } = require('../../controllers');

const router = express.Router();

router.post('/', upload.single('file'), fileController.file);
router.post('/public', uploadAsPublic.single('file'), fileController.fileAsPublic);

module.exports = router;
