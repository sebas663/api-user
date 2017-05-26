var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
        name: String,
        surname: String,
        login: String,
        password: String,
        ndocument: {type: Number, unique: true },
        documentTypeCode: String,
        roleCode: String,
        sex: String,
        email:String
});
// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', UserSchema);

// make this available to our users in our Node applications
module.exports = User;