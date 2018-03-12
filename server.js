//Installed Express
const express = require('express');
const app = express();
//Installed ejs
const ejsLint = require('ejs-lint');
app.set('view engine', 'ejs');
//Installed Mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/dashboard');
//Installed BodyParts
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
//Installed Moment
const moment = require('moment')
//Set my Paths
const path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
//Creating our DB Model.
var FoxSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 1},
    type: {type: String, required: true, minlength: 1},
    fur: {type: String, required: true, minlength: 1}}, 
    {timestamps: true});

mongoose.model('fox', FoxSchema);
var fox = mongoose.model('fox');

app.get('/', function(req,res){
    fox.find({}, function(err, foxes){
        if(err){
            console.log(err);
        }
        res.render('index', {foxes: foxes});
    })
    
});
app.get('/foxes/new', function(req, res){
    res.render('new')
})

app.post('/foxes', function(req,res){
    var newFox = new fox(req.body)
    newFox.save(function(err){
        if(err){
            console.log(newFox.errors)
            res.render('new', {errors: newFox.errors})
        }
        else{
            console.log('fox was added successfully')
            res.redirect('/')
        }
    })
});

app.get('/foxes/update/:id', function(req, res){
    fox.find({_id: req.params.id}, function(err, fox){
        if(err){
           console.log(err)
           
        }
        else{
            res.render('update', {fox: fox[0]});
        }
    });
});

app.post('/foxes/:id', function(req,res){
    fox.update({_id: req.params.id}, req.body, function(err,result){
        if(err){
            console.log(err);

        }
        res.redirect('/')
    });
});

app.get('/foxes/delete/:id', function(req,res){
    fox.remove({_id: req.params.id}, function(err){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/')
        }
    });
});

app.listen(8000, function () {
    console.log("listening on port 8000");
});


