const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Defining a new User Schema
const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  surName:   { type: String, required: true},
  userName:  { type: String, unique: true, required: true },
  email:     { type: String, unique: true, required: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ["patient", "pharmacy", "driver"], default: "patient"},
  createdAt: { type: Date, default: Date.now }
});

/** 
 * Hash the Password: Using Mongoose middleware hook `pre`
 * that runs before a certain action. In this case, it runs
 * before saving a new User Document. This Middleware hook 
 * `pre` will run the asynchronous function that performs the 
 * hashing of this current User's password based on a condition
 * Hashing a password is a CPU intensive process and might freeze
 * your app if it runs synchronously or block the event loop, disallowing
 * other tasks from executing. Thankfully, bcrypt provides an async
 * version of hashing the password, hence why we declared the function
 * for handling the hashing of the password as async, allowing us to
 * handle the results gracefully when the Promise resolves (which
 * in this case means this producing code `bcrypt.hash(this.password, 12)`
 * retuns a hashed password)
 */ 
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();      //if this User's password has not been changed, skip hashing and continue with the save(next())
  this.password = await bcrypt.hash(this.password, 12); 
  next(); // After all the 'pre-save' work is done, save the document
});

/** Authentication check for when the user tries to login.
 * During login, the backend retrieves the user & calls 
 * `comparePassword` with the entered password and only if 
 * bcrypt confirms a match does the system authenticate the user.
 * Again, we use async because the hashing of strings by bycrypt is
 * asynchronous
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//Create the User table following the `userSchema` structure & make it available
//to other modules
module.exports = mongoose.model('User', userSchema);