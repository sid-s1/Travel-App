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
const tripController = require('./controller/trips');
const statsController = require('./controller/user-stats');
const searchController = require('./controller/search');
const votesController = require('./controller/votes');

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
        resave: false,
        saveUninitialized: false
    })
);

// Routing
app.use('/user/session', usersController);
app.use('/user/trips', tripController);
app.use('/user/stats', statsController);
app.use('/placeDetails', googleController);
app.use('/search', searchController);
app.use('/user/votes', votesController);

app.use(function (error, request, response, next) {
    response.status(error.status || 500);
    response.send(error.message);
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});