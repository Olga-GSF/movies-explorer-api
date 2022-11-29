const router = require('express').Router();
const {
  createMovies, getMovies, deleteMovieById,
} = require('../controllers/movies');

const { validateMovie, validateDeleteMovie } = require('../middlewares/validation');

router.post('/', validateMovie, createMovies);

router.get('/', getMovies);

router.delete('/:movieId', validateDeleteMovie, deleteMovieById);

module.exports = router;
