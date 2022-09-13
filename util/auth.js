const authentication = (request, response, next) => {
    if (request.session.email) {
        next(); // if email exists in session, move to next function
    } else {
        const error = new Error("Not logged in");
        next(error); // if email doesn't exist, stop function and pass error through to error catching
    }
}

module.exports = authentication;