const Movie = require('../models/Movie');

module.exports = {
  getAll,
  getById,
  getMovieByCondition,
  getMovieListWithPagination,
  getMovieListTotalCount,
  create,
  update,
  delete: _delete
};

async function getAll() {
  const movies = await Movie.find();
  return movies;
}

async function getMovieListWithPagination(params) {
  const { rows, filter, page, is_deleted = false } = params;
  const movie = await Movie.aggregate([
    {
      $match: {
        is_deleted
      }
    },
    {
      $match: {
        $or: [
          {
            title: { $regex: filter, $options: 'i' }
          },
          {
            publish_year: { $regex: filter, $options: 'i' }
          }
        ]
      }
    },
    { $skip: (page > 0 ? page - 1 : 0) * rows },
    { $limit: rows }
  ]);
  return movie;
}

async function getMovieListTotalCount(params) {
  const { filter, is_deleted = false } = params;
  const movie = await Movie.aggregate([
    {
      $match: {
        is_deleted
      }
    },
    {
      $match: {
        $or: [
          {
            title: { $regex: filter, $options: 'i' }
          },
          {
            publish_year: { $regex: filter, $options: 'i' }
          }
        ]
      }
    }
  ]);
  return movie.length;
}

async function getById(id) {
  return await Movie.findById(id);
}

async function getMovieByCondition(condition) {
  return await Movie.findOne(condition);
}

async function create(movieParams) {
  const movie = new Movie(movieParams);

  await movie.save();

  return movie;
}

async function update(id, movieParams) {
  const movie = await Movie.findById(id);

  if (!movie) return { code: 500, message: 'Movie not found' };

  Object.assign(movie, movieParams);

  await movie.save();

  return movie;
}

async function _delete(id) {
  return await Movie.updateOne({ _id: id }, { is_deleted: true });
}
