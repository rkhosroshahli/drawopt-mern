const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Point = require('../models/point');

const getPointsById = async (req, res, next) => {
  const pointId = req.params.pid;

  let point;
  try {
    point = await point.findById(pointId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find the points.',
      500
    );
    return next(error);
  }

  if (!point) {
    const error = new HttpError(
      'Could not find point for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ point: point.toObject({ getters: true }) });
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

const createPoint = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { points } = req.body;

  const createdPoint = new Point({
    points
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPoint.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating point failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ point: createdPoint });
};

// const updatePoint = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next(
//       new HttpError('Invalid inputs passed, please check your data.', 422)
//     );
//   }

//   const { title, description } = req.body;
//   const placeId = req.params.pid;

//   let place;
//   try {
//     place = await Place.findById(placeId);
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not update place.',
//       500
//     );
//     return next(error);
//   }

//   if (place.creator.toString() !== req.userData.userId) {
//     const error = new HttpError(
//       'You are not allowed to edit this place.',
//       401
//     );
//     return next(error);
//   }

//   place.title = title;
//   place.description = description;

//   try {
//     await place.save();
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not update place.',
//       500
//     );
//     return next(error);
//   }

//   res.status(200).json({ place: place.toObject({ getters: true }) });
// };

// const deletePoint = async (req, res, next) => {
//   const pointId = req.params.pid;

//   let point;
//   try {
//     point = await point.findById(pointId).populate('creator');
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not delete place.',
//       500
//     );
//     return next(error);
//   }

//   if (!place) {
//     const error = new HttpError('Could not find place for this id.', 404);
//     return next(error);
//   }

//   const imagePath = place.image;

//   try {
//     const sess = await mongoose.startSession();
//     sess.startTransaction();
//     await place.remove({ session: sess });
//     place.creator.places.pull(place);
//     await place.creator.save({ session: sess });
//     await sess.commitTransaction();
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not delete place.',
//       500
//     );
//     return next(error);
//   }

//   fs.unlink(imagePath, err => {
//     console.log(err);
//   });

//   res.status(200).json({ message: 'Deleted place.' });
// };

exports.getPointsById = getPointsById;
exports.createPoint = createPoint;
// exports.updatePoint = updatePoint;
// exports.deletePoint = deletePoint;