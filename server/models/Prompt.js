import mongoose from 'mongoose'

const promptSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    category: {
        type: String,
        default: 'General'
    }
}, { timestamps: true });

const prompt = mongoose.model('Prompt', promptSchema);

export default prompt;