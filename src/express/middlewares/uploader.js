'use strict';

const multer = require(`multer`);
const {nanoid} = require(`nanoid`);
const path = require(`path`);

const UPLOAD_DIR = path.join(__dirname, `../public/img`);

const MimeTypeExtension = {
  'image/png': `png`,
  'image/jpeg': `jpg`,
  'image/jpg': `jpg`,
};

// Подготовка хранилища для сохранения файлов
const storage = multer.diskStorage({
  destination: (req, file, next) => next(null, UPLOAD_DIR),
  filename: (req, file, next) => {
    const fileExtension = MimeTypeExtension[file.mimetype];
    next(null, `${nanoid()}.${fileExtension}`);
  },
});

// Функция определяет допустимые файлы для загрузки
const fileFilter = (req, file, next) => {
  const allowTypes = Object.keys(MimeTypeExtension);
  const isValid = allowTypes.includes(file.mimetype);
  next(null, isValid);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
});

module.exports = upload;

