const multer = require('multer');
const path = require('path');
const uuid = require('uuid')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'files/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, `${uuid.v4()}${path.extname(file.originalname)}`);
    },
})

const upload = multer({
    storage: storage,
})

module.exports = upload;