var express = require('express');
var str = require('string');
var fs = require('fs');
var path=require('path');
var router = express.Router();
var queryData = require(__dirname+'\\model\\queryModel');
var ansData = require(__dirname+'\\model\\answerModel');
var blogData = require(__dirname+'\\model\\blogModel');
var videoData = require(__dirname+'\\model\\videoModel');
var comData = require(__dirname+'\\model\\commentsModel');
var uploadData = require(__dirname+'\\model\\uploadModel');
var gridfs = require('./model/gridfs');

var obj = function(title,url,team){
	this.title = title;
	this.url = url;
	this.team = team;
}

// router.get('/*',function(req,res,next){
//     // res.header('Content-Type', 'text/html');
//     res.writeHead(200, { "Content-Type": "text/html" })
//     next(); 
// });

/* GET home page. */
router.get('/', function(req, res) {
	var query=[],
		blog=[];
		upload=[];
		// res.writeHead(200, { "Content-Type": "text/html" });
	queryData.find({}).exec(function(err,doc){
		if(err)
			console.log(err)
		else {
			for(var i=0; i< doc.length; i++) {
				url = 'http://inblr-uppalasr:3000/Question/'+doc[i].queryId+'/'+str(doc[i].title).slugify().s
				query.push(new obj(doc[i].title, url,doc[i].team));
			}
		}
		blogData.find({}).exec(function(err,doc1){
		if(err)
			console.log(err);
		else
			for(var i=0; i< doc1.length; i++) {
				url = 'http://inblr-uppalasr:3000/blog/'+doc1[i].blogId+'/'+str(doc1[i].title).slugify().s
				blog.push(new obj(doc1[i].title, url,doc1[i].team));
			}
		videoData.find({}).exec(function(err,doc2){
			if(err)
				console.log(err);
			else
				for(var i=0;i<doc2.length; i++) {
					url = 'http://inblr-uppalasr:3000/upload/'+doc2[i].Id+'/'+str(doc2[i].title).slugify().s
					upload.push(new obj(doc2[i].title,url,doc2[i].team))
				}
				// res.setHeader('Content-Type', 'text/html');
			res.render('index', { title: 'Welcome to ABSuite Technical Issue Forum', jsfile: 'search', blog:blog, query:query,upload:upload});
		});
		
		});
	});

  
});

router.get('/Question/:id/:title',function(req,res){
	// var filename =  str(req.originalUrl).replaceAll('%20',' ').s
	// filename =  str(filename).replaceAll('/Question/','').s
	var title = str(req.params.title).replaceAll('-',' ').s
	var qId='';
	queryData.findOne({queryId:req.params.id}).exec(function(err,doc){
		if(err)
			console.log(err)
		else if(doc==null)
			doc=[];
			// console.log('  '+doc.attachment[0])
			ansData.find({queryId:doc.queryId}).exec(function(err,doc1){
				if(err)
					console.log(err)
				else if(doc1==null) {
					doc1=[];
				}
					res.render('question',{
					title:title,
					jsfile:'postissue',
					html:doc,
					answers:doc1
				});		
			});
	});
});

router.get('/image/:id/:title',function(req,res){
	// var gridfs = 
	
	uploadData.findOne({_id:req.params.id}).exec(function(err,result){
		if(err)
			console.log('Unable to find record: '+err)
		else if(result!=null || result.files[0]!=null) {
			var imgId = result.files[0]._id;
				gridfs.getGridFile(imgId.toString(),function(err,doc){
					if(err){
						console.log('Error in reading from Grid file:: ');
						console.log(err)
					}
						
					else
						res.writeHead(200, {'Content-Type': result.files[0].contentType});
			   			// res.write('<html><body><img src="doc.attachment:image/jpeg')
						res.write(doc,'buffer');
						res.end();
						// res.end('"/></body></html>');
				});
		}
		else
			res.end();
	})
})
function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

router.get('/Blog/:id/:title',function(req,res){
	var title = str(req.params.title).replaceAll('-',' ').s
	var bId='';
	blogData.findOne({blogId:req.params.id}).exec(function(err,doc){
		if(err)
			console.log(err)
		else if(doc==null)
			doc=[];
		
			comData.find({blogId:doc.blogId}).exec(function(err,doc1){
				if(err)
					console.log(err)
				else if(doc1==null) {
					doc1=[];
				}
					res.render('blogs',{
					title:title,
					jsfile:'blog',
					html:doc,
					comments:doc1
				});		
			});
	});
	
});


module.exports = router;