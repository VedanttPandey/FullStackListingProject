const express=require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review = require("../modelss/review.js"); 
const List = require("../modelss/listingg.js");
const {validateReview,isLoggedIn ,isReviewAuthor}=require("../middleware.js");
const { createReview, deleteReview } = require("../controllers/reviews.js");


//Review Route
router.post("/",isLoggedIn,validateReview ,wrapAsync (createReview));
//Delete 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(deleteReview));


module.exports=router; 