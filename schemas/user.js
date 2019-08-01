// user 스키마
const mongoose = require('mongoose');
// user 스키마 정의
const { Schema } = mongoose;
const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('User', userSchema);
