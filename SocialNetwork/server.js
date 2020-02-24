const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile.js');
const posts = require('./routes/api/posts');
const bodyparser = require('body-parser');
const passport = require('passport');
const app = express();

//body parser middleware
app.use(bodyparser.urlencoded({extended:false}));

app.use(bodyparser.json());

//DB Config
const db = require('./config/keys').mongoURI;

//Connect to mongodb 
//promise functions
mongoose
   .connect(db)
   .then(() => console.log('MongoDB connected!'))
   .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

//first route  - arrow functions / lambdas/delegates
app.get('/', (reg, res) => res.send('Hello World'));

// User routes
// /api/users - respective users - users.js
app.use('/api/users', users);

// /api/profile - profile - profile.js
app.use('/api/profile', profile);

app.use('/api/posts', posts);

const port = 5555
//app.listen(port);
//back ticks are used for inline formatting
app.listen(port, () => console.log(`Server running on port ${port}`));

