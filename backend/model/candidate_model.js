import mongoose, { Schema } from "mongoose";

const candidate = new Schema({
    representor: {
        type: String,
        required: true,
        trim:true
    },
    result: [Number],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
})

export default mongoose.model("candidate", candidate);