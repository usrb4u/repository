var express = require('express');
var router = express.Router();
var ntlm = require('express-ntlm');
var profileData = require(__dirname+'\\model\\profileModel');
var categoryData = require(__dirname+'\\model\\categoryModel');

/* GET home page. */
router.get('/', function(req, res) {
	 res.render('profile', { title: 'User Record Maintenance', jsfile: 'profile' });
});

router.use(ntlm());

router.get('/groups/',function(req,res){
	categoryData.find({},{groupName:1,_id:0}).exec(function(err,doc){
		if(err)
			console.log(err)
		else
			res.send(doc);
	});
});

router.get('/category',function(req,res){
	categoryData.find({},{name:1, _id:0}).exec(function(err,doc){
		if(err)
			console.log(err)
		else
			res.send(doc);
	});
});

router.get('/person',function(req,res){
	profileData.findOne({userName:req.ntlm.UserName}).exec(function(err,doc){
		if(err)
			console.log(err)
		else
			res.send(doc);
	});
});

router.put('/',function(req,res){
	profileData.update({userName:req.body.userName},{$set:{
		firstName:req.body.firstName,
		lastName: req.body.lastName,
		middleName: req.body.middleName,
		emailId: req.body.emailId,
		workStation: req.body.workStation,
		team:req.body.team,
		notification:req.body.notification
	}}).exec(function(err,doc){
		if(err)
			return console.error(err);
		else
			profileData.findOne({userName:req.body.userName}).exec(function(err,doc){
				if(err)
					return console.error(err);
				else
					res.send(doc);
			});
	});

});


router.get('/getRecord',function(req,res){
	profileData.findOne({userName:req.ntlm.UserName}).exec(function(err,doc){
		if(err) 
			return console.error(err);
		if(doc==null){
			var profile = new profileData({
				firstName:'',
				lastName:'',
				middleName: '',
				userName:req.ntlm.UserName,
				emailId:'',
				workStation:req.ntlm.Workstation,
				team:'',
				notification:false
			});
			profile.save(function(err,profile){
				if(err)
					console.log(err)
				else
					res.send(profile);
			}) ;			
		}else
			res.send(doc);
	});
});

module.exports = router;