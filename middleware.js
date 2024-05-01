module.exports.isLoggedIn = (req,res,next)=>{
  console.log(req.user);

    if(!req.isAuthenticated()){
        req.flash("error","You must login before creating listing")
        return res.redirect("/login")
      }
      next();
}