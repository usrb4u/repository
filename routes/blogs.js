var express = require('express');
var router = express.Router();
var fs = require('fs');
var ntlm = require('express-ntlm');
var str = require('string');

/* GET home page. */
router.get('/', function(req, res) {
	 res.render('blogs', { title: 'HTML Generator', jsfile: 'comments' });
});

router.use(ntlm());

router.post('/',function(req,res){
	// var date = new Date().format('{dd}/{MM}/{yyyy} {hh}:{mm}:{ss}.{fff}')
	// console.log(currentDate());
	var blogFileName = req.body.url;
	var commentAdd = '<hr><label>'+req.ntlm.UserName+'<h6># '+ new Date() +'</h6></label>+<p>'+req.body.feedback+'</p>';
		updateBlog(blogFileName,commentAdd)
	fs.writeFile('public/'+blogFileName,updateBlog(blogFileName,commentAdd),function(err){
		if(err){
			res.send("Error: "+err);
			return console.log(err);
		}
		res.send(blogFileName);
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
module.exports = router;