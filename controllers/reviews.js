const Review = require("../modelss/review.js"); 
const List = require("../modelss/listingg.js");
const _ = require("passport-local-mongoose");

module.exports.createReview=async(req, res) => {
  let listinggg = await List.findById(req.params.id);
  let newReview = new Review(req.body.review); 
  newReview.author=req.user._id;
  listinggg.reviews.push(newReview);
  await newReview.save();
  await listinggg.save();
  req.flash("success","New Review Created!");
  res.redirect(`/listings/${listinggg._id}`);
};

module.exports.deleteReview=async (req,res)=>{
  let { id,reviewId }=req.params;

  await List.findByIdAndUpdate(id,{ $pull: {review:reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted!");
  res.redirect(`/listing/${id}`);
};