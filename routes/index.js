const express = require('express');
const router = express.Router();

const usersRouter = require('./api/users');
const authRouter = require('./api/auth');
const movieRouter = require('./api/movies');

router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/movies', movieRouter);

module.exports = router;
