import mongoose from 'mongoose';

// Define the Blueprint (Schema)
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Automatically adds 'createdAt' and 'updatedAt' dates
});

//  Build the Model from the Blueprint
const User = mongoose.model('User', userSchema);

//  Export it so our server can use it
export default User;