var mongoose     = require("mongoose");
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');
var User         = require('../models/user');
//Require the dev-dependencies
var chai         = require('chai');
var chaiHttp     = require('chai-http');

//var server       = require('../server');
var server      = 'http://localhost:4200';

chai.use(chaiHttp);

var should = chai.should();

//For work whit environment variable.
require('dotenv').config();

describe('Users', () => {
    beforeEach(() => {
        User.remove({}, (err) => { 
           done();         
        });
    });
  describe('/GET users', () => {
      it('it should GET all the users', () => {
             chai.request(server)
            .get('/api/' + process.env.API_VERSION + '/users')
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.eql(0);
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
      });
  });

  describe('/POST user', () => {
      it('when missing item in payload, should return a 400 ok response and a single error', () => {
        var user = {
                name: "nombre1 test",
                documentTypeCode: "DNI",
                email:"String@test.com"
            }
            chai.request(server)
            .post('/api/' + process.env.API_VERSION + '/users')
            .send(user)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('errors');
                expect(res.body.errors).to.have.property('surname');
                expect(res.body.errors).to.have.property('ndocument');
                expect(res.body.errors).to.have.property('sex');
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            })
      });
      it('it should POST a user ', () => {
        var user = {
                name: "nombre2 test",
                surname: "Apellido2",
                ndocument: 29799662,
                documentTypeCode: "DNI",
                sex: "M",
                email:"String2@test.com",
                roleCodes:["FR","MD"],
                professionCode:"PL"
            }
            chai.request(server)
            .post('/api/' + process.env.API_VERSION + '/users')
            .send(user)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').eql('User successfully added!');
                expect(res.body.user).to.have.property('name');
                expect(res.body.user).to.have.property('surname');
                expect(res.body.user).to.have.property('ndocument');
                expect(res.body.user).to.have.property('documentTypeCode');
                expect(res.body.user).to.have.property('sex');
                expect(res.body.user).to.have.property('email');
                expect(res.body.user).to.have.property('roleCodes');
                expect(res.body.user).to.have.property('professionCode');
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
      });
  });
  describe('/GET/:id user', () => {
      it('it should GET a user by the given id', () => {
        var user = new User({ 
                            name: "nombre3 test",
                            surname: "Apellido3",
                            ndocument: 29799663,
                            documentTypeCode: "DNI",
                            sex: "M",
                            email:"String3@test.com",
                            roleCodes:["FR","MD"],
                            professionCode:"GH"
                        });
        user.save((err, user) => {
            chai.request(server)
            .get('/api/' + process.env.API_VERSION + '/users/' + user.id)
            .send(user)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.user).to.have.property('name');
                expect(res.body.user).to.have.property('surname');
                expect(res.body.user).to.have.property('ndocument');
                expect(res.body.user).to.have.property('documentTypeCode');
                expect(res.body.user).to.have.property('sex');
                expect(res.body.user).to.have.property('email');
                expect(res.body.user).to.have.property('roleCodes');
                expect(res.body.user).to.have.property('professionCode');
                expect(res.body).to.have.property('_id').eql(user.id);
            })
            .catch(function (err) {
                console.log("Promise Rejected");
            });
        });

      });
  });
  describe('/PUT/:id user', () => {
      it('it should UPDATE a user given the id', () => {
        var user = new User({   
                             name: "nombre4 test",
                             surname: "Apellido4",
                             ndocument: 29799664,
                             documentTypeCode: "DNI",
                             sex: "M",
                             email:"String4@test.com",
                             roleCodes:["FR","MD"],
                             professionCode:"JK"
                            })
        user.save((err, user) => {
                chai.request(server)
                .put('/api/' + process.env.API_VERSION + '/users/' + user.id)
                .send({ 
                        name: "nombre4",
                        surname: "Apellido",
                        ndocument: 29799665,
                        documentTypeCode: "DNI",
                        sex: "M",
                        email:"String4@test.com",
                        roleCodes:["FR","MD"],
                        professionCode:"LK"
                    })
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').eql('User successfully updated.');
                    expect(res.body.user).to.have.property('name').eql("nombre4");
                    expect(res.body.user).to.have.property('surname').eql("Apellido");
                    expect(res.body.user).to.have.property('ndocument').eql(29799665);  
                    expect(res.body.user).to.have.property('professionCode').eql("LK");
                })
                .catch(function (err) {
                    console.log("Promise Rejected");
                });
          });
      });
  });
  /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id user', () => {
      it('it should DELETE a user given the id', () => {
        var user = new User({ 
                            name: "nombre5 test",
                            surname: "Apellido5",
                            ndocument: 29800666,
                            documentTypeCode: "DNI",
                            sex: "M",
                            email:"String5@test.com",
                            roleCodes:["FR","MD"],
                            professionCode:"GH"
                        })
        user.save((err, user) => {
                chai.request(server)
                .DELETE('/api/' + process.env.API_VERSION + '/users/' + user.id)
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').eql('User successfully deleted.');
                    expect(res.body.result).to.have.property('ok').eql(1);
                })
                .catch(function (err) {
                    console.log("Promise Rejected");
                });
          });
      });
  });
});