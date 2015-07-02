var mongoose = require('mongoose');

var answerSchema = mongoose.Schema({
	queryId:String,
	answerId:String,
	content: String,
	username:String,
	date:Date
});

var answer = mongoose.model('answer',answerSchema);

module.exports = answer;