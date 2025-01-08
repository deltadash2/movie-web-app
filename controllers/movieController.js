const { validationResult } = require('express-validator');

const movieService = require('../services/movieService');

exports.getMovies = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { page = 1, limit = 8, search = '' } = req.query;

  try {
    const movies = await movieService.getMovieListWithPagination({
      rows: parseInt(limit),
      filter: search,
      page: parseInt(page)
    });

    const totalCount = await movieService.getMovieListTotalCount({
      filter: search
    });

    res.status(200).send({
      movies,
      totalCount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getMovieById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;

  try {
    const movie = await movieService.getById(id);
    if (!movie) {
      return res.status(404).json({ msg: 'Movie not found' });
    }

    res.status(200).send(movie);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.createMovie = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, publish_year } = req.body;
  const thumbnail_file = req.file;

  if (!thumbnail_file) {
    return res.status(400).send('No thumbnail file uploaded');
  }

  const thumbnailUrl = `/resources/thumbnails/${thumbnail_file.filename}`;

  try {
    const newMovie = await movieService.create({
      title,
      publish_year,
      thumbnail: thumbnailUrl
    });

    res.status(200).send(newMovie);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateMovie = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, publish_year } = req.body;
  const thumbnail_file = req.file;

  let movieParams = {
    title,
    publish_year
  };

  if (thumbnail_file) {
    const thumbnailUrl = `/resources/thumbnails/${thumbnail_file.filename}`;
    movieParams = {
      title,
      publish_year,
      thumbnail: thumbnailUrl
    };
  }

  try {
    const updatedMovie = await movieService.update(id, movieParams);

    res.status(200).send(updatedMovie);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteMovie = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;

  try {
    await movieService.delete(id);

    res.status(200).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
