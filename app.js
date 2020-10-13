const express = require('express');
const passport = require('passport');
const cors = require('cors');

/** 
 * ------- General Setup ------- 
 */
const app = express();

// Configures the database and opens a global connection that can be used in any module with `mongoose.connection`
require('./config/database');

// Must first load the models
require('./models/user');

// Pass the global passport object into the configuration function
require('./config/passport')(passport);

/** 
 * ------- Gloabl Middleware ------- 
 */

// This will initialize the passport object on every request
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors());

/** 
 * ------- Route ------- 
 */
app.use(require('./routes'));

/** 
 * ------- Server ------- 
 */
app.listen(5000, () => {
  console.log('Listening port 5000');
});