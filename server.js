/********************************************************************************************** 
*	ITE5315 – Assignment 2 
*   I declare that this assignment is my own work in accordance with Humber Academic Policy.   
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including web sites) or distributed to other students. 
*  
*	Name: Sonal Pooja    Student ID: N01474010     Date: Nov 01, 2022 
* 
***********************************************************************************************
*/  

var express = require('express');
var path = require('path');
var app = express();
// add express handlebars (template engine)
const exphbs = require('express-handlebars');
//setting port
const port = process.env.port || 3000;
// to access public directory files
app.use(express.static(path.join(__dirname, 'public')));

const HBS = exphbs.create({
    extname: '.hbs',
    //Step 9 - custom helper
    helpers:{  
        convert : function(value,options){
            if(value==0){
                return "out of stock"
            }
            return value
        },
        noauthor : function(value,options){
            if(value==" "){
                return "no author"
            }
            return value
        }
    }
});
// initialize engine
app.engine(".hbs", HBS.engine);
// set view engine to hbs file
app.set('view engine', 'hbs');
// Initialize built-in middleware for urlencoding and json
app.use(express.urlencoded({extended: true}));
// body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

//loading JSON file and reading the file 
const fs = require('fs');
const myData = fs.readFileSync('dataset.json','utf8');
const data = JSON.parse(myData);

// Step 6
app.get('/data', function(req, res) {
    res.render('booksData', { 
        bookdata:data
    })
})

//Step 6 (search by book isbn)
app.get("/data/isbn", function (req, res) {
    res.render('searchisbnForm');
})

app.post('/data/isbn', function(req, res) { 
    var Isbn = req.body.isbn;  
    var book = data.find(eachBook => eachBook.ISBN == Isbn);
        
    if(book){
        res.render('isbn',{
            bookdata:book
        })
    }
    else{
        return res.status(404).send(`Book with isbn ${Isbn} not found!!`);
    }
})

//Step 6 (search by book title)
app.get("/data/title", function (req, res) {
    res.render('searchTitleForm');
})

app.post('/data/title', function(req, res) { 
    const title = req.body.title;
    var search = data.filter((book) => {
        return book.title.toLowerCase().includes(title.toLowerCase());   // partial search on title        
    });  
    if (search != 0)
    {
        res.render('title',{
            data:search
        })
    }
    else{
        return res.status(404).send(`Book with title - ${title} not found!!`);
    }
})

// Step 7
app.get('/allData', function(req, res) {
    res.render('allData', { 
        book:data
    })
})

// Step 8
app.get('/step8', function(req, res) {
    res.render('allDataModified', { 
        book:data
    })
})

// Step 9
app.get('/step9', function(req, res) {
    res.render('step9', { 
        book:data
    })
})

// Step 10
app.get('/step10', function(req, res) {
    res.render('step10', { 
        book:data
    })
})

app.get('/users', function(req, res) {
  res.send('respond with a resource');
});

app.get('*', function(req, res) {
  res.render('error', { title: 'Error', message:'Wrong Route' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})