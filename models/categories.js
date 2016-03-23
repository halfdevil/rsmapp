/**
 * Created by jsharma on 20/03/16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name : {type : String},
    description : {type : String},
    imageUrl : {type : String}
});

var category = mongoose.model('category', categorySchema);
module.exports = category;
