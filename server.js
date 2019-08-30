var express = require('express')
var path = require('path')
var app = express()
var ejs = require('ejs')
var session = require('express-session')
var nodemailer = require('nodemailer');
var multer = require('multer');
var passport = require('passport')
var GitHubStrategy = require('passport-github').Strategy;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/uploadimages')));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session({
  secret: "AaolooBukhara",
  resave: false,
  saveUnintialized: true,
}))

app.use(function (req, res, next) {
  next()
})

var mongoose = require('mongoose');
var schema = mongoose.Schema;
var admindb = 'mongodb://localhost/cq';

mongoose.connect(admindb);

mongoose.connection.on('error',(err) => {
  console.log('DB connection Error');
})

mongoose.connection.on('connected',(err) => {
   useNewUrlParser: true;
  console.log('DB connected');
})

var productSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    gender: String,
    city: String,
    phone: String,
    role: String,
    dob : String,
    status : String,
    state: String,
    interests: String,
    journey: String,
    expectations: String,
    photoname: {type : String, default:"/dp.png"},
    githubid : String,
    switch: String,
    req : [{ type: schema.Types.ObjectId, ref: 'comms' }],            // communities requested for
    join : [{ type: schema.Types.ObjectId, ref: 'comms' }],				// communities joined
    owned : [{ type: schema.Types.ObjectId, ref: 'comms' }],			// communities owned after promoting
    manager : [{ type: schema.Types.ObjectId, ref: 'comms' }],           // communities manager not ownner
    invitations : [{ type: schema.Types.ObjectId, ref: 'comms' }],     // communities invitations recieved
})

var tagSchema = new mongoose.Schema({
    tagname: String,
    tagcreator: String,
    tagdate: String,
    tagflag: String,
})

var communitySchema = new mongoose.Schema({
    communityname : String,
    communitylocation : { type :  String , default : 'Not Added' },
    communitymembershiprule : String,
    communityowner : String,
    communityownerid : { type: schema.Types.ObjectId, ref: 'admins' },
    communitycreatedate : String,
    communitydescription : String,
    communityimage : { type : String , default : '/defaultCommunity.jpg' },
    communityconfirm : { type : String , default : 'Not Active' },
    communityrequest : [{ type: schema.Types.ObjectId, ref: 'admins' }],
    communitymember : [{ type: schema.Types.ObjectId, ref: 'admins' }],
    communitymanager : [{ type: schema.Types.ObjectId, ref: 'admins' }],
    invitations : [{ type: schema.Types.ObjectId, ref: 'admins' }],
    communitydiscussion : { type : Array , default : [] },
})

var product = mongoose.model('admins', productSchema);
var tag = mongoose.model('tags', tagSchema);
var community = mongoose.model('comms',communitySchema);

var GitHubStrategy = require('passport-github').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user,done){
    done(null,user);
});

passport.deserializeUser(function(user,done){
    done(null,user);
});

passport.use(
      new GitHubStrategy({
      clientID: '0117f081ee15ca623960',
      clientSecret: '0764b1d8e8c79b263e303d9b30be42bb8024fd92',
      callbackURL: "/auth/github/callback",
      session:true
      },function(accessToken, refreshToken, profile, cb) {
          return cb(null,profile);
      })
  );

app.get('/auth/github',passport.authenticate('github'));

app.get('/auth/github/callback',passport.authenticate('github', { failureRedirect: 'login.html' }), function (req, res)
  {
      product.find({
        githubid : req.session.passport.user._json.id
      })
      .then(data =>
      {
        if(data.length>0)
        {
          req.session.islogin = 1;
          var obj = Object();
          obj.isLogin = 1;
          obj.username = data[0].username ;
          obj.city=data[0].city;
          obj.role=data[0].role;
          obj.name=data[0].name;
          obj.status=data[0].status;
          obj.state=data[0].state;
          obj.githubid = data[0].githubid;
          obj.photoname= data[0].photoname;
          if(data[0].gender)
          {
            obj.gender = data[0].gender;
            obj.phone = data[0].phone;
            obj.dob = data[0].dob;
          }
          obj._id=data[0]._id;
          req.session.data=obj;
          res.redirect('/home');
        }
        else
        {
          var obj = {
          name : req.session.passport.user._json.name,
          username : req.session.passport.user._json.email,
          city : req.session.passport.user._json.location,
          status : "pending",
          role : "user",
          githubid : req.session.passport.user._json.id,
          photoname : "dp.png",
          state : "active",
          }
          product.create(obj,function(error,result)
          {
            if(error)
            throw error;
            else {
              req.session.data = obj;
              product.find({
                  githubid : req.session.passport.user._json.id
              })
              .then(data =>
              {
                req.session.data._id = data[0]._id;
              })
              .catch(err =>
              {
                throw err;
              })
              res.redirect('/home');
            }
          })
        }
      })
      .catch(err =>
      {
        res.send(err)
      })
  })

  app.get('/',function(req,res)
  {
      res.render('login');
  })

app.post('/login',function (req,res)
{
    product.find({
      username: req.body.username,
      password: req.body.password
    })
    .then(data =>
      {
        if(data.length>0)
        {
             if(req.session.isLogin)
             {
               res.render(home);
             }
             else
             {
               if(data[0].state =="notactive")
               {
                 res.send("0000");
               }
               else
               {
                 req.session.isLogin = 1;
                 var obj = Object();
                 obj = data[0]
                 req.session.data = obj;
                 // obj.isLogin = 1;
                 // obj.username = data[0].username ;
                 // obj.password = data[0].password;
                 // obj.dob = data[0].dob;
                 // obj.city=data[0].city;
                 // obj.gender=data[0].gender;
                 // obj.phone=data[0].phone;
                 // obj.role=data[0].role;
                 // obj.name=data[0].name;
                 // obj.status=data[0].status;
                 // obj.state=data[0].state;
                 // obj._id=data[0]._id;
                 // obj.switch = data[0].switch;
                 // obj.photoname = data[0].photoname;
                 // console.log(obj);
                 // req.session.data = obj;
                 res.send(data)
               }
        }
      }
        else
        {
          res.send("0");
        }
    })
    .catch(err => {
      res.send(err)
    })
})

app.get('/notactive',logger,function(req,res)
{
    res.render('notactive');
})

app.get('/home',logger,function(req,res)
{
    if(req.session.data.status == 'pending')
    {
      res.render('updatefirst',{obj : req.session.data})
    }
    else
    {
        if(req.session.data.role=='admin')
        {
           if(req.session.data.switch=='user') {
             res.redirect('/community/communitypanel');
           }
           else {
            res.render('profile',{obj : req.session.data});
          }
        }
        else if(req.session.data.role=='communitybuilder')
        {
          res.redirect('/community/communitypanel');
        }
        else if(req.session.data.role=='user') {
          res.render('userprofile',{obj : req.session.data});
        }
        else {
          res.send("404 Not Found");
        }
    }
})

app.get('/profile',logger,function(req,res)
{
    if(req.session.data.role=='admin')
    {
      if(req.session.data.switch=='admin')
      {
        res.render('profile',{ obj : req.session.data });
      }
      else {
          res.render('switcheditpage',{obj : req.session.data})
      }
    }
    else if(req.session.data.role=='communitybuilder') {
      res.render('buildereditpage',{ obj : req.session.data })
    }
    else {
      res.render('userprofile',{ obj : req.session.data })
    }
})

app.get('/editpage',logger,function(req,res)
{

  if(req.session.data.switch=="admin")
    res.render('editpage', { obj : req.session.data });
    else {
      res.render('switcheditpage', { obj : req.session.data });
    }
})

app.get('/editinfo',logger,function(req,res)
{
  if(req.session.data.role=='admin')
  {
       if(req.session.data.switch=="admin")
       res.render('editinfo' , { obj : req.session.data } );
       else {
        res.render('switcheditinfo' , { obj : req.session.data } );
      }
  }
  else if(req.session.data.role=='communitybuilder')
  {
    res.render('buildereditinfo', { obj : req.session.data });
  }
  else {
    res.render('usereditinfo' , { obj : req.session.data } );
  }
})

app.get('/adduser',logger,logger2,function(req,res)
{
    res.render('adduser',{obj : req.session.data});
})

app.post('/adduser',function(req,res)
{
    var obj = req.body;
    obj.status='pending'
    product.create(obj,function(error,result)
    {
        if(error)
        throw err;
        else
        {
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'hack7jack@gmail.com',
                pass: ''
              }
            });

            var mailOptions = {
              from: 'hack7jack@gmail.com',
              to: req.body.username,
              subject: 'Welcome To CQ',
              text: "Your Username is: " + req.body.username + "\n" + " Password is: " + req.body.password + "Hope your Journey goes smooth"
            };

            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.res);
              }
            });
        }
    })
    res.render('profile',{obj : req.session.data});
  })

function sendmail(obj)
{
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hack7jack@gmail.com',
        pass: ''
      }
    });

    var mailOptions = {
      from: 'hack7jack@gmail.com',
      to: obj.username,
      subject: obj.subject,
      html: obj.text
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.res);
      }
    });
}

app.get('/changepassword',logger,function(req,res)
{
  if(req.session.data.role=='admin')
  {
     if(req.session.data.switch=="admin")
      res.render('changepassword',{obj : req.session.data});
       else {
         res.render('switchchangepassword',{obj : req.session.data});
       }
  }
  else if(req.session.data.role=='communitybuilder')
  {
    res.render('builderchangepassword',{ obj : req.session.data });
  }
    else {
      res.render('userchangepassword',{obj : req.session.data});
    }

})

app.post('/changepassword',function (req,res)
{
      password = req.body;
      if(password.old_password!=req.session.data.password)
      res.send("0")
      else
      {
          product.updateOne( { "_id" : req.session.data._id } , { $set: { "password" : password.new_password } } , function(error,result)
          {
              if(error)
              throw error;
              else
                req.session.data.password = password.new_password;
          })
            res.send("1")
      }
})

app.get('/userslist',logger,logger2,function(req,res)
{
    res.render('userslist',{obj : req.session.data});
})

app.get('/communitylist',logger,logger2,function(req,res)
{
    res.render('communitylist',{ obj: req.session.data });
})

app.post('/sendmail',function(req,res)
{
  sendmail(req.body);
  res.end();
})

app.post('/ul',function (req, res) {
var count;

if(req.body.order[0].column==0)
{
  if(req.body.order[0].dir=="asc")
  getdata("username",1);
  else
  getdata("username",-1);
}
else if(req.body.order[0].column==1)
{
  if(req.body.order[0].dir=="asc")
  getdata("phone",1);
  else
  getdata("phone",-1);
}
else if(req.body.order[0].column==2)
{
  if(req.body.order[0].dir=="asc")
  getdata("city",1);
  else
  getdata("city",-1);
}
else if(req.body.order[0].column==3)
{
  if(req.body.order[0].dir=="asc")
  getdata("status",1);
  else
  getdata("status",-1);
}
else if(req.body.order[0].column==4)
{
  if(req.body.order[0].dir=="asc")
  getdata("role",1);
  else
  getdata("role",-1);
}

else {
  getdata("username",1);
}


function getdata(colname,sortorder)
{
    product.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);
      var role=req.body.role;
      var status=req.body.status;
      var search=req.body.search.value;
      var getcount=10;

    var findobj={};
      console.log(role,status);
      if(role!="all")
         { findobj.role=role;
         }
      else{
          delete findobj["role"];
      }
      if(status!="all")
          {findobj.status=status;}
      else{
          delete findobj["status"];
      }
      if(search!='')
          findobj["$or"]= [{
          "username":  { '$regex' : search, '$options' : 'i' }
      }, {
          "phone":{ '$regex' : search, '$options' : 'i' }
      },{
          "city": { '$regex' : search, '$options' : 'i' }
      }
      ,{
          "status":  { '$regex' : search, '$options' : 'i' }
      }
      ,{
          "role": { '$regex' : search, '$options' : 'i' }
      }]
      else{
          delete findobj["$or"];
      }

      product.find(findobj).countDocuments(function(e,coun){
      getcount=coun;
    }).catch(err => {
      console.error(err)
      res.send(error);
    })

      product.find(findobj).skip(start).limit(len).sort({[colname] : sortorder})
      .then(data => {
          res.send({"recordsTotal" : count,"recordsFiltered" :getcount,data})
        })
        .catch(err => {
          console.error(err)
        })
    });
  }
});

app.post('/cl',function (req, res) {
  var count;

  if(req.body.order[0].column==0)
  {
    if(req.body.order[0].dir=="asc")
    getdata("communityname",1);
    else
    getdata("communityname",-1);
  }
  else if(req.body.order[0].column==1)
  {
    if(req.body.order[0].dir=="asc")
    getdata("communitymembershiprule",1);
    else
    getdata("communitymembershiprule",-1);
  }
  else if(req.body.order[0].column==2)
  {
    if(req.body.order[0].dir=="asc")
    getdata("communitylocation",1);
    else
    getdata("communitylocation",-1);
  }
  else if(req.body.order[0].column==3)
  {
    if(req.body.order[0].dir=="asc")
    getdata("communityowner",1);
    else
    getdata("communityowner",-1);
  }
  else if(req.body.order[0].column==4)
  {
    if(req.body.order[0].dir=="asc")
    getdata("communitycreatedate",1);
    else
    getdata("communitycreatedate",-1);
  }

  else {
    getdata("communityname",1);
  }


  function getdata(colname,sortorder)
  {
      community.countDocuments(function(e,count){
        var start=parseInt(req.body.start);
        var len=parseInt(req.body.length);
        var mrule=req.body.communitymembershiprule;
        var search=req.body.search.value;
        var getcount=10;

      	var findobj={};
        if(mrule!="all")
           { findobj.communitymembershiprule=mrule;}
        else{
            delete findobj["communitymembershiprule"];
        }
        if(search!='')
            findobj["$or"] = [{
            "communityname":  { '$regex' : search, '$options' : 'i' }
        }, {
            "communitymembershiprule":{ '$regex' : search, '$options' : 'i' }
        },{
            "communitylocation": { '$regex' : search, '$options' : 'i' }
        }
        ,{
            "communityowner":  { '$regex' : search, '$options' : 'i' }
        },
        ,{
            "communitycreatedate": { '$regex' : search, '$options' : 'i' }
        }]
        else
          delete findobj["$or"];

        community.find(findobj).countDocuments(function(e,coun){
        getcount=coun;
      }).catch(err => {
        console.error(err)
        res.send(error)
      })
        community.find(findobj).skip(start).limit(len).sort({[colname] : sortorder})
        .then(data => {
            res.send({"recordsTotal" : count,"recordsFiltered" :getcount,data})
          })
          .catch(err => {
            console.error(err)
          })
        })
      }
    });

app.post('/tl',function(req,res)
{
  let count;

  if(req.body.order[0].column==0)
  {
    if(req.body.order[0].dir=="asc")
    getdata("tagname",1);
    else
    getdata("tagname",-1);
  }
  else if(req.body.order[0].column==1)
  {
    if(req.body.order[0].dir=="asc")
    getdata("tagcreator",1);
    else
    getdata("tagcreator",-1);
  }
  else if(req.body.order[0].column==2)
  {
    if(req.body.order[0].dir=="asc")
    getdata("tagdate",1);
    else
    getdata("tagdate",-1);
  }
  else {
    getdata("tagname",1);
  }

  function getdata(colname,sortorder)
  {
      tag.countDocuments(function(e,count){
        let start=parseInt(req.body.start);
        let len=parseInt(req.body.length);
        let search=req.body.search.value;
        let getcount=10;

      var findobj = {
         tagflag : "1",
      };

        if(search!='')
            findobj["$or"]= [{
            "tagname":  { '$regex' : search, '$options' : 'i' }
        }, {
            "tagcreator":{ '$regex' : search, '$options' : 'i' }
        },{
            "tagdate": { '$regex' : search, '$options' : 'i' }
        }]
        else {
            delete findobj["$or"];
        }

       tag.find(findobj).countDocuments(function(e,coun){
        getcount=coun;
      }).catch(err => {
        console.error(err)
        res.send(error)
      })

        tag.find(findobj).skip(start).limit(len).sort({[colname] : sortorder})
        .then(data => {
            res.send({"recordsTotal" : count,"recordsFiltered" :getcount,data})
          })
          .catch(err => {
            console.error(err);
          })
      });
    }
})

var photoname ;

var storage = multer.diskStorage({
  destination : './public/uploadimages/',
  filename : function(req, file, callback)
  {
    photoname='/' + file.fieldname + '-' + Date.now() + '@' +path.extname(file.originalname)
    callback(null,photoname);
  }
})

var upload = multer({
  storage : storage,
  // limits : {
  //   fileSize : 100000
  // }
}).single('myImage');

app.post('/upload',(req,res) => {
  console.log("req body mein "+req.body);
  upload(req,res,(err)=>{
    if(err)
    {
      throw err;
    }
    else{
      console.log(req.file);
      console.log(photoname);
      console.log(req.session.data._id);

      product.updateOne({ "_id" : req.session.data._id } , { $set : { "photoname" : photoname } }  ,function(error,result)
      {
          console.log(result);
          if(error)
          {
            console.log("error vale mai");
            throw error;
          }
          else
          {
            console.log("update vale mai");
            req.session.data.photoname = photoname;
            if(req.session.data.status == "pending")
            res.render('updatefirst' , { obj : req.session.data } );
            else
            {
                if(req.session.data.role=='admin')
                {
                    // if(req.session.data.switch=="admin")
                    res.render('editinfo' , { obj : req.session.data } );
                    // else {
                    //   res.render('switcheditinfo' , { obj : req.session.data } );
                    // }
                }
                else {
                    res.render('usereditinfo' , { obj : req.session.data } );
                }
            }
          }
      })
    }
  })
});

app.post('/updateuser',function(req,res)
{
  console.log(req.body);
  product.updateOne({"_id":req.body._id},{ $set : req.body} ,function(error,result)
  {
    if(error)
    throw error
    else
    {
      res.send("DATA UPDATED SUCCESFULLY")
    }
  })
})

app.get('/tagpanel',logger,logger2,function(req,res)
{
  res.render('tagpanel',{obj : req.session.data})
})

app.post('/addtag',function(req,res)
{
  tag.create(req.body,function(error,result)
  {
    if(error)
    throw error;
    else
    {
      res.end();
    }
  })
})

app.post('/deleteTag',function(req,res)
{
  tag.updateOne({ "_id" : req.body._id },{ $set : { tagflag : "0" } },function(error,result)
  {
    if(error)
    throw error;
    else {
      console.log(result);
      res.end();
    }
  })
})

app.get('/showtaglist',logger,logger2,function(req,res)
{
  res.render('showtaglist',{obj : req.session.data})
})

// app.post('/deletetag',function(req,res)
// {
//   tag.deleteOne({ "_id": req.body}, function(err,result)
//   {
//     if(err)
//     throw err;
//     else
//     {
//       console.log("deleted");
//       res.end();
//     }
//   })
// })

app.post('/edituserinfo',function(req,res)
{
    var obj = req.body;
    console.log(req.session.data._id);
    product.updateOne({ "_id" : req.session.data._id } , { $set : { "name" : obj.name , "dob" : obj.dob , "gender" : obj.gender , "phone" : obj.phone , "city" : obj.city , "status" : "confirmed" , "interests" : obj.interests , "journey" : obj.journey , "expectations" : obj.expectations  } }  ,function(error,result)
    {
      if(error)
      throw error
      else
      {
        req.session.data.name = obj.name
        req.session.data.dob = obj.dob
        req.session.data.gender = obj.gender
        req.session.data.phone = obj.phone
        req.session.data.city = obj.city
        req.session.data.status = "confirmed"
        if(req.session.data.role=='admin')
        {
          if(req.session.data.switch=="admin")
             res.render('editpage', { obj : req.session.data });
             else {
               res.render('switcheditpage', { obj : req.session.data });
             }
        }
        else if(req.session.data.role == 'communitybuilder')
        {
            res.render('buildereditpage',{ obj : req.session.data });
        }
        else {
          res.render('userprofile', { obj : req.session.data });
        }
      }
    })
})

app.get('/changeswitch',logger,logger2,function(req,res)
{
    req.session.data.switch = 'admin'
    product.updateOne({ "_id" : req.session.data._id } , { $set : { "switch" : "admin" } } ,function(error,result)
    {
      if(error)
      throw error;
      else
      res.render('profile' , { obj: req.session.data })
    })
})

app.get('/switchcommunityhome',logger,logger2,function(req,res)
{
  // if(req.session.data.role!='communitybuilder')
  // {
  if(req.session.data.switch == 'admin')
  {
    req.session.data.switch = 'user'
    product.updateOne({ "_id" : req.session.data._id } , { $set : { "switch" : "user" } } ,function(error,result)
    {
      if(error)
      throw error;
      else
      {
          // res.render('switchcommunityhome' , { obj: req.session.data })
          res.redirect('/community/communitypanel');
      }
    })
  }
  else {
    req.session.data.switch = 'admin'
    product.updateOne({ "_id" : req.session.data._id } , { $set : { "switch" : "admin" } } ,function(error,result)
    {
      if(error)
      throw error;
      else
      {
          // res.render('switchcommunityhome' , { obj: req.session.data })
          res.redirect('/home');
      }
    })
  }
//   }
// else
// res.render('communitybuilder' , { obj: req.session.data })
})

app.get('/community/switchcreatecommunity',logger,function(req,res)
{
  if(req.session.data.role=='admin')
  res.render('switchcreatecommunity',{ obj : req.session.data })
  else {
    res.render('communitycreate',{ obj:req.session.data });
  }
})

app.post('/createcommunity',function(req,res)
{
  if(!req.body.communityname)
  {
    // console.log("fghjkjhghjjkhjgh");
    res.send("no dataa");
  }
  else {
    console.log(req.body);
    // res.render('switchcreatecommunity',{ obj : req.session.data });
    if(req.body.myImage)
    {
      console.log("photo haiiiiiiii");
       upload(req,res,(err)=>
       {
         if(err)
         throw err;
         else {
           console.log(photoname);
           req.body.communityimage = photoname;
           console.log("photo   pdgi");
             createcommunity(req)
         }
       })
      // createcommunity(req)
    }
    else 
    {
      // res.send("creating commuity");
      createcommunity(req)
      if(req.session.data == 'admin')
      res.render('switchcreatecommunity',{ obj : req.session.data });
      else {
        res.render('communitycreate',{ obj : req.session.data });
      }
    }
  }
})

function createcommunity(req)
{

    var cid;
    var obj = req.body;
    console.log(obj);
    var today = new Date()
    var dd = today.getDate();
    var mm = getMonths(today.getMonth());
    var yyyy = today.getFullYear();
    obj.communitycreatedate = dd + "-" + mm + "-" + yyyy
    obj.communityowner = req.session.data.name;
    obj.communityownerid = req.session.data._id;
    // obj.communitylocation = "Not Added"
    community.create(obj,function(err,result)
    {
        if(err)
        throw err;
        else {
        //  cid = result._id;
          product.updateOne(  { "_id" : req.session.data._id } , { $push : { owned : result._id } } , function(err,result)
          {
              if(err)
              throw err;
              else {
                console.log(result);
              }
          })
        }
    })
}

function getMonths(monthno)
{
  var month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return month[monthno];
}

function getTime()
{
  var time = new Date()
  var min = time.getMinutes();
  var hrs = time.getHours();
  var format ;
  if(hrs>12)
  {
    hrs = 24-hrs;
    format = 'PM';
  }
  else {
    format = 'AM';
  }
  time = hrs + ':' + min + ' ' + format ;
  console.log(time);
  return time;
}

app.get('/ownedCommunities',logger,function(req,res)
{
    community.find( { $or : [{ communityownerid : req.session.data._id },{ communitymember : { $in : [req.session.data._id] } },{ communitymanager : { $in : [req.session.data._id] } },{ communityrequest : { $in : [req.session.data._id] } }] } ).exec(function(error,result) {
     {
        if(error)
        throw error;
        else {
          res.send(result);
        }
      }
    })
})

// comminstance.find({ $and: [{ ownerid : { $not : { $eq : req.session.data._id }}},{commjoin : {$nin : [req.session.data._id] }},{commasktojoin : {$nin : [req.session.data._id] }}] }).exec(function(error,result){
//     if(error)
//     throw error;
//     else {
//         res.send(JSON.stringify(result));
//     }
// })

app.post('/updateCommunity',function(req,res)
{
    community.updateOne( { "_id" : req.body._id } , {  $set : req.body }, function(err,result)
    {
      if(err)
      throw err;
      else {
        res.end();
      }
    })
})

app.post('/community/editcommunity/:pro',function(req,res)
{
  // console.log("req body mein "+req.body);
  upload(req,res,(err)=>{
    if(err)
    {
      throw err;
    }
    else
    {
      console.log(req.file);
      console.log(photoname);
      // console.log(req.session.data._id);

      community.updateOne({ "_id" : req.params.pro }, { $set : { "communityimage" : photoname } },function(error,result)
      {
          if(error)
          throw error;
          else {
            console.log("updated");
            res.redirect('/community/editcommunity/'+req.params.pro+'');
            // res.send("DONE");
          }
      })
    }
  })
})

app.post('/freeCommunities',function(req,res)
{
  console.log(req.body);
  let start = req.body.start;
  let end = req.body.end;
  // console.log("------------"+start,end);
  let findobj = { $and : [{ communityownerid : { $not : { $eq : req.session.data._id } } },{ communitymember : { $nin : [req.session.data._id] } },{ communityrequest : { $nin : [req.session.data._id] } }] };
  community.find( findobj ).skip(start).limit(end).exec(function(error,result) {
    {
      if(error)
      throw error;
      else {
        console.log(result);
        res.send(result);
      }
    }
  })
})

app.post('/djoin',function(req,res)
{
  product.updateOne( { "_id" : req.session.data._id } , { $push : { join : req.body._id } } , function(error,result)
  {
      if(error)
      throw error;
      else {
        community.updateOne( { "_id" : req.body._id } , { $push : { communitymember : req.session.data._id } } , function(error,result)
        {
          if(error)
          throw error;
          else {
            console.log("hogyajbkbkjjkbkbkj");
            res.end();
          }
        })
      }
  })
})

app.post('/pjoin',function(req,res)
{
    product.updateOne( { "_id" : req.session.data._id } , { $push : { req : req.body._id } } , function(error,result)
    {
        if(error)
        throw error;
        else {
          community.updateOne( { "_id" : req.body._id } , { $push : { communityrequest : req.session.data._id } } , function(error,result)
          {
            if(error)
            throw error;
            else {
              console.log("hogyajbkbkjjkbkbkj");
              res.end();
            }
          })
        }
    })
})

app.post('/cancelRequest',function(req,res)
{
    console.log("aagya");
    community.updateOne({ "_id" : req.body._id },{ $pull : { communityrequest : { $in : [req.session.data._id]}}} ,function(error,result){
     if(error)
     throw error;
     else {
         product.updateOne({ "_id" : req.session.data._id },{ $pull : { req : { $in : [req.body._id] } } }, function(error,result){
           if(error)
           throw error;
           else {
             res.end();
           }
         })
       }
    })
})

app.post('/getMembers',function(req,res)
{
    var query = [{path : 'communityownerid' , select : { 'name' : 1 , 'photoname' : 1 } },{path : 'communitymember' , select : { 'name' : 1 , 'photoname' : 1 } },{ path : 'communityrequest' , select : { 'name' : 1 , 'photoname' : 1 } },{ path : 'invitations' , select : { 'name' : 1 , 'photoname' : 1 } },{ path : 'communitymanager' , select : { 'name' : 1 , 'photoname' : 1 } } ];
    community.findOne({ "_id" : req.body._id }).populate( query ).exec(function (err, person) {
    if (err) throw err;
    // console.log(person);
    res.send(person);
  });
});

app.get('/community/communitypanel',logger,function(req,res)
{
    // console.log("/community/communitypanel");
    if(req.session.data.role=='admin')
    {
      res.render('switchcommunityhome',{ obj : req.session.data });
    }
    else if(req.session.data.role=='communitybuilder')
    {
      res.render('buildercommunity',{ obj : req.session.data });
    }
    else {
      res.render('usercommunity',{ obj : req.session.data });
    }
    res.end();
})

app.post('/acceptRequest',function(req,res)
{
  console.log(req.body);
  community.updateOne( { "_id" : req.body.commid } , {  $push : { communitymember : req.body.userid } , $pull : { communityrequest : { $in : [req.body.userid] } }  },function(err,result)
  {
      if(err)
      throw err;
      else {
        product.updateOne( { "_id" : req.body.userid } , {  $push : { join : req.body.commid } , $pull : { req : { $in : [req.body.commid] } }  },function(err,result)
        {
          if(err)
          throw err;
          else {
            res.send("DONE");
          }
        })
      }
  })
})

app.post('/rejectRequest',function(req,res)
{
  console.log(req.body);
  community.updateOne( { "_id" : req.body.commid } , { $pull : { communityrequest : { $in : [req.body.userid] } }  },function(err,result)
  {
      if(err)
      throw err;
      else {
        product.updateOne( { "_id" : req.body.userid } , { $pull : { req : { $in : [req.body.commid] } }  },function(err,result)
        {
          if(err)
          throw err;
          else {
            res.send("DONE");
          }
        })
      }
  })
})

app.post('/removeUser',function(req,res)
{
  community.updateOne( { "_id" : req.body.commid } , { $pull : { communitymember : { $in : [req.body.userid] } } , $pull : { communitymanager : { $in : [req.body.userid] } } },function(err,result)
  {
      if(err)
      throw err;
      else {
        product.updateOne( { "_id" : req.body.userid } , { $pull : { join : { $in : [req.body.commid] } } ,  $pull : { manager : { $in : [req.body.commid] } } },function(err,result)
        {
          if(err)
          throw err;
          else {
            res.send("DONE");
          }
        })
      }
  })
})

// app.post('/promoteUser',function(req,res)
// {
//   community.updateOne( { "_id" : req.body.commid } , {  $push : { communitymanager : req.body.userid } , $pull : { communitymember : { $in : [req.body.userid] } }  },function(err,result)
//   {
//       if(err)
//       throw err;
//       else {
//         product.updateOne( { "_id" : req.body.userid } , {  $push : { manager : req.body.commid } , $pull : { join : { $in : [req.body.commid] } }  },function(err,result)
//         {
//           if(err)
//           throw err;
//           else {
//             res.send("DONE");
//           }
//         })
//       }
//   })
// })

// app.post('/getObj',function(req,res)
// {
//   res.send(req.session.data);
// })

// app.post('/demoteUser',function(req,res)
// {
//   community.updateOne( { "_id" : req.body.commid } , {  $push : { communitymember : req.body.userid } , $pull : { communitymanager : { $in : [req.body.userid] } }  },function(err,result)
//   {
//       if(err)
//       throw err;
//       else {
//         product.updateOne( { "_id" : req.body.userid } , {  $push : { join : req.body.commid } , $pull : { manager : { $in : [req.body.commid] } }  },function(err,result)
//         {
//           if(err)
//           throw err;
//           else {
//             res.send("DONE");
//           }
//         })
//       }
//   })
// })

app.get('/community/list',logger,function(req,res)
{
    if(req.session.data.role=='admin')
    {
      res.render('switchcommunitysearch',{ obj : req.session.data })
    }
    else {
      res.render('buildercommunitysearch',{ obj : req.session.data });
    }
})

app.get('/community/communityprofile/:pro',logger,function(req,res)
{
    var id = req.params.pro;
    console.log(id);
    var query = [{path : 'communityownerid' , select : { 'name' : 1 , 'photoname' : 1 } },{path : 'communitymember' , select : { 'name' : 1 , 'photoname' : 1 } },{ path : 'communitymanager' , select : { 'name' : 1 , 'photoname' : 1 } } ];
    community.findOne({ "_id" : id }).populate( query ).exec(function (err, person) {
        if (err) throw err;
        console.log(person);
        res.render('switchcommunityprofile',{ obj: req.session.data, commobj: person });
    });
})

app.get('/community/manageCommunity/:pro',logger,function(req,res)
{
  var id=req.params.pro;
    community.findOne( { "_id" : id },function(err,result)
    {
        if(err)
        throw err;
        else {
          if(req.session.data.role == 'admin')
          {
            res.render('switchmanageCommunity',{ obj : req.session.data, commobj : result });
          }
          else {
              res.render('buildermanageCommunity',{ obj : req.session.data, commobj : result });
          }
        }
    })
})

app.get('/community/discussions/:pro',logger,function(req,res)
{
    var id = req.params.pro;
    community.findOne( { "_id" : id  },function(err,result)
    {
      if(err)
      throw err;
      else {
        if(req.session.data.role == 'admin')
        {
          res.render('switchcommunitydiscussions',{ obj : req.session.data, commobj : result });
        }
        else {
            res.render('builderdiscussions',{ obj : req.session.data, commobj : result });
        }
      }
    })
})

app.get('/community/communitymembers/:pro',logger,function(req,res)
{
  community.findOne( { "_id" : req.params.pro  },function(err,result)
  {
    if(err)
    throw err;
    else {
      if(req.session.data.role == 'admin')
      {
        res.render('switchcommunitymembers',{ obj : req.session.data, commobj : result });
      }
      else {
          res.render('buildercommunitymembers',{ obj : req.session.data, commobj : result });
      }
    }
  })
})

app.get('/community/editcommunity/:pro',logger,function(req,res)
{
  community.findOne( { "_id" : req.params.pro  },function(err,result)
  {
    if(err)
    throw err;
    else {
      if(req.session.data.role == 'admin')
      {
        res.render('switcheditCommunity',{ obj : req.session.data, commobj : result });
      }
      else {
          res.render('buildereditCommunity',{ obj : req.session.data, commobj : result });
      }
    }
  })
})

app.post('/get',function(req,res)
{
    var query = [{path : 'communityownerid' , select : { 'name' : 1 , 'photoname' : 1 } },{path : 'communitymember' , select : { 'name' : 1 , 'photoname' : 1 } },{path : 'communitymanager' , select : { 'name' : 1 , 'photoname' : 1 } }];
    community.findOne({ "_id" : req.body._id }).populate( query ).exec(function (err, person) {
    if (err) throw err;
    res.send(person);
  });
});

app.post('/createDiscussion/:pro',function(req,res)
{
  var id = req.params.pro;
  var time = getTime();
  community.updateOne({"_id" : id},
  {
      $push : {
          communitydiscussion : {
                              "dtitle" : req.body.title,
                              "ddetail" : req.body.details,
                              "cname" : req.session.data.name,
                              "cid" : req.session.data._id,
                              "dday" : time,
                          }
      }
  },function(error,result)
  {
      if(error)
      throw error;
      else {
          res.send("DiSCUSSSION ENTERED");
      }

  })
})

app.post('/getDiscussion',function(req,res)
{
    community.findOne({ "_id" : req.body._id },function(err,result)
  {
    if(err)
    throw err;
    else {
      res.send(result);
    }
  })
})

app.get('/viewprofile/:pro',logger,function(req,res)
{
  var id = req.params.pro;
  product.findOne({ "_id" : id },function(error,result)
  {
      if(error)
      throw error;
      else {
        if(req.session.data.role=='admin')
        {
          res.render('switch_view_profile',{ obj : req.session.data , commo : result });
        }
        else {
          res.render('builder_view_profile',{ obj : req.session.data , commo : result });
        }
      }
  })
})

app.listen(3000,function()
{
      console.log("Running on port 3000");
});

app.get('/logout',function(req,res)
{
  req.session.isLogin = 0;
  req.session.destroy();
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.render('login');
})

//MIDDLEWARE FUNCTIONS
function logger(req,res,next)				//login vaala 
{
  if(req.session.isLogin)
  {
    next();
  }
  else {
      res.redirect('/');
  }
}
function logger2(req,res,next)				//Admin vaala
    {
      {
        next();
      }
      else {
          res.redirect('/');
      }
    }