const Listing = require("./models/listing.js")

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

module.exports.isOwner = async(req,res,next)=>{
  const { id } = req.params;
  let listing_id = await Listing.findById(id);
  if(!listing_id.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You don't have access to make changes")
    return res.redirect(`/listings/${id}`);
  }
  next();
}