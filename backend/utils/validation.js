/**
 * @file: Input Validation helpers
 */

function isValidCoordinate(value){
    /**
     * Function that checks if a value is an actual real or valid
     * coordinate. An actual coordinate is REAL number(type Number & an actual number)
     * 
     * Return: True if its a Real number, otherwise False
     */
    return typeof value === 'number' && !isNaN(value);
}

module.exports = { isValidCoordinate };