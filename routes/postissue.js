var express = require('express');
var router = express.Router();
var str = require('string');
var fs = require('fs');
var nodemailer = require("nodemailer");
var ntlm = require('express-ntlm');
var queryData = require(__dirname+'\\model\\queryModel');
var ansData = require(__dirname+'\\model\\answerModel');
var categoryData = require(__dirname+'\\model\\categoryModel');
var uploadImg = require(__dirname+'\\model\\uploadModel')
var path = require('path');
var multer = require('multer');
var mongoose = require('mongoose');
var fName='';
var actFName='';

// var gridstore = mongoose.mongo.GridStore,
// grid = mongoose.mongo.Grid,
// ObjectId = mongoose.mongo.BSONPure.ObjectID

router.get('/', function(req, res) {
  res.render('postissue', { title: 'Submit Query', jsfile: 'postissue', htmlfile:'Hello world'});
});

router.use(ntlm());

var smtpTransport = nodemailer.createTransport({
	transport: "SMTP",
    host: "mailrelay.au.unisys.com",
    secureConnection: false,
    port: 25,
    requiresAuth: true,
});

router.use(multer({dest: './public/data/uploads',
	rename: function (fieldname, filename) {
		fName = filename;
		console.log('Filename: '+fName);
    return fName;
	},
	onFileUploadData: function(file, data, req, res) {
		// console.log('Received the data');
	},
	onFileUploadStart: function (file) {
	  // console.log(file.originalname + ' is starting ...')
	},
	onFileUploadComplete: function (file) {
	  console.log(file.fieldname + ' uploaded to  ' + file.path)
	  fName = file;
    // console.log("File name: "+file);
    // console.log('File type: '+file.type)
    if(actFName=='')
      actFName = file.path
    else if(fs.existsSync(actFName))
      fs.unlinkSync(actFName);
	  done=true;
	},
	onError: function(error,next){
		console.log('Error during upload: '+error);
	}
}));

router.post('/image',function(req,res){
	if(done==true){
          var upload, opts;
       upload = new uploadImg();
       // console.log("upload initiated");
        upload._id = mongoose.Types.ObjectId(req.body._id);
        upload.docName = actFName;
        opts = {
            content_type: req.body.type
        };
        upload.addFile(fName, opts, function (err, result) {
            if (err) console.log("api TrackDocs Error: " + err);

            // console.log("Result: " + result);
            upload.save();
            // console.log("Inserted Doc Id: " + upload._id);
            return res.json(upload._id);
            res.end('Uploaded successfully');
            // res.send(upload._id);
        });
  }
})
router.delete('/image/:id',function(req,res){
	console.log('Remove id: '+req.params.id)
	uploadImg.findOne({_id:req.params.id}).remove({},true).exec(function(err,doc){
		if(err)
			console.log('Unable to Delete the image: '+err)
		console.log('Deleted Successfully');
		res.send('Deleted Successfully');
	});
})
router.post('/send',function(req,res){
	categoryData.findOne({name:req.body.team}).exec(function(err,doc){
		if(err)
			console.log(err);
		var mailOptions={
			from:req.body.email,
			to : doc.email,
			cc : req.body.email,
			subject : req.body.title,
			html : req.body.txtMsg
		}
		smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
			console.log(error);
			res.end("Unable to send Mail with options: "+ error);
		}else{
			res.end("sent");
		}
	});
	});
	
});

router.post('/',function(req,res){
	var count=0;
	// var attach=''
	// if(actFName!='')
	 // attach = fs.readFileSync(actFName);
	 console.log('Attach length: '+req.body.attachments.length)
	queryData.count(function(err,c){
		console.log("count:: "+c);
		count = c+1;
		var query = new queryData({
		queryId:'q'+count,
		title:req.body.title,
		content: req.body.txtMsg,
		username:req.ntlm.UserName,
		date:new Date(),
		team:req.body.team,
		attachment:req.body.attachments
	});
	query.save(function(err,query){
		if(err)
			console.log('Unable to insert new Query into database @ postissue/')
		else {
			console.log('attachments:: '+query.attachment.length);
			res.send('http://inblr-uppalasr:3000/Question/'+query.queryId+'/'+str(query.title).slugify().s)

		}
	});
	});
	
});

router.post('/answer',function(req,res){

	
	console.log(req.body.url);
	var ansCount=0;
	ansData.count(function(err,c){
		if(err)
			console.log(err)
		else
		{
			ansCount = c+1;
		var ans = new ansData({
			queryId:req.body.queryId,
			answerId:'a'+ansCount,
			content: req.body.ansMsg,
			username:req.ntlm.UserName,
			date:new Date()
			});
		ans.save(function(err,ans){
			if(err)
				console.log('Unable to insert record @ postIssue/answer method')
			res.send(req.body.url)
		});
			
		}
	});	
});

function updateAnswer(fileName,bodyMsg,UserName) {
	var buff ='';
	var answer =1;
	var answerBy = '<label>'+UserName+'<h6># '+ new Date() +'</h6></label>'
	fs.readFileSync('public/data/'+fileName+'.htm').toString().split('\n').forEach(function(line){
		if(str(line).contains('<div class="panel panel-body">'))
				answer = answer + 1;
		buff = buff+line+'\n';
	});
	var answerLine='<h3>Answer #'+answer+'</h3>';
	buff = buff+answerLine+'\n'; 
	fs.readFileSync('public/templates/answer.htm').toString().split('\n').forEach(function (line) {
		if(str(line).contains('<div id="space-for-answer"></div>'))
			line = str(line).replaceAll('<div id="space-for-answer"></div>', bodyMsg);
		else if(str(line).contains('<div id="answeredBy"></div>'))
			line = str(line).replaceAll('<div id="answeredBy"></div>',answerBy);
	 	buff =buff+line+"\n";
	});
	return buff;
}

function createIssuePage(title,bodyMsg,UserName) {
	var buff='';
	buff = buff+'\n<h2>'+title+'</h2>\n'+bodyMsg+'\n';
	var userBy = '<label>'+UserName+'</label><h5> #'+new Date()+'</h5>'
	buff = buff+'<div class="panel panel-footer" align="right">'+userBy+'</div>'
	return buff;
}

module.exports = router;