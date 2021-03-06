const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const env = require('dotenv').config();

const passport = require('./strategies/user.strategy');
const sessionConfig = require('./modules/session-middleware');

//DB Module
const db = require('./modules/db.config.js');

// Route includes
const userRouter = require('./routes/user.router');
const recipeRouter = require('./routes/recipe.router');
const groceryListRouter = require('./routes/groceryList.router');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/recipes', recipeRouter);
app.use('/groceryList', groceryListRouter);

// Serve static files
app.use(express.static('server/public'));



/** Listen * */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
