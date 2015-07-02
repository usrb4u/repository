var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

var bodyParser = require('body-parser');

var routes = require('./routes/index');
var product = require('./routes/product');
var blog = require('./routes/blog');
var upload = require('./routes/upload');
var blogs = require('./routes/blogs');
var postissue = require('./routes/postissue');
var search = require('./routes/search')
var profile = require('./routes/profile');
var ntlm = require('express-ntlm');
var category = require('./routes/category');
// var multer = require('multer');
var app = express();

var db = mongoose.connect('mongodb://127.0.0.1:27017/test');
app.use(ntlm());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use('/', routes);
app.use('/product',product);
app.use('/blog',blog);
app.use('/upload',upload);
app.use('/blogs',blogs);
app.use('/postissue',postissue);
app.use('/search',search);
app.use('/profile',profile);
app.use('/category',category);

app.listen(3000);