import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    role: {
        type: String,
        trim: true,
        enum: ['User', 'Admin'],
        default: "User",
        required: true
    },
    vote: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model("User", userSchema);