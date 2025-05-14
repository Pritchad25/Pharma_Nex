/**
 * @file: Centralized Express Handler. Must be mounted LAST in app.js, after  all routes and must keep all 4 parameters, as Express uses the function's arity to recognize it as an error handler.
 */

module.exports = function errorHandler(err, req, res, next){
    //prints to the error stream
    console.error(err);
    res.status(err.status || 500).json({ 'message': err.message || 'Server Error' });
}