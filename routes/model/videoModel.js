var mongoose = require('mongoose');

var videoSchema = mongoose.Schema({
	Id:String,
	title:String,
	keywords: String,
	team:String,
	uploadId:String,
	date:Date
});
console.log('video model:');
var video = mongoose.model('video',videoSchema);

module.exports = video;