// Level 2 Security - Hidden ENV variables file to hold sensitive data
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// Level 2 Security - Mongoose Encryption with Secret String
// const encrypt = require('mongoose-encryption');
// Level 3 Security - Hashing MD5
// const md5 = require('md5');
// Level 4 Security - Salt + Hashing bcrypt
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// Level 5 Security - Cookies & Sessions via Passport
const session = require('express-session');
const passport = require('passport');
const passportLM = require('passport-local-mongoose');
// Level 6 Security - Google OAuth2.0 via Passport
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

// Level 5 Security - Cookies & Sessions via Passport
app.use(session({
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB_CONNECT,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.set("useCreateIndex",true);

const userSchema = new mongoose.Schema({
  email:String,
  password:String,
  googleId:String,
  secret:String
});
// Level 5 Security - Cookies & Sessions via Passport
userSchema.plugin(passportLM);
// Level 6 Security - Google OAuth2.0 via Passport
userSchema.plugin(findOrCreate);

// Level 2 Security - Mongoose Encryption with Secret String
//const secret=process.env.SECRET;
//userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
// Level 5 Security - Cookies & Sessions via Passport
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// Level 6 Security - Google OAuth2.0 via Passport
passport.serializeUser(function(user,done){
  done(null,user.id);
});
passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    done(err,user);
  });
});
passport.use(new GoogleStrategy({
  clientID: process.env.CID_GOOGLE,
  clientSecret: process.env.CS_GOOGLE,
  callbackURL: "http://localhost:3000/auth/google/secrets"//,
  // userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb){
  User.findOrCreate({googleId: profile.id}, function(err,user){
    return cb(err,user);
  });
}
));

app.post("/register", function(req,res){
  // Level 1 Security - User Submitted Email and Password
  // Level 2 Security - Mongoose Encryption with Secret String - mongoose encrypts on save
  // const newUser = new User({
  //   email:req.body.username,
  //   password:req.body.password
  // });

  // Level 3 Security - Hashing MD5
  // const newUser = new User({
  //   email:req.body.username,
  //   password:md5(req.body.password)
  // });

  // Level 4 Security - Salt + Hashing bcrypt
  // bcrypt.hash(req.body.password, saltRounds, function(err, hash){
  //   const newUser = new User({
  //     email:req.body.username,
  //     password:hash
  //   });
  //
  //   newUser.save(function(err){
  //     if(err){
  //       console.log(err);
  //     }else{
  //       res.render("secrets");
  //     }
  //   });
  // });
  // Level 3 Security - Hashing MD5
  // newUser.save(function(err){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     res.render("secrets");
  //   }
  // });

  // Level 5 Security - Cookies & Sessions via Passport
  User.register({username:req.body.username}, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate("local")(req,res, function(){
        res.redirect("/secrets");
      })
    }
  })
});

app.post("/login", function(req,res){
  // Level 1 Security - User Submitted Email and Password
  // Level 2 Security - Mongoose Encryption with Secret String - mongoose decrypts on find
  // const username = req.body.username;
  //const password = req.body.password;

  // Level 3 Security - Hashing MD5
  // const password = md5(req.body.password);

  // User.findOne({email:username}, function(err, foundUser){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     if(foundUser){
  //       // Level 4 Security - Salt + Hashing bcrypt
  //       bcrypt.compare(password, foundUser.password, function(err, result){
  //         if(result===true){
  //           res.render("secrets");
  //         }
  //       });
  //       // Level 3 Security - Hashing MD5
  //       // {
  //       //   res.render("secrets");
  //       // }
  //     }
  //   }
  // });

  // Level 5 Security - Cookies & Sessions via Passport
  const user = new User({
    username:req.body.username,
    password:req.body.password
  });

  req.login(user, function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
      });
    }
  });
});

app.post("/submit", function(req,res){
  const submittedSecret = req.body.secret;
  User.findById(req.user.id, function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        foundUser.secret= submittedSecret;
        foundUser.save(function(){
          res.redirect("/secrets");
        });
      }
    }
  });
});

app.get("/", function(req,res){
  res.render("home");
});

app.get("/login", function(req,res){
  res.render("login");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.get("/secrets", function(req,res){
  User.find({"secret":{$ne:null}}, function(err,foundUsers){
    if(err){
      console.log(err);
    }else{
      if(foundUsers){
        res.render("secrets", {usersWithSecrets:foundUsers});
      }
    }
  });
});

app.get("/logout", function(req,res){
  req.logout();
  res.redirect("/");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
passport.authenticate("google",{failureRedirect:"/login"}),
function(req,res){
//Successful authentication
res.redirect('/secrets');
});

app.get("/submit", function(req,res){
  if(req.isAuthenticated()){
    res.render("submit");
  }else{
    res.redirect("/login");
  }
});

app.listen(process.env.PORT||3000, function(){
  console.log('Server started on port 3000, if local.');
});
