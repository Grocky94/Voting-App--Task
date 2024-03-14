import jwt from "jsonwebtoken";
import candidate_model from "../model/candidate_model.js";
import user_model from "../model/user_model.js";

export const addRep = async (req, res) => {
    try {
        const { token, representor } = req.body;
        if (!representor) return res.status(404).json({ success: false, message: "representor not added!!" })
        const decodedData = await jwt.verify(token, process.env.secret);

        if (!decodedData) {
            return res.status(404).json({ success: false, message: "authentication error" })
        }
        const userId = decodedData?._id
        const user = await user_model.findById(userId);

        if (user.role === "Admin") {
            const represent = new candidate_model({ representor, userId })
            await represent.save();
            res.status(200).json({ success: true, message: "representor got added!!", represent })
        }
        return res.status(404).json({ success: false, message: "your not an admin" })
    } catch (error) {
        console.log(error.response);
    }
}