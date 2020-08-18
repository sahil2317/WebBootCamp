var express = require("express");
var router= express.Router();
var Campground=require("../models/campground");
const campground = require("../models/campground");
var middleware = require("../middleware");

//Index -Show All Campgrounds
router.get("/",function(req,res){
    //Get all campgoround from DB
    Campground.find({},function(err,allCampgrounds){
     if(err){
       console.log(err);
     }
     else
     res.render("campgrounds/index",{campgrounds : allCampgrounds})
    });
  });


//To create form  in campground
  router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
   });
  
   
//Post route
  router.post("/",middleware.isLoggedIn,function(req,res){
    //get data from form and add to campgound array
      var name = req.body.name;
      var price= req.body.price;
      var image = req.body.image;
      var desc = req.body.description;
      var author ={
        id:req.user._id,
        username:req.user.username
      }
      var newCampground = {name:name,price:price,image:image,description:desc,author:author}
//create new campground and add it to Database
       Campground.create(newCampground,function(err,newlycreated){
         if(err){
           console.log(err);
         }
         else{
           res.redirect("/campgrounds");
         }
       });
    });

//Show  more info about one campground
    router.get("/:id",function(req,res){
      //find campground  with provided Id
      Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err){
         console.log("Erroe is show page");
       }
       else{
         //render show template with that campground
          res.render("campgrounds/show",{campground: foundCampground});
       }
      });
     });
     
     
//Edit Campground  Route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
  Campground.findById(req.params.id,function(err,foundCampground){
    
    res.render("campgrounds/edit",{campground:foundCampground});
  });
});

//Update  Campground Route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
      if(err){
        res.redirect("/campgrounds");
        console.log(err);
      }else{
         //rediect to show page
        res.redirect("/campgrounds/" +req.params.id);
      }
  });
   
});


//Destroy Campground Route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err){
     if(err){
      req.flash("error","Campground not deleted");
       res.redirect("/campgrounds");
       console.log(err);
     }else{
      req.flash("success","Campground Deleted");
       res.redirect("/campgrounds");
     }
  });
});
module.exports = router;