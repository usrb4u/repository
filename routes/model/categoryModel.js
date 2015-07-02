var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
	name:String,
	groupName:String,
	email:String,
	description:String,
	date:String,
	createdBy:String
});

var category = mongoose.model('category',categorySchema);

module.exports = category;