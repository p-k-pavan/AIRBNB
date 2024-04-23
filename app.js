// app.js

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session")
const flash = require("connect-flash")

const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js")

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

const sessionOption = {
  secret:"MysuperKey",
  resave:true,
  saveUninitialized: true,
  cookie : {
    expires:Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
     httpOnly:true
  }
}


app.use(session(sessionOption))
app.use(flash())

app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error")
  next();
})

// Routes
app.use("/listings", listings);
app.use("/listings/:id", reviews); // Mount the reviews router without including '/reviews'

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
