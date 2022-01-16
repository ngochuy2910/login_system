require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose')
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const {
    checkAuthenticated,
    checkNotAuthenticated,
  } = require("./middlewares/auth");

const initializePassport = require("./passport-config");
initializePassport(
  passport,
  async (name) => {
    const userFound = await User.findOne({ name });
    return userFound;
  },
  async (id) => {
    const userFound = await User.findOne({ _id: id });
    return userFound;
  }
);

app = express() ; 
app.set('view engine' , 'ejs') ;
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
// set static files:
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'))

// routes 


app.get('/login', checkNotAuthenticated,(req,res) => {
    res.render('login.ejs')
})

app.get('/test',(req,res) => {
  res.render('test.ejs')
})

app.post(
    "/login",
    checkNotAuthenticated,
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );
  
app.use('/',checkAuthenticated, function(req,res){
    res.render('home.ejs')
})

// kết nối mongodb: 
mongoose
    .connect('mongodb://localhost:27017/auth',{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(
        function () {
            // Connect server khi ket noi dc mongodb
            app.listen(3000, function (req,res) {
                console.log("Successful to connect server at port 3000")
            })
        }
    )
    

