const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { handle } = require('express/lib/application');
const { error } = require('console');
const ejsMate = require('ejs-mate')
const Campground = require('./models/campground')
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/yelp-camp');
mongoose.set('strictQuery', false);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express();
app.engine('ejs', ejsMate);
app.use(express.urlencoded());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Index
app.get('/', (req, res)=>{
      res.render('home');
});

// List all campgrounds
app.get('/campgrounds', async (req, res)=>{
      const campground = await Campground.find({});
      res.render('campgrounds/index', {campground});
});


// Create
app.get('/campgrounds/new', async (req, res)=>{
      res.render('campgrounds/new');
});

app.post('/campgrounds', async(req, res)=>{
      const campground = await new Campground(req.body.campground);
      await campground.save();
      res.redirect(`/campgrounds/${campground._id}`);
});


// Show single Campground
app.get('/campgrounds/:id', async (req, res)=>{
      const campground = await Campground.findById(req.params.id);
      res.render('campgrounds/show', {campground});
});


// Update
app.get('/campgrounds/:id/edit', async(req, res)=>{
      const campground = await Campground.findById(req.params.id);
      res.render('campgrounds/edit', {campground});
});


app.put('/campgrounds/:id', async(req, res)=>{
      const { id } = req.params;
      const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
      res.redirect(`/campgrounds/${campground._id}`);
});


// Delete
app.delete('/campgrounds/:id', async(req, res)=>{
      const {id} = req.params;
      await Campground.findByIdAndRemove(id);
      res.redirect('/campgrounds');
});

app.listen(3000, ()=>{
      console.log("Serving on port:3000!");
});