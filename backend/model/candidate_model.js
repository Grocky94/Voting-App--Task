import mongoose, { Schema } from "mongoose";

const candidate = new Schema({
    representor: {
        type: String,
        required: true,
        trim: true
    },
    result: [Number],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    active: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model("candidate", candidate);