module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must login before creating listing")
        res.redirect("/login")
      }
      next();
}