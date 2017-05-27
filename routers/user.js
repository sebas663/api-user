var express      = require("express");
var mongoose     = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var User         = require('../models/user');
var validator    = require('express-route-validator')

// API routes
var router = express.Router();

router.route('/users')
  .get(function (req, res) {
        var promise;
        if(req.query.name && req.query.surname){
           console.log('promise all users by name and surname')
           var namerx = new RegExp(req.query.name, "i");
           var surnamerx = new RegExp(req.query.surname, "i");
           var query = { name: regex,
                         surname:surnamerx
                       };
           promise = User.find(query).exec();
        }else if(req.query.ndocument){
           console.log('promise all users by ndocument')
           var query = { ndocument: req.query.ndocument };
           promise = User.find(query).exec();
        }else{
           //console.log('promise all users')
           // find all users.
           promise = User.find().exec();
        }

        promise.then(function(users) {
           response(res,users);
        })
        .catch(function(err){
            // just need one of these
            //console.log('error:', err);
            res.status(500).send(err.message);
        });
    })
  .post(validator.validate({
         body: {
                name:             { isRequired: true },
                surname:          { isRequired: true },
                ndocument:        { isRequired: true },
                documentTypeCode: { isRequired: true },
                sex:              { isRequired: true },
                email:            { isEmail: true, normalizeEmail: true, isRequired: true },
                roleCodes :       { isRequired: true }
              },
              headers: {
                'content-type': { isRequired: true, equals: 'application/json' }
              }
        }),
        function(req, res) {
            //console.log('POST');
            //console.log(req.body);
            var user = new User({
                  name: req.body.name,
                  surname: req.body.surname,
                  ndocument: req.body.ndocument,
                  documentTypeCode: req.body.documentTypeCode,
                  sex: req.body.sex,
                  email:req.body.email,
                  roleCodes:req.body.roleCodes
            });
            var promise = user.save();
            promise.then(function(user) {
              response(res,user);
            })
            .catch(function(err){
              // just need one of these
              //console.log('error:', err);
              res.status(500).send(err.message);
            });
        }
  );

router.route('/user/:idUser')
  .get(validator.validate({
          params: {
            idUser: { isRequired: true , isMongoId: true }
          }
      }),
      function(req, res) {
          var promise = User.findById(req.params.idUser).exec();
          promise.then(function(user) {
            //console.log('GET /users/' + req.params.idUser);
             response(res,user);
          })
          .catch(function(err){
            // just need one of these
            //console.log('error:', err);
            res.status(500).send(err.message);
          });
       }
  )
  .put(validator.validate({
          params: {
            idUser: { isRequired: true , isMongoId: true }
          }
      }),
      function(req, res) {
          //console.log('PUT');
          //console.log(req.body);
          var promise = User.findById(req.params.idUser).exec();
          promise.then(function(user) {
            if(user){
                user.name = req.body.name,
                user.surname = req.body.surname,
                user.ndocument = req.body.ndocument,
                user.documentTypeCode = req.body.documentTypeCode,
                user.sex = req.body.sex,
                user.email = req.body.email,
                roleCodes = req.body.roleCodes
                return user.save(); // returns a promise
            }
          })
          .then(function(user) {
              var message = "User successfully updated.";                
              response(res,user,message);
          })
          .catch(function(err){
              // just need one of these
              //console.log('error:', err);
              res.status(500).send(err.message);
          }); 
      }
  )
  .delete(validator.validate({
              params: {
                idUser: { isRequired: true, isMongoId: true }
              }
          }),
          function(req, res) {
              User.findByIdAndRemove(req.params.idUser, function (err, user) {  
                 if(err)
                    res.status(500).send(err.message);
                 var message = "User successfully deleted.";                
                 response(res,user,message);
              });
          }
  );
var response = function(res,user,messageOK,messageNotOK){
    if(user) {
      var resp = {
                  message: messageOK,
                  id:user._id
                };
      if(messageOK){
        res.status(200).jsonp(resp);
      }else{
        res.status(200).jsonp(user);
      }
    }else{
      var dfault =  "User Not Found";
      if(messageNotOK){
        res.status(400).send(messageNotOK);
      }else{
        res.status(400).send(dfault);
      }
    }
};
module.exports = router