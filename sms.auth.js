const Nexmo = require('nexmo');
let express = require('express');
let app = express();

const nexmo = new Nexmo({
  apiKey: 'aa14fa0c',
  apiSecret: 'sGoHzaOe8DlUmvIQ',
});



// const Nexmo = require('nexmo');

// const nexmo = new Nexmo({
//   apiKey: 'aa14fa0c',
//   apiSecret: 'sGoHzaOe8DlUmvIQ',
// });

// const from = 'Vonage SMS API';
// const to = '919176308404';
// const text = 'Hello from Vonage';

// nexmo.message.sendSms(from, to, text);
  
app.route('/OTPReq').post((req, res) => {    
    nexmo.verify.request({
        number: '91'+req.body.MobileNo, //'919940169930',
        brand: 'Angular Tutorial',
        code_length: '4'
      }, (err, result) => {
          if(err){
              res.send({'result':err})
          }
          else{
              res.send({'result':result})
          }
        console.log(err ? err : result)
      });
  });

  app.route('/OtpVerify').post((req,res) =>{    
    console.log(req.body.request_id)
    console.log(req.body.ot)
  nexmo.verify.check({
    request_id:  req.body.request_id ,//'a6ab3d0923b7412d8287ac1682d4fda1',
    code:  req.body.code//3366
  }, (err, result) => {
    if(err){
        res.send({'result':err})
    }
    else{
        res.send({'result':result})
    }
    console.log(err ? err : result)
  });

  })

  module.exports = app