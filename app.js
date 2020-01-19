var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose=require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser=require('body-parser');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);



// Form Data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


// Database Connectivity
mongoose.connect('mongodb://localhost:27017/products');
mongoose.connection.on('open',function() {
    console.log('Mongoose connected.');
});

Schema=mongoose.Schema;

// Creat Product Schema
var Product=new Schema({
    title:{type:String},
    sku:{type:String},
	msrp:{type: Number, get: getPrice, set: setPrice},
	category:{type:String},
	image:{type:String},
	description:{type:String}
});

function getPrice(num){
    return (num/100).toFixed(2);
}

function setPrice(num){
    return num*100;
}

var ProductModel=mongoose.model('Product',Product);

// Read Data Start
app.get('/crud',function(req,res){
    ProductModel.find({},function(err,docs){
        res.render('products',{'productList':docs});
    });
});

app.get('/product_listing',function(req,res){
    ProductModel.find({},function(err,docs){
        res.render('product_listing',{'productList':docs});
    });
});



// Create Data Start
app.get('/crud/add',function(req,res){
    res.render('add-product');
});

// Add Product
app.post('/crud/add',function(req,res){
    if(req.body.title && req.body.description){
        // Add Data
        var newProduct=new ProductModel({
            title:req.body.title,
			sku:req.body.sku,
			msrp:req.body.msrp,
			category:req.body.category,
			image:req.body.image,
            description:req.body.description
        });
        var message='Data has been added';
        newProduct.save(function(err){
            if(err){
                var message='Data has not been added';
            }
        });
        // Show Message
    }
    res.render('add-product',{msg:message});
});
// Create Data End

// Update Data Start
app.get('/crud/edit/:id',function(req,res){
    ProductModel.findOne({_id:req.params.id},function(err,docs){
        res.render('edit-product',{'product':docs});
    });
});

app.post('/crud/edit/:id',function(req,res){
    // update Data
    var updateData={
        title:req.body.title,
		sku:req.body.sku,
		msrp:req.body.msrp,
		category:req.body.category,
		image:req.body.image,
        description:req.body.description
    };
    var message='Data has been not updated';
    ProductModel.update({_id:req.params.id},updateData,function(err,numrows){
        if(!err){
            res.redirect('/crud/');
        }
    });
});
// Update Data End

// Delete Product
app.get('/crud/delete/:id',function(req,res){
    // Delete Data
    ProductModel.remove({_id:req.params.id},function(err){
        if(!err){
            res.redirect('/crud');
        }
    });
});
// Delete Product #End


// Set Public Folder as static Path
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
