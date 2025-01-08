const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const upload = require('../../middleware/multer');

const movieController = require('../../controllers/movieController');

router.post(
  '/',
  auth,
  upload.single('thumbnail_file'),
  check('title', 'title is required').notEmpty(),
  movieController.createMovie
);
router.get('/', auth, movieController.getMovies);
router.get('/:id', auth, checkObjectId('id'), movieController.getMovieById);
router.put(
  '/:id',
  auth,
  upload.single('thumbnail_file'),
  check('title', 'title is required').notEmpty(),
  checkObjectId('id'),
  movieController.updateMovie
);
router.delete('/:id', auth, checkObjectId('id'), movieController.deleteMovie);

module.exports = router;
