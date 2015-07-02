var express = require('express');
var router = express.Router();
var multer = require('multer');
var videoData = require(__dirname+'\\model\\videoModel')
var uploadVideo = require(__dirname+'\\model\\uploadModel');
var fs = require('fs');
var gridfs = require('./model/gridfs');
var done=false;
var fName='';
var actFName='';
var contentType=''

router.use(multer({dest: './public/data/uploads',
	rename: function (fieldname, filename) {
		fName = filename;
		console.log('Filename: '+fName);
    return fName;
	},
	
	onFileUploadComplete: function (file) {
     fName = file;
	  console.log(file.fieldname + ' uploaded to  ' + file.path)
    // console.log("File name: "+fName);
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

router.post('/add',function(req,res){

       videoData.count(function(err,c){
          console.log("count:: "+c);
          count = c+1;
          var query = new videoData({
          Id:'up'+c,
          title:req.body.title,
          keywords: req.body.keywords,
          team:req.body.team,
          uploadId:req.body.videoId,
          date:Date.now()
        });
          if(fName!='')
            query.save(function(err,query){
              if(err)
              console.log('Unable to insert new Query into database @ uploadAdd/'+ err)
            else
              console.log(query);
            // fs.unlinkSync(fName);
            res.end('Uploaded successfully');
              // res.send('http://inblr-uppalasr:3000/Question/'+query.Id+'/'+str(query.title).slugify().s)
          });
          else
            console.log('No file available to upload');
        });
      });

/* GET home page. */
router.get('/', function(req, res) {
  res.render('upload', { title: 'Upload File or Video', jsfile: 'upload' });
});

router.post('/video', function(req,res){
  if(done==true){
          var upload, opts;
       upload = new uploadVideo();
       // console.log("upload initiated");
        upload._id = mongoose.Types.ObjectId(req.body._id);
        upload.docName = actFName;
        opts = {
            content_type: req.body.type
        };
        console.log('Files:: '+req.files.file)
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
});


router.get('/:id/:title',function(req,res){
  // console.log('Header information: '+req.headers.host);
  videoData.findOne({Id:req.params.id}).exec(function(err,doc){
    if(err)
      console.log(err)
      
  uploadVideo.findOne({_id:doc.uploadId}).exec(function(err,result){
    if(err)
      console.log('Unable to find record: '+err)
    else if(result!=null || result.files[0]!=null) {
      var imgId = result.files[0]._id;
        gridfs.getGridFile(imgId.toString(),function(err,video){
          if(err){
            console.log('Error in reading from Grid file:: ');
            console.log(err)
          }
            
          else {
              console.log('range:: '+req.headers.range);
            if(req.headers.range!==undefined) {
            var range = req.headers.range;
            var total = result.files[0].length;
            var positions = range.replace(/bytes=/, "").split("-");
            var start = parseInt(positions[0], 10);
            var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            var chunksize = (end - start) + 1;
           // var url = 'http://inblr-uppalasr:3000/data/upload/'+doc.url
              video.on('open', function () {
                  res.writeHead(206, {
                      "Content-Range": "bytes " + start + "-" + end + "/" + total,
                          "Accept-Ranges": "bytes",
                          "Content-Length": chunksize,
                          "Content-Type": result.files[0].contentType
                  });
                  // This just pipes the read stream to the response object (which goes 
                  // to the client)
                  video.pipe(res);
              });

              video.on('error', function (err) {
                  res.end(err);
            });
          } else {
            // var url =req.headers.host+'\\video\\'+doc.Id+'\\'+doc.title;
            res.writeHead(200, {'Content-Type': result.files[0].contentType});
              // res.write("<html><body><video width='320', height='240', controls='controls', autoplay='autoplay' src='url'")
            res.write(video,'buffer');
            res.end();
            // res.end('"/></body></html>');
          }
    }
  })
}
  // var header = {};

  //     console.log(doc.url);
    
      // res.render('video', { title: doc.title, jsfile: 'upload', url:doc.url});    
  })
});
})



router.get('/:id/:title',function(req,res){
  console.log('Header information: '+req.headers.host);
  videoData.findOne({Id:req.params.id}).exec(function(err,doc){
    if(err)
      console.log(err)
    else if(doc.uploadId!=null) {
      var url =req.headers.host+'\\image\\'+doc.uploadId+'\\'+doc.title;
      res.render('video', { title: doc.title, jsfile: 'upload', url:url});
      // res.redirect(req.headers.host+'\\image\\'+doc.uploadId+'\\'+doc.title);
    }


      })
})

module.exports = router;