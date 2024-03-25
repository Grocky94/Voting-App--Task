import jwt from "jsonwebtoken";
import candidate_model from "../model/candidate_model.js";
import user_model from "../model/user_model.js";

export const addRep = async (req, res) => {
    try {
        const { token, representor } = req.body;
        if (!token) return res.status(404).json({ success: false, message: "admin login is mandtory.." });
        if (!representor) return res.status(404).json({ success: false, message: "representor not added!!" });
        const decodedData = await jwt.verify(token, process.env.secret);

        if (!decodedData) {
            return res.status(404).json({ success: false, message: "authentication error" })
        }
        const userId = decodedData?._id
        const user = await user_model.findById(userId);

        if (user.role === "Admin") {
            const represent = new candidate_model({ representor, userId })
            await represent.save();
            return res.status(200).json({ success: true, message: "representor got added!!", represent })
        }
        return res.status(404).json({ success: false, message: "your not an admin" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const updateRepName = async (req, res) => {
    try {
        const { token, representor_id, name } = req.body
        if (!token) throw new Error("admin login is mandtory..")
        const decodedData = await jwt.verify(token, process.env.secret);

        if (!decodedData) {
            throw new Error("authorization failed.")
        }
        const userId = decodedData?._id
        const user = await user_model.findById(userId);

        if (user.role === "Admin") {
            const updatedCandidate = await candidate_model.findOneAndUpdate({ _id: representor_id }, { representor: name }, { new: true })
            if (updatedCandidate) {
                return res.status(200).json({ Success: true, message: "You have succesfully updated candidate name", edit: updatedCandidate })
            }
            throw new Error("Candidate not found or update failed.")
        }
        throw new Error("Unauthorized access.")

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const deleteSingleCandidate = async (req, res) => {
    try {
        const { token, representor_id } = req.body
        if (!token) return res.status(404).json({ success: false, message: "admin login is mandtory.." });
        if (!representor_id) return res.status(404).json({ success: false, message: "representor not marked properly to delete!!" })
        const decodedData = await jwt.verify(token, process.env.secret);

        if (!decodedData) {
            return res.status(404).json({ success: false, message: "authorization failed" })
        }
        const userId = decodedData?._id
        const user = await user_model.findById(userId);

        if (user.role === "Admin") {
            const represent = await candidate_model.findByIdAndDelete({ _id: representor_id })
            if (represent) {
                return res.status(200).json({ success: true, message: "representor got Deleted Successfully!!" })
            }
        }
        return res.status(404).json({ success: false, message: "Unauthorized access" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}