const jwt = require('jsonwebtoken')

let express = require('express');
let app = express();


const cookieParser = require('cookie-parser')
app.use(cookieParser())

const jwtKey = 'my_secret_key'
const jwtExpirySeconds = 60


  
//Login Service 
app.get('/jwt/(:userName)', (req, res) => {
    var userName = req.params.userName
    //var password = req.params.password
    
const token = jwt.sign({ userName }, jwtKey, {
    algorithm: 'HS256',
    expiresIn: jwtExpirySeconds
  })
  res.cookie('token', token)

  console.log(req.cookies.token);
  res.send({'result': token})
  
   res.end()


    
});


app.get('/jwtEx/(:userName)',(req, res)=> {

  const token = req.cookies.token
  console.log(token);
  // res.send();
  // if (!token) {
  //   return res.status(401).end()
  // }
  var payload
  try {

    payload = jwt.verify(token, jwtKey)
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return res.status(401).send(e)
    }
    // otherwise, return a bad request error
    return res.status(400).send("Invalid token")
  }

  // Finally, return the welcome message to the user, along with their
  // username given in the token
  res.send(payload)
})


module.exports = app