var express = require('express');
var router = express.Router();
var str = require('string');
var async = require('async');
var fs = require('fs');
var ntlm = require('express-ntlm');
var queryData = require(__dirname+'\\model\\queryModel');
var ansData = require(__dirname+'\\model\\answerModel');
var blogData = require(__dirname+'\\model\\blogModel');
var path = require('path');
router.get('/', function(req, res) {
  
  res.render('search', { title: 'Search Results', jsfile: 'search'});

});

var sObj = function (title,url,data) {
    this._title = title;
    this._url = url;
    this._data = data;
};

router.get('/getDir',function(req,res){
  var dirs=[]
  dirs = getDirectories(__dirname+'/../public/data/');
  dirs.push('All');
  res.send(dirs);
});

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function searchQuery(record,searchString,type){
  var sArray = [];
  var data=[]
  var url='';
  var dataString='';
 
  for(var i=0; i<record.length; i++)
  {
     url='';
     dataString='';
    if(record[i].content.toLowerCase().search(searchString.toLowerCase())!=-1) {
      if(type=='query')
        url = 'http://inblr-uppalasr:3000/Question/'+record[i].queryId+'/'+str(record[i].title).slugify().s
      else if(type=='blog')
        url = 'http://inblr-uppalasr:3000/Blog/'+record[i].blogId+'/'+str(record[i].title).slugify().s
        data = record[i].content.split('\n')
        for(var j=0; j<data.length; j++) 
           if(data[j].toLowerCase().indexOf(searchString.toLowerCase())>=0)
              dataString = str(data[j]).stripTags().s;
        sArray.push(new sObj(record[i].title,url,dataString));

    }
  }
  return sArray;
}


router.get('/:id/:dir',function(req,res){
	var query = [];
  var blog = [];
  
    if(req.params.dir=='All') {
        queryData.find().exec(function(err,result){
          query=searchQuery(result,req.params.id,'query')
           blogData.find().exec(function(err,results){
          if(err)
            console.log(err);
           blog = searchQuery(results,req.params.id,'blog');
           res.render('search',{title:req.params.id, question:query, blogs:blog, area:req.params.dir, searchMsg:req.params.id});
        });
      });
        
    }
    else if(req.params.dir=='Blogs') {
          blogData.find().exec(function(err,result){
          if(err)
            console.log(err);
          blog = searchQuery(result,req.params.id,'blog');
          res.render('search',{title:req.params.id, question:[], blogs:blog, area:req.params.dir, searchMsg:req.params.id});          
        });    
    }else if(req.params.dir=='Question') {
          queryData.find().exec(function(err,result){
          if(err)
            console.log(err);
          query = searchQuery(result,req.params.id,'query')
          console.log(query.length);
          res.render('search',{title:req.params.id, question:query, blogs:[], area:req.params.dir, searchMsg:req.params.id});          
        });
    }    
     
});

module.exports = router;