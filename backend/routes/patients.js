/**
 * @file Authentication routes for PharmaNex.
 * @description Handles registration and login for patients, pharmacies,
 * and drivers. Mounted at /api/auth. Issues JWT tokens on login.
 */

const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/auth');

/**
 * Defining a an Express Router object which acts like a 
 * mini‑application that can handle routes and middleware 
 * separately from the main app.
 */
const router = express.Router();

/**
 * @swagger
 * /api/patients/register:
 *   post:
 *     summary: Register a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, surName, userName, email, password]
 *             properties:
 *               name: { type: string, example: john}
 *               surName: { type: string, example: doe}
 *               userName: { type: string, example: johndoe }
 *               email: { type: string, example: john@example.com }
 *               password: { type: string, example: SecurePass123 }
 *     responses:
 *       201: { description: User registered successfully }
 *       400: { description: Missing fields or duplicate user }
 */


//Definition of the /register route 
router.post('/register', async (req, res) => {
    /** 
     * Registering a new user is bound to result in an error
     * therefore, we put the bulk of the user registration inside the
     * try block and handle any error in the catch block
     * */ 
    try{
        const { name, surName, userName, email, password } = req.body; //assign the request body to the individual variables through destructuring

        //Check if the user already exists, through email & username
        const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        //Otherwise, create a new User
        const user = new User({ name, surName, userName, email, password });
        await user.save(); //save the new user document into the mongoDb collection

        //return the appropriate response for successful user registration
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering User', error: error.message });
    }
});

/**
 * @swagger
 * /api/patients/login:
 *   post:
 *     summary: Log in an existing patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: john@example.com }
 *               password: { type: string, example: SecurePass123 }
 *     responses:
 *       200: { description: Login successful, returns JWT }
 *       401: { description: Invalid credentials }
 */

//Definition of the Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password }  = req.body;
        //Query MongoDb for a user document matching the provided email
        const user = await User.findOne({ email });

        //Both user and password has to exist, otherwise if either of these
        // is not there or is false, then Invalid credentials were provided
        if (!user || !(await user.comparePassword(password))){
            return res.status(401).json({ message: 'Invalid credentials'});
        }

        //Generate authentication token for the session
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        //Attach the token to the response or send it back to the response
        res.json({ token })
    }catch (error){
        res.status(500).json({ message: 'Error Logging In', error: error.message });
    }
});

/**
 * @swagger
 * /api/patients/profile:
 *   get:
 *     summary: Get the profile of the authenticated patient
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []   # Requires JWT in Authorization header
 *     responses:
 *       200:
 *         description: Successfully retrieved patient profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id: { type: string, example: 64b8f2c9e4f1a2b3c4d5e6f7 }
 *                 name: { type: string, example: Dumisa }
 *                 surName: { type: string, example: Dube }
 *                 userName: { type: string, example: testuser1 }
 *                 email: { type: string, example: test1@example.com }
 *       401:
 *         description: Authentication failed (invalid or missing token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error while fetching profile
 */

router.get('/profile', authMiddleware, async (req, res) => {
    //Getting the UserProfile is bound to result in error, hence the use of the try/catch block
    try {
        //get the user document, excluding the password field
        const user = await User.findOne({ _id: req.userData.userId }).select('-password');
        //check if the user actually exists
        if (!user) {
            res.status(404).json({ message : 'User is not found' });
        }
        //send the user's data (stored in the constant `user`) to the client
        //(front end web app, mobile app) as a JSON formatted response
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching the User profile', error: error.message });
    }
});

/**
 * @swagger
 * /api/patients/update-profile:
 *   put:
 *     summary: Update the authenticated patient's profile
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []   # Requires JWT in Authorization header
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: updatedUser123
 *               email:
 *                 type: string
 *                 format: email
 *                 example: updated@example.com
 *             required:
 *               - userName
 *               - email
 *     responses:
 *       200:
 *         description: Successfully updated patient profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 64b8f2c9e4f1a2b3c4d5e6f7
 *                 userName:
 *                   type: string
 *                   example: updatedUser123
 *                 email:
 *                   type: string
 *                   example: updated@example.com
 *       400:
 *         description: Error updating the user profile (validation or bad request)
 *       401:
 *         description: Authentication failed (invalid or missing token)
 *       500:
 *         description: Server error while updating profile
 */

//Definition of the '/update-profile' route
//Update patient profile
router.put('/update-profile', authMiddleware, async (req, res) => {
    try {
        //Assign the values to be changed to the destructured variables
        const { userName, email } = req.body;
        /**Find the user (userDocument) by their ID and update their username 
         * and email, returning the updated document without the password field
         */
        const user = await User.findByIdAndUpdate(
            { _id: req.userData.userId }, 
            { userName, email }, 
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error updating the User profile', error: error.message });
    }
});

module.exports = router;