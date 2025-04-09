// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images/uploads/');
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    // Use the field name plus the current timestamp and original extension
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

// File filter to accept images only
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
module.exports = upload;
