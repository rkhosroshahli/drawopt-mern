const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Point = require('../models/point');
const solution = require('../models/solution');

const getSolutionsById = async (req, res, next) => {
  const solutionId = req.params.pid;

  let solution;
  try {
    solution = await solution.findById(solutionId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find the points.',
      500
    );
    return next(error);
  }

  if (!solution) {
    const error = new HttpError(
      'Could not find point for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ solution: solution.toObject({ getters: true }) });
};

// const getPlacesByUserId = async (req, res, next) => {
//   const userId = req.params.uid;

//   // let places;
//   let userWithPlaces;
//   try {
//     userWithPlaces = await User.findById(userId).populate('places');
//   } catch (err) {
//     const error = new HttpError(
//       'Fetching places failed, please try again later.',
//       500
//     );
//     return next(error);
//   }

//   // if (!places || places.length === 0) {
//   if (!userWithPlaces || userWithPlaces.places.length === 0) {
//     return next(
//       new HttpError('Could not find places for the provided user id.', 404)
//     );
//   }

//   res.json({
//     places: userWithPlaces.places.map(place =>
//       place.toObject({ getters: true })
//     )
//   });
// };

const createSolution = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { optimizer, optimizedSolution, optimizedPopulation, pointsId } = req.body;

  const createdSolution = new solution({
    optimizer,
    optimizedSolution,
    optimizedPopulation,
    pointsId
  });

  let points;
  try {
    points = await Point.findById(pointsId);
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }

  if (!points) {
    const error = new HttpError('Could not find points for provided id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPoint.save({ session: sess });
    points.solutions.push(createdSolution);
    await points.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating solution failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ point: createdPoint });
};

exports.getSolutionsById = getSolutionsById;
exports.createSolution = createSolution;