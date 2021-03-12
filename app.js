var express = require('express')
var app = express()
const session = require('express-session');
app.use(session({secret: 'matkhaukhongaibiet_khongcannho',saveUninitialized: true,resave: true}));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://alphazero20:blah123@cluster0.mxgks.mongodb.net/test";

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

var hbs = require('hbs')
app.set('view engine','hbs')

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', async (req,res)=>{
        let client= await MongoClient.connect(url);
        let dbo = client.db("ProductTesting");
        let results = await dbo.collection("ProductTesing").find({}).toArray();
        res.render('viewproducts',{model:results})
})
app.get ('/Control_Center',async (req, res)=>{
    let client= await MongoClient.connect(url);
    let dbo = client.db('ProductTesting');
    let results = await dbo.collection("ProductTesing").find({}).toArray({});
    res.render('home', {model:results})
});
app.get ('/about', (req,res)=>{
    res.render('About')
})
app.get('/new',(req,res)=>{
 res.render('newProduct')
});
app.get("/delete", async(req, res)=>{
    let id = req.query.id;
    var ObjectID = require("mongodb").ObjectID;
    let condition = {_id: ObjectID(id) };
    let client= await MongoClient.connect(url);
    let dbo = client.db("ProductTesting");
    await dbo.collection("ProductTesing").deleteOne(condition);
    let results = await dbo.collection("ProductTesing").find({}).toArray({});
    res.redirect('/')
});
app.post('/insert', async (req,res)=>{
    let client= await MongoClient.connect(url, {useUnifiedTopology: true});
    let dbo = client.db('ProductTesting'); 
    let Name = req.body.productName;
    let Price = req.body.price;
    let Date = req.body.ImportedDate;
    let Clothes = req.body.outfit;
    let Image = req.body.img;
    let newProduct = {productName: Name, price: Price, ImportedDate: Date, outfit: Clothes, img: Image};
    await dbo.collection('ProductTesing').insertOne(newProduct);
    
    res.redirect('/viewproducts')  
})

const PORT = process.env.PORT || 5000
app.listen(PORT);
console.log("Server is running at " + PORT)