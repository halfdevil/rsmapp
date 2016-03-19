/**
 * Created by jsharma on 20/03/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviceSchema = new Schema({
    name : {type : String},
    description : {type : String},
    imageUrl : {type : String}
});

var service = mongoose.model('serviceSchema', serviceSchema);
module.exports = service;