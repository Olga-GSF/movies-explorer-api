const mongoose = require('mongoose');
const Movie = require('../models/movie');
const {
  STATUS_CODES,
  ERROR_MESSAGE,
} = require('../utils/constants');

const NotFoundErr = require('../errors/NotFoundErr');
const ForbbidenErr = require('../errors/ForbiddenErr');
const BadRequestErr = require('../errors/BadRequestErr');

const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => {
      res.status(STATUS_CODES.SUCCESS).send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr(ERROR_MESSAGE.GET_MOVIES_ERROR));
      }
      return next(err);
    });
};

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch(next);
};

const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundErr(ERROR_MESSAGE.DELETE_MOVIESID_ERROR);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbbidenErr(ERROR_MESSAGE.REFUSAL_TO_DELETE);
      }
      return Movie.findByIdAndRemove(req.params.movieId)
        .then((removedMovie) => res.send(removedMovie));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestErr(ERROR_MESSAGE.DELETE_MOVIESID_ERROR));
      }
      return next(err);
    });
};

module.exports = {
  createMovies,
  getMovies,
  deleteMovieById,
};
