const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

const app = express();

main()
  .then(() => {
    console.log("connected db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wounderLust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/listings", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
});

// new listings

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;

  let data = await Listing.findById(id);

  res.render("listings/show.ejs", { data });
});

//create route
app.post("/listings", async (req, res) => {
  let newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//edit route

app.get("/listings/:id/edit", async (req, res) => {
  let id = req.params.id;
  const data = await Listing.findById(id);
  res.render("listings/edit.ejs", { data });
});

app.put("/listings/:id", async (req, res) => {
  let id = req.params.id;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server was listen in port ", PORT);
});
