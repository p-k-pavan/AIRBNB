const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1562692813-9f7ec308836a?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  price: {
    type: Number,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
