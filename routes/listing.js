const express = require("express");
const router = express.Router();
const ExpressError = require("../Utils/ExpressError.js");
const WrapAsync = require("../Utils/WrapAsync.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      throw new ExpressError(400, error);
    } else {
      next();
    }
  };
  
 

// Index route - Display all listings
router.get(
  "/",
  WrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
  })
);

// New listing form
router.get("/new", (req, res) => {
  res.render("listings/new");
});

// Show route - Display details of a specific listing
router.get(
  "/:id",
  WrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews");
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/show", { listing });
  })
);

// Create route - Add a new listing
// Create route - Add a new listing
router.post(
  "/",
  validateListing,
  WrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Edit route - Display form to edit a listing
router.get(
  "/:id/edit",
  WrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/edit", { listing });
  })
);

// Update route - Update a listing
router.put(
  "/:id",
  validateListing,
  WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
  })
);

// Delete route - Delete a listing
router.delete(
  "/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);



module.exports = router;
