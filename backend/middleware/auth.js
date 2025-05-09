/**
 * @file JWT authentication middleware.
 * @description Verifies the Bearer token on incoming requests, attaches
 * decoded payload to req.user, or responds 401 if invalid/missing.
 */

const jwt = require('jsonwebtoken');

//Middleware function to be used for authentication
module.exports = async (req, res, next) => {
    // Authentication is bound to have an error, hence the use 
    // of a try..catch block
    try {
        const token = req.headers.authorization.split(' ')[1]; //Extract the actual token
        //Verify if the token was actually signed with our secret key & if it hasnt expired yet
        //`verify` will return the payload if above conditions are met
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //attaching user information decoded from the JWT to the custom property
        //`userData` of the req object
        req.userData = { userId : decoded.userId };
        next(); //when middleware function is done, return control to next middleware or route handler
    } catch (error) {
        //Throw an authentication error
        res.status(401).json({ message: 'Authentication failed'});
    }
};