const request = require('supertest'); 
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

// Increase default time limit ;applies to all tests in this file
jest.setTimeout(20000); 

//Connect to a database before running any test in this test suite
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
}, 20000);

//Clean up or delete all user documents after running each test before starting
//the next test
afterEach(async () => {
    await User.deleteMany({});
});

//Global CleanUp after running every test on the test suite
afterAll(async () => {
    mongoose.connection.close();
});

/**
 * Tests for the `/api/patients/register'` endpoint: Patient REGISTRATION
 */
describe('POST /api/patients/register', () => {
    test('registers a new user succesfully', async () => {
        const req = await request(app).post('/api/patients/register').send({
            name: "Primrose",
            surName: "Ncube",
            userName: "roses22",
            email: "prim2025@gmail.com",
            password: "primrose123"
        });

        expect(req.statusCode).toBe(201);
        expect(req.body.message).toBe("User registered successfully");
    });

    test('rejects duplicate userName or password', async () => {
        await request(app).post('/api/patients/register').send({
            name: "Primrose",
            surName: "Ncube",
            userName: "roses22",
            email: "prim2025@gmail.com",
            password: "primrose123" 
        });

        const res = await request(app).post('/api/patients/register').send({
            name: "Precious",
            surName: "Mpofu",
            userName: "preMandy",
            email: "prim2025@gmail.com",
            password: "precious206"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("User already exists");
    });

    test('allows a second different user to register', async () => {
        await request(app).post('/api/patients/register').send({
            name: "Langelihle",
            surName: "Moyo",
            userName: "Lange25",
            email: "langie21@gmail.com",
            password: "langelihle345"
        });

        const res = await request(app).post('/api/patients/register').send({
            name: "Tawanda",
            surName: "Muti",
            userName:"t2",
            email: "tawanda2@gmail.com",
            password: "muti2"
        });

        expect(res.statusCode).toBe(201);
    });

    test('returns 500 when required fields are missing', async () => {
        const res = await request(app).post("/api/patients/register").send({
            "email": "precious205@gmail.com"
        });

        expect(res.statusCode).toBe(500);
    });
});

/**
 * 
 * Tests for the /api/patients/login endpoint: USER LOGIN
 */

describe('POST /api/patients/login', () => {
    const credentials = {
        name: "Pritchard",
        surName: "Ncube",
        userName: "pringle25",
        email: "pritch123@gmail",
        password: "ncubep25"
    };

    //Register this new user first before testing the logging in of said user
    beforeEach(async () => {
        await request(app).post('/api/patients/register').send(credentials);
    });

    test("Logs in successfully with correct credentials", async () =>{
        const res = await request(app).post('/api/patients/login').send({
            email: credentials.email,
            password: credentials.password
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    test("rejects incorrect password", async () => {
        const res = await request(app).post('/api/patients/login').send({
            email: credentials.email,
            password: "password1234"
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Invalid credentials");
    });

    test("rejects the logging in of unregistered email", async () => {
        const res = await request(app).post('/api/patients/login').send({
            email: "whateveremail@gmail.com",
            password: "Mypassword"
        });

        expect(res.statusCode).toBe(401);
    });
});