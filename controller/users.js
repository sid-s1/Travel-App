const express = require('express');
const db = require('../database/db');
const User = require('../models/users');
const { isValidPassword, generateHash } = require('../util/hash');
const router = express.Router();

// Login User
router.post('/', (request, response) => {
    const email = request.body.email.toLowerCase()
    const password = request.body.password;  
    User.checkExists(email)
    .then(dbRes => {
        if (dbRes.rowCount === 0) {
            return response.status(400).json({message: 'The username and/or password you have entered is incorrect.'})
        } 
        const user = dbRes.rows[0];
        const hashedPassword = user.password;        
        if (isValidPassword(password, hashedPassword)) {
            request.session.email = email;
            return response.json({})
        } 
        return response.status(400).json({message: 'The username and/or password you have entered is incorrect.'})
    })
    .catch(() => response.sendStatus(500))
})

// Logout user
router.delete('/', (request, response) => {
    const userExists = request.session.email
    if (userExists) {
        request.session.destroy()
        return response.json({})   
    } else {
        return response.status(400).json({message: 'No users are logged in. How did you get here!?'})   
    }
});

// Get session data to confirm if user is logged in
router.get('/', (request, response) => {
    const email = request.session.email;
    if (!email) {
        return response.status(401).json({message: 'Please login to access this page'});
    } else {
        return response.json({email: email})
    }
})

// Sign up new user
router.post('/signup', (request, response) => {
    const { username, email, password, securityQuestion, securityAnswer } = request.body;
    User.checkDoesNotExist(email,username)
    .then(dbRes => {
        if(dbRes.rowCount === 0) {
            const hashedPassword = generateHash(password);
            const hashedSecurityAnswer = generateHash(securityAnswer)
            return User.addNewUser(username, email, hashedPassword, securityQuestion, hashedSecurityAnswer)
            .then(dbRes => {
                return response.json({});
            })
            .catch(err => {
                return response.status(500).json( {message: err} );
            })
        } else if (dbRes.rows[0]['username'] === username) {
            return response.status(400).json( {message: 'Username already taken, please choose another.'} )
        } else if (dbRes.rows[0]['email'] === email) {
            return response.status(400).json( {message: 'Email already registered, please proceed to login.'} )
        } else {
            return response.sendStatus(500);
        }
    })
    .catch((err) => {
        console.log(err);
        return response.sendStatus(500);
    })
})

module.exports = router;