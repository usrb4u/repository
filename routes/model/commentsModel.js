var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
	blogId:String,
	commentId:String,
	comments: String,
	username:String,
	date:Date
});

var comments = mongoose.model('comments',commentSchema);

module.exports = comments;