const express = require('express');
const db = require('../database/db');
const User = require('../models/users');
const { isValidPassword } = require('../util/hash');
const router = express.Router();

// Login User
router.post('/', (request, response) => {
    const email = request.body.email.toLowerCase()
    const password = request.body.password;  
    User.checkExists(email)
    .then(dbRes => {
        console.log(dbRes)
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

module.exports = router;