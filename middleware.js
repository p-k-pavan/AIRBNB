module.exports.isLoggedIn = (req,res,next)=>{
  console.log(req.user);

    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must login before creating listing")
        return res.redirect("/login")
      }
      next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
  console.log(req.user);

    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
       
      }
      next();
}