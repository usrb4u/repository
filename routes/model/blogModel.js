var mongoose = require('mongoose');

var blogSchema = mongoose.Schema({
	blogId:String,
	title:String,
	content: String,
	username:String,
	date:Date,
	team:String
});

console.log('Blog Data model');

var blog = mongoose.model('blog',blogSchema);

module.exports = blog;