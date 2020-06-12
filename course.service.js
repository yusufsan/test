let express = require('express');
let app = express();
let mongoose = require('mongoose');
var config = require('./config')
const userFiles = './userFiles/';
const fs = require('fs');

mongoose.connect(config.database.url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
let conn = mongoose.connection;
mongoose.Promise = global.Promise;


var CourseSchema = new mongoose.Schema({
    courseName:String,
    imgFileName: String,
    courseFees: Number,
    courseDuration: String,
  }, { versionKey: false });
  
  
var Course = mongoose.model("Course", CourseSchema);




//Image save service
// app.route('/imageStore').put((req, res) => {
//   const file = req.body;
//   const base64data = file.imageData.replace(/^data:.*,/, '');
//   if( ! fs.mk)
//   fs.writeFile(userFiles + file.fileName, base64data, 'base64', (err) => {
//     if (err) {
//       console.log(err);
//       res.sendStatus(500);
//       res.send({ "result": "error" });
//     } else {
//       res.set('Location', userFiles + file.fileName);
//       res.status(200);
//       // res.send(file);
//       res.send({ 'result': 'success' });
//     }
//   });
// });

//Inserting New records from Register Form
app.route('/CourseCreate').post( (req, res) => { 
    var myData = new Course(req.body);
    myData.save()
      .then(item => {
        res.send({ "result": 'success' });
      })
      .catch(err => {
        res.status(400).send({ "result": "error" });
      });
  });

function imgGet(data) {
  if (fs.existsSync(userFiles +data)) {
    let buff = fs.readFileSync(userFiles +data, function (err) {
      if (err) {
        res.send({ 'result': err });
      }

    });
    let base64data = buff.toString('base64');
console.log(base64data)
    return base64data

    // res.send({ 'result': base64data });
  } else {
    return ''

    // res.send({'result':''});
  }
 
};

  app.route('/GetCourses').get((req,res) =>{
    let imgdata;
    Course.find({},function(err, result) {
      if (err) {
        res.send({'result': err})
      }
      else{
        // result.forEach((Element,index)=>{
         
        //   console.log( Element.imgFileName,index)
        //   Element.imgSource = ''
          
        //   // imgdata = imgGet(Element.imgFileName)
        //   // Element.imgbase64 = imgdata
        //   // console.log( Element)
        
          
        // })
        // console.log("last")
        res.send({'result':result})
      }
      
    });


  })

  module.exports = app