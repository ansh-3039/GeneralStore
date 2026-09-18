const multer = require('multer');
const path = require('path');

const fs = require('fs');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (err) {
        // Fallback to /tmp if local dir is read-only
        cb(null, '/tmp');
        return;
      }
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;
