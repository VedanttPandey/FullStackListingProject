const List=require("../modelss/listingg");
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req, res) => {
  const allListing = await List.find({});
  res.render("listings/index", { allListing });
};

module.exports.renderNewForm=(req,res)=>{
  res.render("listings/new");
};

module.exports.showListing=async(req, res) => {
  let { id } = req.params;
  const listing = await List.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  })
  .populate("owner");

  if(!listing){
   req.flash("error","Listing doesn't exists!");
   return res.redirect("/listing");
  }
  res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 2
  }).send();

  let url = req.file.path;
  let filename = req.file.filename;

  let newListing = new List(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();

  req.flash("success", "New Listing Created!");
  res.redirect("/listing"); // ✅ Only redirect once
};


module.exports.editRenderForm=async (req,res)=>{
  let { id } = req.params;
  const listing = await List.findById(id);
  if(!listing){
   req.flash("error","Listing doesn't exists!");
   return res.redirect("/listing");
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
  res.render("listings/edit",{listing,originalImageUrl});
};

module.exports.updateListing=async (req, res) => {
  let { id } = req.params;

  let listing=await List.findByIdAndUpdate(id, { ...req.body.listing });
  if(req.file){
  console.log("Uploaded file info:", req.file);
  let url=req.file.path;
  let filename=req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req,res)=>{
  let { id } = req.params;
  await List.findByIdAndDelete(id);
   req.flash("success","Listing Deleted!");
  res.redirect("/listing");
};