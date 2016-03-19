/**
 * Created by jsharma on 20/03/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username : {type : String, index : {unique : true}},
    password : {type : String},
    email : {type : String},
    name : {type : String},
    admin : {type : Boolean}
});

var user = mongoose.model('user', userSchema);
module.exports = user;
