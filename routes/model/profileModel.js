var mongoose = require('mongoose');

var profileSchema = mongoose.Schema({
	firstName:String,
	lastName:String,
	middleName: String,
	userName:String,
	emailId:String,
	workStation:String,
	team:String,
	notification:Boolean
});

var profile = mongoose.model('profile',profileSchema);

module.exports = profile;