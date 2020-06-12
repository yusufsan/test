
var nodemailer = require('nodemailer');
let mongoose = require('mongoose');
let express = require('express');
let app = express();

var nameSchema = new mongoose.Schema({
  to: String,
  subject: String,
  text: Number
}, { versionKey: false });

var mailData = mongoose.model("mailData", nameSchema);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  auth: {
    user: 'dm1672693@gmail.com',
    pass: 'welcome@2020'
    // orcal Account mail id: dm1672693@gmail.com , password:  Welcome@2020
  },
  tls: {
    rejectUnauthorized: false
  }
});
// var transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,  
//   service: 'Gmail',
//   auth: {
//     user: 'dm1672693@gmail.com',
//     pass: 'welcome@2020'
    
//   }
// });

app.route('/mail').post((req, res) => {
  var mailOptions = {
    from: 'dm1672693@gmail.com',
    to: req.body.to,
    subject: req.body.subject,
    html: req.body.html
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    //  res.status(500).send(err)
      res.status(400).send( {"result": "error"});

    } else {
      res.send({'Email sent':  info.response});
    }
  });
});
module.exports = app


