/**
 * Created by jsharma on 20/03/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serviceSchema = new Schema({
    name : {type : String},
    type : {type : String},
    items : [{particular : String, rate : Number}],
    category : {type : Schema.Types.ObjectId, ref : 'category'}
});

var service = mongoose.model('Service', serviceSchema);
module.exports = service;