var express = require('express');
var router = express.Router();
var ntlm = require('express-ntlm');
var fs = require('fs');
var str = require('string');
var async = require('async');
var categoryData = require(__dirname+'\\model\\categoryModel');
var queryData = require(__dirname+'\\model\\queryModel');
var blogData = require(__dirname+'\\model\\blogModel');

var obj = function(title,url) {
	this._title = title;
	this._url = url;
}

/* GET home page. */
router.get('/', function(req, res) {
	 res.render('category', { title: 'Team Name Maintenance', jsfile: 'category' });
});



router.post('/',function(req,res){
	categoryData.findOne({name:req.body.name}).exec(function(err,doc){
		if(err)
			console.log(err);
		else if(doc==null){
			var category = categoryData({
			name:req.body.name,
			groupName:req.body.groupName,
			email:req.body.email,
			description:req.body.description,
			date:new Date(),
			createdBy:req.ntlm.UserName
			});
			category.save(function(err,category){
				if(err)
					console.log(err);
				else
				{
					res.send(category);
				}
			});
		}
	});
});

router.put('/',function(req,res){

	categoryData.update({name:req.body.name},{$set:{
		email:req.body.email,
		description:req.body.description,
		date:new Date(),
		createdBy:req.ntlm.UserName
	}}).exec(function(err,doc){
		if(err)
			return console.error(err);
		categoryData.findOne({name:req.body.name}).exec(function(err,doc){
			res.send(doc);
		});
	});
})

router.get('/:id',function(req,res){
	var query = [],
		blog = [];
		var url;
	var gName = str(req.params.id).replaceAll('%20',' ').s
	
	queryData.find({team:gName}).exec(function(err,doc){
		if(err)
			console.log(err)
		else {
			for(var i=0; i< doc.length; i++) {
				url = 'http://inblr-uppalasr:3000/Question/'+doc[i].queryId+'/'+str(doc[i].title).slugify().s
				query.push(new obj(doc[i].title, url));
			}
		}
		blogData.find({team:gName}).exec(function(err,doc1){
		if(err)
			console.log(err);
		else
			for(var i=0; i< doc1.length; i++) {
				url = 'http://inblr-uppalasr:3000/blog/'+doc1[i].blogId+'/'+str(doc1[i].title).slugify().s
				blog.push(new obj(doc1[i].title, url));
			}
			res.render('team',{ title: gName+' Information', team:gName, jsfile: 'category', blog:blog, query:query})
	});
	});

});

router.get('/getTeamName/:name',function(req,res){
	categoryData.findOne({name:req.params.name}).exec(function(err,doc){
		if(err)
			console.log(err);
		res.send(doc);
	})
})
router.get('/getAll',function(req,res){
	categoryData.find({},{name:1,_id:0}).exec(function(err,doc){
		if(err)
			console.log(err)
		else
			console.log(doc);
			res.send(doc);
	});
});

module.exports = router;
