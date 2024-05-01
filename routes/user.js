const express = require("express");
const router = express.Router();
const ExpressError = require("../Utils/ExpressError.js");
const WrapAsync = require("../Utils/WrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

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
      req.login(userRegister,(err)=>{
        if(err){
          next(err);
        }
        req.flash("success", "user register successfully!");
      res.redirect("/listings");
      })
      
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
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    res.redirect(res.locals.redirectUrl); // Corrected from req.locals to res.locals
    req.flash("success", "user Login successfully!");
  }
);


router.get("/logOut",(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      next(err);
    }
    req.flash("success","Logout successfully")
    return res.redirect("/listings")
  })
})

module.exports = router;
