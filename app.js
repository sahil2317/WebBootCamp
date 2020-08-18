var express = require("express")
var app = express();
var Campground = require("./models/campground");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override"); 

var User = require("./models/user");
var Comment =require("./models/comment");
var seedDB = require("./seeds");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();  //seed database

var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

//Passport Configuration
app.use(require("express-session")({
  secret:"YelpCamp Secret",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//MongoDB Database Connection Setup
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/YelpCamp",{ useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false,useCreateIndex:true},(err)=>{
       if(!err){
           console.log("MongoDB connection success");
       }
       else{
           console.log("Error in DB connection" +err)
           }
   });
   
//To use isLoggedCurrent User Function
app.use(function(req,res,next){
res.locals.currentUser = req.user;
res.locals.error = req.flash("error");
res.locals.success = req.flash("success");

next();
});

//Requiring Routes
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);




//Server Call 
app.listen(3000,function(){
    console.log("YelpCamp Server is started");
});