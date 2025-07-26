const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const List = require("../modelss/listingg.js");
const { isLoggedIn, isOwner,validateListing ,validateReview}=require("../middleware.js");
const { index, renderNewForm, createListing, editRenderForm, updateListing, deleteListing } = require("../controllers/listing.js");
const multer=require('multer');
const { storage }= require("../cloudConfig.js");
const upload=multer({ storage });

router.route("/")
.get( wrapAsync(index))
.post(isLoggedIn,validateListing,upload.single('listing[image]'), wrapAsync(createListing));


//Form page for addition of new information
router.get("/new" ,isLoggedIn,renderNewForm);


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,editRenderForm);

// Update Route
router.put("/:id", isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, updateListing);


//Delete Route
router.delete("/:id",isLoggedIn,isOwner,deleteListing);

module.exports=router;

