var express = require('express');
var router = express.Router();
var vendData = require(__dirname+'\\model\\vendModel')

/* GET home page. */
router.get('/', function(req, res) {
	 res.render('vendor', { title: 'Vendor Information', jsfile: 'vendor' });
});

router.post('/',function (req,res){
console.log('Post information from Host');
var svc = req.body
	console.log('From Node: '+svc.name);
	var vend = new vendData({
		no:req.body.no,
		name: req.body.name,
		address1: req.body.address1,
		address2: req.body.address2,
		address3: req.body.address3
	});
	vend.save(function(err, vendData){
		if(err)
			return console.error(err);
		res.send(vendData);
		console.log(vendData);
	}); 
});

router.get('/all',function(req,res){
	console.log('Retrieve all records');
	vendData.find().exec(function(err,doc){
			res.send(doc);
		});
})
router.get('/:id',function(req,res){
	vendData.findOne({no:req.params.id}).exec(function(err,doc){
		if(err)
			return console.error(err);
		res.send(doc);
	});
});

router.put('/',function(req,res){
	vendData.update({_id:req.body._id},{$set:{
		no:req.body.no,
		name:req.body.name,
		address1:req.body.address1,
		address2:req.body.address2,
		address3:req.body.address3
	}}).exec(function(err,doc){
		if(err)
			return console.error(err);
		vendData.find().exec(function(err,doc){
			res.send(doc);
		});
	});
});

router.delete('/:id',function(req,res){
	var id = req.params.id;
	console.log(id);
	vendData.findOne({_id:id}).remove({},true).exec(function(err,doc){
		if(err)
			return console.log(err);
		res.send('deleted');
	});
});

module.exports = router;