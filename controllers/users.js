const User=require("../modelss/user.js");

module.exports.renderSignUpForm=(req,res)=>{
  res.render("users/signup.ejs");
}
module.exports.renderLoginForm=(req,res)=>{
  res.render("users/login.ejs");
}
module.exports.signup=async(req,res)=>{
  try{
 let {username,email,password}=req.body;
  const newUser=new User({email,username});
  const regUser=await User.register(newUser,password);
  req.login(regUser,(err)=>{
    if(err){
      return next(err);
    }
  req.flash("success","Welcome to Wanderlust!"); 
  res.redirect("/listing");
  });
  
  }
  catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
  }
}

module.exports.login=async (req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success","You are logged out now!");
    return res.redirect("/listing");
  });
};