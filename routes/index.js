var express = require("express");
var router= express.Router();
var passport = require("passport");
var User = require("../models/user");

//Main Home Page
router.get("/",function(req,res){
    res.render("landing");
  });

  //show registration form
router.get("/register",function(req,res){
    res.render("register");
 });
 //handle sign up logic
 router.post("/register",function(req,res){
   var newUser = new User({username:req.body.username});
   User.register(newUser,req.body.password,function(err,user){
      if(err){
        return res.render("register", {"error": err.message});
      }
      passport.authenticate("local")(req,res,function(){
        req.flash("success","Welcome to YelpCamp  " + user.username); 
         res.redirect("/campgrounds");
      });
   });
 });


 //login route 
 router.get("/login",function(req,res){
   res.render("login");
 });

//handle login logic
router.post("/login",passport.authenticate("local",
{    //middleware-app.post("postroute",middleware,callback)
       successRedirect:"/campgrounds",
       failureRedirect:"/login"
}),function(req,res){

});

//log out logic
router.get("/logout",function(req,res){
  req.logOut();
  req.flash("success","Logged You Out!!");
  res.redirect("/campgrounds");
});


module.exports = router;