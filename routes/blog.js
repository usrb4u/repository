var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
var str = require('string');
var ntlm = require('express-ntlm');
var blogData = require(__dirname+'\\model\\blogModel');
var comData = require(__dirname+'\\model\\commentsModel');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('blog', { title:'New Blog about ABSuite', jsfile:'blog' });
});

router.use(ntlm());
router.post('/',function(req,res){	
	var count=0;
	blogData.count(function(err,c){
		console.log("count:: "+c);
		count = c+1;
		var blog = new blogData({
			blogId:'b'+count,
			title:req.body.title,
			content: req.body.txtMsg,
			username:req.ntlm.UserName,
			date:new Date(),
			team:req.body.team
	});
	blog.save(function(err,query){
		if(err)
			console.log('Unable to insert new Query into database @ Blog/')
		else
			res.send('Blog/'+query.blogId+'/'+str(query.title).slugify().s)
	});
});
});


router.post('/addComment',function(req,res){
	
	console.log(req.body.url);
	var comCount=0;
	comData.count(function(err,c){
		if(err)
			console.log(err)
		else
		{
			comCount = c+1;
		var com = new comData({
			blogId:req.body.blogId,
			commentId:'c'+comCount,
			comments: req.body.feedback,
			username:req.ntlm.UserName,
			date:new Date()
			});
		com.save(function(err,com){
			if(err)
				console.log('Unable to insert record @ postIssue/answer method')
			res.send(req.body.url)
			
		});
			
		}
	});
});

function currentDate() {
	var date = new Date();

	return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"  "+date.getHours()+":"+date.getMinutes();
}

function updateBlog(blogFileName,commentAdd) {
	var buff="";
	fs.readFileSync('public/'+blogFileName).toString().split('\n').forEach(function (line) { 
   // console.log(line);
    if(str(line).contains('<div id="space-for-comment">'))
    	line =	str(line).replaceAll('<div id="space-for-comment">',commentAdd+'\n<div id="space-for-comment">').s;
   	 buff =buff+line+"\n";
	});
	
	return buff;
}

function createBlog(title,bodyMsg,UserName) {
	var buff="</div><div class='panel panel-footer' align='right'><label>"+UserName+"</label><h5>#"+new Date()+"</h5></div></div>";
	buff = '<h2>'+title+'</h2>\n'+bodyMsg+'\n'+buff+'\n';
	return buff;
}

module.exports = router;