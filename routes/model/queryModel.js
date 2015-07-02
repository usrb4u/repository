var mongoose = require('mongoose');

var querySchema = mongoose.Schema({
	queryId:String,
	title:String,
	content: String,
	username:String,
	date:Date,
	team:String,
	attachment:[]
});

var query = mongoose.model('query',querySchema);

module.exports = query;