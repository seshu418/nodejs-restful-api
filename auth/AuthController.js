var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.get('/me', function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      res.status(200).send(decoded);
    });
  });

router.post('/register',(req,res)=>{
    var hashedPassword= bcrypt.hashSync(req.body.password,8);
    User.create({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword
    },
        function (err,user){
            var token = jwt.sign({id :user._id},config.secret,{
                expiresIn:86400
            });

        res.status(200).send({ auth: true, token: token });

        });
});

module.exports=router;