const express = require('express');
const { upload } = require('../../utils/upload');
const { fileController } = require('../../controllers');

const router = express.Router();

router.post('/', upload.single('file'), fileController.file);

module.exports = router;
