const express = require('express');
const { check } = require('express-validator');

const pointsControllers = require('../controllers/points-controllers');
// const fileUpload = require('../middleware/file-upload');
// const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', pointsControllers.getPointsById);

// router.get('/user/:uid', pointsControllers.get);

// router.use(checkAuth);

router.post(
  '/',
  // fileUpload.single('image'),
  [
    check('points')
      .not()
      .isEmpty(),
    // check('description').isLength({ min: 5 }),
    check('createdAt')
      .not()
      .isEmpty()
  ],
  pointsControllers.createPoint
);

// router.patch(
//   '/:pid',
//   [
//     check('title')
//       .not()
//       .isEmpty(),
//     check('description').isLength({ min: 5 })
//   ],
//   placesControllers.updatePlace
// );

// router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;