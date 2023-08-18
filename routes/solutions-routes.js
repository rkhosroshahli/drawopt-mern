const express = require('express');
const { check } = require('express-validator');

const solutionsControllers = require('../controllers/solutions-controllers');
// const fileUpload = require('../middleware/file-upload');
// const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', solutionsControllers.getSolutionsById);

// router.get('/user/:uid', pointsControllers.get);

// router.use(checkAuth);

router.post(
  '/',
  // fileUpload.single('image'),
  [
    check('optimizer')
      .not()
      .isEmpty(),
    check('optimizedSolution')
      .not()
      .isEmpty(),
    // check('description').isLength({ min: 5 }),
    check('optimizedPopulation')
      .not()
      .isEmpty(),
    check('points')
      .not()
      .isEmpty()
  ],
  solutionsControllers.createSolution
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