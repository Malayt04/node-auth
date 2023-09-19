const express = require('express');
const mongoose = require('mongoose');
const Router = require('./Routes/router');
const cookieParser = require('cookie-parser');
const { requireAuth } = require('./middleware/authmiddleware');


const app = express();

// view engine
app.set('view engine', 'ejs');


// middleware
app.use(express.static('public'));//To serve static files like css and image files
app.use(express.json());
app.use('/',Router);
app.use(cookieParser());

// database connection
const dbURI = 'mongodb+srv://malayt1704:VifljqvUL3zsN9FN@cluster0.341hk1u.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000,()=>{
    console.log("Apps is listening on port 3000");
  }))
  .catch((err) => console.log(err));

// routes
//app.get('*',checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));


