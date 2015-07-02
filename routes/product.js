var express = require('express');
var router = express.Router();
var productData = require(__dirname+'\\model\\productModel')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('product', { title: 'Product Information', jsfile: 'product' });
});

router.post('/',function (req,res){
	
	var prod = new productData({
		no:req.body.no,
		name: req.body.name,
		sprice: req.body.sprice,
		rlevel: req.body.rlevel,
		unitsale: req.body.unitsale,
		yname:req.body.yname,
		reason:req.body.reason
	}); 
	prod.save(function(err, prod){
		if(err)
			return console.error(err);
		res.send(prod);
		//console.log(prod);
	}); 
});

router.get('/all',function(req,res){
	console.log('Retrieve all records');
	productData.find().exec(function(err,doc){
			res.send(doc);
		});
})
router.get('/:id',function(req,res){
	productData.findOne({no:req.params.id}).exec(function(err,doc){
		if(err)
			return console.error(err);
		res.send(doc);
	});
});

router.put('/',function(req,res){
	productData.update({_id:req.body._id},{$set:{
			no:req.body.no,
		name: req.body.name,
		sprice: req.body.sprice,
		rlevel: req.body.rlevel,
		unitsale: req.body.unitsale,
		yname:req.body.yname,
		reason:req.body.reason
	}}).exec(function(err,doc){
		if(err)
			return console.error(err);
		productData.find().exec(function(err,doc){
			res.send(doc);
		});
	});
});

router.delete('/:id',function(req,res){
	var id = req.params.id;
	console.log(id);
	productData.findOne({_id:id}).remove({},true).exec(function(err,doc){
		if(err)
			return console.log(err);
		res.send('deleted');
	});
});
module.exports = router;