const express = require("express");
const router = express.Router();
const ExpressError = require("../Utils/ExpressError.js");
const WrapAsync = require("../Utils/WrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signUp", (req, res) => {
  res.render("User/signUp.ejs");
});

router.post(
  "/signUp",
  WrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;

      const newUser = new User({ email, username });
      const userRegister = await User.register(newUser, password);
      req.flash("success", "user register successfully!");
      res.redirect("/login");
    } catch (error) {
      req.flash("success", "user register alredy exist");
      res.redirect("/signUp");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("User/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    res.redirect("/listings");
    req.flash("success", "user Login successfully!");
  }
);

module.exports = router;
