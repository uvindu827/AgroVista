import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const isValid = allowed.test(path.extname(file.originalname).toLowerCase());
  isValid ? cb(null, true) : cb(new Error('Only image files are allowed'));
};

export default multer({ storage, fileFilter });
