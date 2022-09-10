const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('views'))
app.use(express.json());

// Dependancies
const db = require('./database/db')

// Controllers
const { expressSession, pgSession } = require('./controller/session');
const usersController = require('./controller/users');
const googleController = require('./controller/google-details');
const tripController = require('./controller/trip-details');
const statsController = require('./controller/user-stats');

// Middleware
app.use((request, response, next) => {
    console.log(`*** Request method: ${request.method} and route: ${request.path} at ${new Date()} ***`)
    next();
})

app.use(
    expressSession({
        store: new pgSession({
            pool: db,
            createTableIfMissing: true,
        }),
        secret: process.env.EXPRESS_SESSION_SECRET_KEY,
    })
);

// Routing
app.use('/user/session', usersController);
app.use('/placeDetails', googleController);
app.use('/tripDetails', tripController);
app.use('/userStats', statsController);

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});