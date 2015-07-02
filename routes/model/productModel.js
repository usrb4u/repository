var mongoose = require('mongoose');

var prodSchema = mongoose.Schema({
	no:String,
	name:String,
	sprice:String,
	rlevel:String,
	unitsale:String,
	yname:String,
	reason:String
});

var product = mongoose.model('product',prodSchema);

module.exports = product;