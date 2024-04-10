const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const WrapAsync = require("./Utils/WrapAsync.js");
const ExpressError = require("./Utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

const app = express();

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/wounderLust");
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the application if unable to connect to the database
  }
}

connectToDatabase();

// Middleware and configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// Routes

// Index route - Display all listings
app.get(
  "/listings",
  WrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
  })
);

// New listing form
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

// Show route - Display details of a specific listing
app.get(
  "/listings/:id",
  WrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/show", { listing });
  })
);

// Create route - Add a new listing
// Create route - Add a new listing
app.post(
  "/listings",
  validateListing,
  WrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Edit route - Display form to edit a listing
app.get(
  "/listings/:id/edit",
  WrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("listings/edit", { listing });
  })
);

// Update route - Update a listing
app.put(
  "/listings/:id",
  validateListing,
  WrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
  })
);

// Delete route - Delete a listing
app.delete(
  "/listings/:id",
  WrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // res.status(statusCode).send(message);
  res.render("listings/Error", { message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
