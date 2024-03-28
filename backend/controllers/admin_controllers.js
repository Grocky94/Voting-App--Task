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
        return res.status(403).json({ success: false, message: "your not an admin" })
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
            } else {
                return res.status(404).json({ success: false, message: "Representor not found or delete operation failed." });
            }
        }
        return res.status(403).json({ success: false, message: "Unauthorized access" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

export const resetSingleCandidate = async (req, res) => {
    try {
        const { token, representor_id } = req.body;
        if (!token) return res.status(404).json({ success: false, message: "admin login is mandtory.." });
        if (!representor_id) return res.status(404).json({ success: false, message: "representor not marked properly to reset Vote!!" })
        const decodedData = await jwt.verify(token, process.env.secret);

        if (!decodedData) {
            return res.status(404).json({ success: false, message: "authorization failed" })
        }
        const userId = decodedData?._id
        const user = await user_model.findById(userId);

        if (user.role === "Admin") {
            const represent = await candidate_model.findById(representor_id);
            if (!represent) {
                return res.status(404).json({ success: false, message: "Candidate not found." });
            }
            if (represent.result && represent.result.length !== 0) {
                await candidate_model.findByIdAndUpdate(representor_id, { $set: { result: [] } });
                return res.status(200).json({ success: true, message: "Candidate vote has been reset successfully." });
            } else {
                return res.status(403).json({ success: false, message: "Candidate already have no Vote." });
            }
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized access." });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

export const resetAllCandidates = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(404).json({ success: false, message: "Admin login is mandatory." });

        const decodedData = await jwt.verify(token, process.env.secret);
        if (!decodedData) {
            return res.status(404).json({ success: false, message: "Authorization failed." });
        }

        const userId = decodedData?._id;
        const user = await user_model.findById(userId);

        if (user.role === "Admin") {
            await candidate_model.updateMany({}, { $set: { result: [] } });
            return res.status(200).json({ success: true, message: "All candidates' votes have been reset successfully." });
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized access." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
};

export const disableCandidate = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(404).json({ success: false, message: "Admin login is mandatory." });

        const decodedData = await jwt.verify(token, process.env.secret);
        if (!decodedData) {
            return res.status(404).json({ success: false, message: "Authorization failed." });
        }

        const userId = decodedData?._id;
        const user = await user_model.findById(userId);
        if (user.role === "Admin") {
            await candidate_model.updateMany({}, { $set: { active: true } });
            return res.status(200).json({ success: true, message: "Voting window has been disabled." });
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized access." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}
export const enableCandidate = async (req, res) => {
    try {
        const { token} = req.body;
        if (!token) return res.status(404).json({ success: false, message: "Admin login is mandatory." });

        const decodedData = await jwt.verify(token, process.env.secret);
        if (!decodedData) {
            return res.status(404).json({ success: false, message: "Authorization failed." });
        }

        const userId = decodedData?._id;
        const user = await user_model.findById(userId);
        if (user.role === "Admin") {
            await candidate_model.updateMany({}, { $set: { active: false } });
            return res.status(200).json({ success: true, message: "Voting window has been enabled." });
        } else {
            return res.status(403).json({ success: false, message: "Unauthorized access." });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}
export const Result = async (req, res) => {
    try {
        const response = await candidate_model.find({});
        if (response.length) {
            // Filter out candidates with null or undefined results
            const validCandidates = response.filter(candidate =>
                candidate.result.length > 0 && candidate.result.some(val => val > 0)
            );
            // console.log("validCandidates:", validCandidates)
            if (validCandidates.length) {
                // Find candidate(s) with highest result
                const highestResult = Math.max(...validCandidates.map(candidate => Math.max(...candidate.result)));
                // console.log("highestResult Math:", highestResult)
                const highestResultCandidates = validCandidates.filter(candidate =>
                    candidate.result.includes(highestResult)
                );
                // console.log("highestResultCandidates filter", highestResultCandidates)

                if (highestResultCandidates.length === 1) {
                    const highestResultCandidateName = highestResultCandidates[0].representor;
                    // console.log("highestResultCandidateNames === 1:", highestResultCandidateName)
                    res.status(200).json({ success: true, representor: response, highestResult, highestResultCandidateName });
                } else if (highestResultCandidates.length > 1) {
                    const highestResultCandidateNames = highestResultCandidates.map(candidate => candidate.representor);
                    // console.log("highestResultCandidateNames > 1:", highestResultCandidateNames)

                    res.status(200).json({ success: true, representor: response, highestResult, highestResultCandidateName: highestResultCandidateNames });
                } else {
                    res.status(400).json({ success: false, message: "No valid Representator found" });
                }

            } else {
                // No candidates found
                res.status(400).json({ success: false, message: "No Representator found" });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
