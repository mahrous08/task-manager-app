const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const Task = require('../src/models/tasks');
const { 
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    setupDatabase
} = require('./fixtures/db');

beforeEach(() => setupDatabase());

test('create new task for authenticated user', async () => {
    const response = await request(app).post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ description: 'study German' })
        .expect(201);

    const task = Task.findById(response.body._id);
    expect(task).not.toBeNull();
});

test('get user tasks', async () => {
    const response = await request(app).get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200);

    expect(response.body.length).toBe(1);
});

test("don't delete tasks for non-owner", async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404);

    const task = Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});