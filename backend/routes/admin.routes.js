import express from 'express';
import  {addProduct, login}  from '../controllers/admin.controller.js';
import multer from 'multer';
import { adminMiddleware } from '../middleware/auth.middleware.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/login', login)
router.post('/add-product',adminMiddleware ,upload.single('image'), addProduct)

export default router;