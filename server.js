let express = require('express');
let app = express();
let mongoose = require('mongoose');
var config = require('./config')
// let mail = require('mail')
var ObjectId = require('mongodb').ObjectId
const userFiles = './userFiles/';
const fs = require('fs');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const jwtKey = config.jwtKey
const jwtExpirySeconds = config.jwtExpirySeconds
const saltingRounds = config.saltingRounds
var hashedPW
var loginflg = "";

mongoose.connect(config.database.url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
let conn = mongoose.connection;
mongoose.Promise = global.Promise;

var nameSchema = new mongoose.Schema({
  userName: String,
  password: String,
  logInType: String,
  MobileNo: Number,
  emailId: String,
  fileName: String,
  address: [{
    doorNo: Number,
    street: String,
    area: String,
    landMark: String,
    district: String,
    state: String,
    pinCode: Number,
  }]
}, { versionKey: false });


//assigning schema to model
var User = mongoose.model("User", nameSchema);
var UserImage = mongoose.model("UserImage", nameSchema);

//hashing the password
const passWordHash = function (req, res, next) {
  let password = req.body.password
  if (password == undefined || password == null || password == "") {
    loginflg = "Login"
    password = req.params.password
  }
  if (password) {
    bcrypt.hash(password, saltingRounds, function (err, hash) {
      if (err) {
        console.log('Error hashing password for user', req.body.userName);
        next(err);
      } else {
        hashedPW = hash;
        next();
      }
    });
  }
}
//forgot password 
app.route('/ConfromPass').post(passWordHash,(req,res) =>{
  req.body.password = hashedPW;
  var values = {
    $set:
    {      password: req.body.password
     }
  }
  var myquery = { userName: req.body.userName };
  let err;
  conn.collection("users").updateOne(myquery, values, function (err, res) {
    if (err) throw err;
  })
  res.send({ "result": "success" });

  
})
//verify the token
const verifyToken = function (req, res, next) {
  console.log(req.params.screenMode);
  console.log('keyvalue', req.headers.authorization)
  const authorizationHeaader = req.headers.authorization;
  let screenMode = req.params.screenMode
  var token;
  if (screenMode != "Add") {
    if (authorizationHeaader) {
      token = req.headers.authorization.split(' ')[1]; // Bearer <token>
    }
    if (!token) {
      return res.status(401).send("Token is not there")
    }
    var payload
    try {
      payload = jwt.verify(token, jwtKey)
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return res.status(401).send(e)
      }
      return res.status(400).send("Invalid token")
    }
    if (!payload) {
      return res.status(401).send("Token is not there")
    }
  }
  // req.userName = payload.userName
  next()
}
app.get('/', (req, res) => {
  res.send('Welcome to the express server');
});
//Inserting New records from Register Form
app.route('/catspost').post(passWordHash, (req, res) => {
  req.body.password = hashedPW;
  var myData = new User(req.body);
  // let custMailId = myData.emailId
  myData.save()
    .then(item => {
      let userName = req.body.userName
      const token = jwt.sign({ userName }, jwtKey, { algorithm: 'HS256', expiresIn: jwtExpirySeconds })

      res.send({ "result": token });
    })
    .catch(err => {
      res.status(400).send({ "result": "error" });
    });
});
//Fetching records for Register Form from  mongoo
app.get('/Fetch/(:userName)/(:screenMode)', verifyToken, (req, res) => {
  var userName = req.params.userName
  User.find({ "userName": userName }, function (err, docs) {
    if (docs.length) {
      res.send(docs);
    }
    else {
      // res.json({ message: "User not found with id = " + userName})
      res.send();
    }
    if (err) {      //next(err);
      res.status(500).send(err)
    }
  });
});
//Updating records from Register Form
app.route('/RegUpate').put((req, res) => {
  //var o_id = new ObjectId(req.params._id)
  var values = {
    $set:
    {
      userName: req.body.userName,
      password: req.body.password,
      MobileNo: req.body.MobileNo,
      emailId: req.body.emailId,
      address: [{
        doorNo: req.body.address.doorNo,
        street: req.body.address.street,
        area: req.body.address.area,
        landMark: req.body.address.landMark,
        district: req.body.address.district,
        state: req.body.address.state,
        pinCode: req.body.address.pinCode
      }]
    }
  }
  var myquery = { userName: req.body.userName };
  let err;
  conn.collection("users").updateOne(myquery, values, function (err, res) {
    if (err) throw err;

  })
  res.send({ "result": "success" });

});
//Deleting Record of Registration user
app.route('/RegDelete/(:userName)').delete((req, res) => {
  let query = { userName: req.params.userName };
  conn.collection("users").deleteOne(query).then(data => {
    res.send({ "result": "success" })
  }).catch(data => { res.send({ "result": data }) })
});

app.route('/MenuData').get((req,res) =>{
 


  conn.collection("Menues").find({}, { projection: { _id: 0 } }).toArray(function(err, result) {
    if (err) {
      res.send({'result': err})
    }
    else{
      res.send({'result':result})
    }
    
  });


})
//Login Service 
app.get('/Login/(:userName)/(:password)', (req, res, next) => {
  try {
    var userName = req.params.userName
    var password = req.params.password
    User.find({
      $and: [{ "userName": userName }//, { "password": password }
      ]
    }, function (err, docs) {
      
      if (err) {      //next(err);
        res.status(500).send(err)
      }
      if(docs.length){
        if(password !="Forget"){
          bcrypt.compare(password, docs[0].password, (err, compare) => {
            console.log("compare")
            if (err) {
              console.log("error on hashed password comparing time")
            }
            else {
              hashedPW = compare
              if (docs.length && hashedPW) {
                console.log('compare', hashedPW)
                let data = { 
                userName : docs[0].userName,
                logInType : docs[0].logInType
                }
                const token = jwt.sign({ data }, jwtKey, { algorithm: 'HS256', expiresIn: jwtExpirySeconds })
                res.send([{ 'userData': docs, 'token': token }]);
                res.end()
              }
              else {
                res.send();
              }
            }
          })
        }
        else{
          res.send([{ 'userData': docs }]);              
        }
        
  
      }else{
        res.send();
      }
        });
  }
  catch (e) {
    res.send(e)
  }
});
//Image get service
app.route('/getImage/(:fileName)').get((req, res) => {
  var fileName = req.params.fileName
  if (fs.existsSync(userFiles + fileName)) {
    let buff = fs.readFileSync(userFiles + fileName, function (err) {
      if (err) {
        res.send({ 'result': err });
      }

    });
    let base64data = buff.toString('base64');
    res.send({ 'result': base64data });
  } else {
    res.send({'result':''});
  }
});
//Image delete service
app.route('/deleteImg/(:fileName)').get((req, res) => {
  let fileName = req.params.fileName
  fs.unlink(userFiles + fileName, function (err) {
    if (err) {
      res.send({ 'result': err });
    }
    else {
      res.send({ 'result': 'Successfully Deleted' });
    }
  });
})
//Image save service
app.route('/imageStore').put((req, res) => {
  const file = req.body;
  const base64data = file.imageData.replace(/^data:.*,/, '');
  fs.writeFile(userFiles + file.fileName, base64data, 'base64', (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      res.send({ "result": "error" });
    } else {
      res.set('Location', userFiles + file.fileName);
      res.status(200);
      // res.send(file);
      res.send({ 'result': 'success' });
    }
  });
});
module.exports = app