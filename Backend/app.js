const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/db.js');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes.js')

dotenv.config({ path: path.join(__dirname, '.env') });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use('/users', userRoutes);
app.use('/captain', captainRoutes);
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes)
connectDB();


app.get('/', (req, res) => {
    res.send('Hello, World!');
});


module.exports = app;
