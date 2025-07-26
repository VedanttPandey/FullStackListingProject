if(process.env.NODE_ENV!="production"){ 
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const List = require("./modelss/listingg.js");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate"); 
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const dbUrl=process.env.ATLASDB_URL;
const listing=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./modelss/user.js");
const userRouter=require("./routes/user.js");
const { showListing } = require("./controllers/listing.js");

main()
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Connection error:", err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24*3600,
});

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};
 

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use((req,res,next)=>{  
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

app.use("/listing",listing);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter); 
 
//show route for a partcular id
app.get("/listings/:id", wrapAsync (showListing));
app.get('/', (req, res) => {
  res.redirect('/listing'); // redirects to your working route
});

// Central error-handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { message }); 
});

app.listen(8080, () => {
  console.log("Welcome to the Airbnb Clone API");
});
