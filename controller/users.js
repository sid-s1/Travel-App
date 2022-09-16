const express = require('express');
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
                return response.status(400).json({ message: 'The username and/or password you have entered is incorrect.' })
            }
            const user = dbRes.rows[0];
            const hashedPassword = user.password;
            if (isValidPassword(password, hashedPassword)) {
                request.session.email = email;
                request.session.user_id = user.id;
                return response.json({ id: user.id })
            }
            return response.status(400).json({ message: 'The username and/or password you have entered is incorrect.' })
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
        return response.status(400).json({ message: 'No users are logged in. How did you get here!?' })
    }
});

// Get session data to confirm if user is logged in
router.get('/', (request, response) => {
    const email = request.session.email;
    if (!email) {
        return response.status(401).json({ message: 'Please login to access this page' });
    } else {
        User.getIdUsernameAdmin(email)
            .then(dbRes => response.json(dbRes))
            .catch(err => response.json(err))
    }
})

// Get all users and their info
router.get('/allUsers', (request, response) => {
    User.getAllUsers()
        .then(dbRes => response.json(dbRes.rows))
        .catch(err => response.status(500).json({ message: 'Something went wrong on our end' }))
});

// Update user details
router.put('/updateUser', (request, response) => {
    const { id, email, username, password, secQns, secAns, admin } = request.body;
    if (admin === 'false') {
        User.checkAtleastOneAdmin()
            .then(dbRes => {
                const adminCount = dbRes.rows[0].count;
                if (adminCount > 1) {
                    if (password === 'undefined' && secAns === 'undefined') {
                        User.updateUserWithoutPasswordOrSecAnswer(id, email, username, secQns, admin)
                            .then(dbRes => response.json({ message: 'Updated user details without password and security answer!' }))
                            .catch(err => response.status(500).json({ message: 'Something went wrong on our end' }))
                    }
                    else {
                        if (password === 'undefined') {
                            const hashedSecurityAnswer = generateHash(secAns);
                            User.updateUserWithoutPassword(id, email, username, secQns, hashedSecurityAnswer, admin)
                                .then(dbRes => response.json({ message: 'Updated user details without password!' }))
                                .catch(err => response.status(500).json({ message: 'Something went wrong on our end' }))
                        }
                        else if (secAns === 'undefined') {
                            const hashedPassword = generateHash(password);
                            User.updateUserWithoutSecAnswer(id, email, username, hashedPassword, secQns, admin)
                                .then(dbRes => response.json({ message: 'Updated user details without security answer!' }))
                                .catch(err => response.status(500).json({ message: 'Something went wrong on our end' }))
                        }
                        else {
                            const hashedPassword = generateHash(password);
                            const hashedSecurityAnswer = generateHash(secAns);
                            User.updateUser(id, email, username, hashedPassword, secQns, hashedSecurityAnswer, admin)
                                .then(dbRes => response.json({ message: 'Updated user details!' }))
                                .catch(err => response.status(500).json({ message: 'Something went wrong on our end' }))
                        }
                    }
                }
                else {
                    return response.json({ message: 'You cannot unset the last admin!' })
                }
            })
            .catch(err => err)
    }
});

// Sign up new user
router.post('/signup', (request, response) => {
    const { username, email, confirmedPassword, securityQuestion, securityAnswer } = request.body;
    User.checkDoesNotExist(email, username)
        .then(dbRes => {
            let usernameExists = false;
            let emailExists = false;
            for (let i = 0; i < dbRes.rowCount; i++) {
                if (dbRes.rows[i]['username'] === username) {
                    usernameExists = true;
                }
                if (dbRes.rows[i]['email'] === email) {
                    emailExists = true;
                }
            }
            if (dbRes.rowCount === 0) {
                const hashedPassword = generateHash(confirmedPassword);
                const hashedSecurityAnswer = generateHash(securityAnswer);
                return User.addNewUser(username, email, hashedPassword, securityQuestion, hashedSecurityAnswer)
                    .then(dbRes => {
                        return response.json({});
                    })
                    .catch(err => {
                        return response.status(500).json({ message: err });
                    })
            } else if (usernameExists === true) {
                return response.status(400).json({ message: 'Username already taken, please choose another.' })
            } else if (emailExists === true) {
                return response.status(400).json({ message: 'Email already registered, please proceed to login.' })
            } else {
                return response.sendStatus(500);
            }
        })
        .catch((err) => {
            console.log(err);
            return response.sendStatus(500);
        })
});

router.delete('/:id', (request, response) => {
    const id = request.params.id;
    console.log('user id in controller - ', id);
    User.deleteUser(id)
        .then(dbRes => response.json({ message: `User id ${id} deleted!` }))
        .catch(err => response.status(500).json({ message: 'Something went wrong on our end' }))
});

module.exports = router;