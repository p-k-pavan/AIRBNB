// reviews.js

const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../Utils/ExpressError.js");
const WrapAsync = require("../Utils/WrapAsync.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router.post(
  "/reviews", // Change the route path to only include '/reviews'
  validateReview,
  WrapAsync(async (req, res, next) => {
    try {
      let listing = await Listing.findById(req.params.id);
      if (!listing) {
        throw new ExpressError(404, "Listing not found");
      }

      let newReview = new Review(req.body.review);
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      req.flash("success", "New Review Created!")
      res.redirect(`/listings/${listing._id}`);
    } catch (error) {
      next(error); // Pass the error to the error handling middleware
    }
  })
);

module.exports = router;
