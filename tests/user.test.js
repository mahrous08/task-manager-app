const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/users');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(() => setupDatabase());

test('signup new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Jo',
        email: 'jo@example.com',
        password: '12345678'
    }).expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: {
            name: 'Jo',
            email: 'jo@example.com',
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('12345678');
});

test('login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    const user = await User.findById(response.body.user._id);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test("don't login non-existing user", async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'notmypass'
    }).expect(400);
});

test('get profile for authinticated user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test("don't get profile for non-authinticated user", async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('delete account for authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(userOne._id);
    expect(user).toBeNull();
});

test("don't delete account for non-authenticated user", async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('upload avatar for authenticated user', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

    const user = await User.findById(userOne._id);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('update profile for authenticated user', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Miky',
            email: 'miky@example.com'
        })
        .expect(200);

    const user = await User.findById(userOne._id);
    expect(user.name).toBe('Miky');
});

test("don't update invalid fields for user", async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Cairo'
        })
        .expect(400);
});