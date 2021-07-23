const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/users');
const Task = require('../../src/models/tasks');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '12345678',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Jess',
    email: 'jess@example.com',
    password: '12345678',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOneId = new mongoose.Types.ObjectId();
const taskOne = {
    _id: taskOneId,
    description: 'studium',
    owner: userOneId
}

const taskTwoId = new mongoose.Types.ObjectId();
const taskTwo = {
    _id: taskTwoId,
    description: 'leben',
    owner: userTwoId
}

setupDatabase = async () => {
    await User.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();

    await Task.deleteMany();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
}

module.exports = {
    userOneId: userOneId,
    userOne: userOne,
    userTwo: userTwo,
    taskOne: taskOne,
    taskTwo: taskTwo,
    setupDatabase: setupDatabase
}