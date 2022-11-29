const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

const NotFoundErr = require('../errors/NotFoundErr');
const {
  ERROR_MESSAGE,
} = require('../utils/constants');

const { validateSignin, validateSignup } = require('../middlewares/validation');

router.post('/signin', validateSignin, login);

router.post('/signup', validateSignup, createUser);

router.use(auth);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', () => {
  throw new NotFoundErr(ERROR_MESSAGE.NOT_FOUND_ERROR_TEST);
});

module.exports = router;
