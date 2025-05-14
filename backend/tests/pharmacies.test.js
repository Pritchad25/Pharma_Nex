const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');

jest.setTimeout(50000);

let owner, ownerToken, otherUser, otherUserToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Pharmacy.deleteMany({});

  owner = await User.create({
    name: 'Pharmacy', surName: 'Owner', userName: 'pharmowner',
    email: 'owner@example.com', password: 'Password123', role: 'pharmacy',
  });
  ownerToken = jwt.sign({ userId: owner._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  otherUser = await User.create({
    name: 'Other', surName: 'User', userName: 'otheruser',
    email: 'other@example.com', password: 'Password123', role: 'patient',
  });
  otherUserToken = jwt.sign({ userId: otherUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/pharmacies', () => {
  test('creates a pharmacy when authenticated', async () => {
    const res = await request(app)
      .post('/api/pharmacies')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'HealthCare Pharmacy',
        licenseNumber: 'PH-001',
        longitude: 31.0492,
        latitude: -17.8252,
        address: '123 Main St, Harare',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('HealthCare Pharmacy');
    expect(res.body.userId).toBe(owner._id.toString());
  });

  test('rejects request with no auth token', async () => {
    const res = await request(app).post('/api/pharmacies').send({
      name: 'No Auth Pharmacy', licenseNumber: 'PH-002',
      longitude: 31.05, latitude: -17.82, address: 'Nowhere',
    });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/pharmacies/nearby', () => {
  test('returns only pharmacies within radius', async () => {
    await Pharmacy.create({
      userId: owner._id, name: 'Close Pharmacy', licenseNumber: 'LIC-CLOSE',
      location: { type: 'Point', coordinates: [31.0492, -17.8252] },
      address: 'Close by',
    });
    await Pharmacy.create({
      userId: owner._id, name: 'Far Pharmacy', licenseNumber: 'LIC-FAR',
      location: { type: 'Point', coordinates: [32.5, -19.0] },
      address: 'Far away',
    });

    const res = await request(app)
      .get('/api/pharmacies/nearby')
      .query({ latitude: -17.8252, longitude: 31.0492, radius: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Close Pharmacy');
  });
});

describe('GET /api/pharmacies/:id', () => {
  test('returns pharmacy details', async () => {
    const pharmacy = await Pharmacy.create({
      userId: owner._id, name: 'Detail Pharmacy', licenseNumber: 'LIC-D',
      location: { type: 'Point', coordinates: [31.05, -17.82] },
      address: 'Detail Address',
    });

    const res = await request(app).get(`/api/pharmacies/${pharmacy._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Detail Pharmacy');
  });

  test('returns 400 for invalid pharmacy ID', async () => {
    const res = await request(app).get('/api/pharmacies/invalid-id');
    expect(res.statusCode).toBe(400);
  });

  test('returns 404 for a well-formed but non-existent pharmacy ID', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/pharmacies/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});

describe('PATCH /api/pharmacies/:id', () => {
  test('allows the owner to update their pharmacy', async () => {
    const pharmacy = await Pharmacy.create({
      userId: owner._id, name: 'Old Name', licenseNumber: 'LIC-U',
      location: { type: 'Point', coordinates: [31.05, -17.82] },
      address: 'Update Address',
    });

    const res = await request(app)
      .patch(`/api/pharmacies/${pharmacy._id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'New Name' });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('New Name');
  });

  test('rejects an update attempt from a non-owner', async () => {
    const pharmacy = await Pharmacy.create({
      userId: owner._id, name: 'Protected Pharmacy', licenseNumber: 'LIC-P',
      location: { type: 'Point', coordinates: [31.05, -17.82] },
      address: 'Protected Address',
    });

    const res = await request(app)
      .patch(`/api/pharmacies/${pharmacy._id}`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({ name: 'Hacked Name' });

    expect(res.statusCode).toBe(403);
  });
});