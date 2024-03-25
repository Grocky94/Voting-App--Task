import bcrypt from "bcrypt";
import user_model from "../model/user_model.js";
import jwt from "jsonwebtoken";
import candidate_model from "../model/candidate_model.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, phone, role, vote } = req.body.userData;
        // console.log("name:", name, "email:", email, "password:", password, "phone:", phone, "role:", role, "vote:", vote)
        if (!name || !email || !password || !phone) return res.status(404).json({ success: false, message: "All fields are mandatory" });

        const emailAlreadyExist = await user_model.find({ email: email });
        if (emailAlreadyExist.length) {
            return res.status(403).json({ success: false, message: "UserName already exist" })
        };
        const Hashpassword = await bcrypt.hash(password, 10);
        const NewUser = new user_model({ name, email, password: Hashpassword, phone, role: "User", vote });
        await NewUser.save();
        res.status(200).json({ success: true, message: "New User have been register Cheers!!", NewUser })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body.userData;

        if (!email || !password) {
            return res.status(404).json({ success: false, message: "All fields are mandatory" })
        }

        const user = await user_model.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User not found.." })
        }
        const isPasswordRight = await bcrypt.compare(password, user.password);

        if (isPasswordRight) {
            const userObject = {
                name: user.name,
                email: user.email,
                _id: user._id,
                role: user.role,
                number: user.number,
                vote: user.vote
            }
            const token = jwt.sign({ _id: user._id }, process.env.secret)
            if (token) {
                return res.status(200).json({ success: true, message: "login successfull", user: userObject, token: token })
            }
        }
        return res.status(400).json({ success: false, message: "password is wrong" })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const CurrentUser = async (req, res) => {
    try {
        const { token } = req.body
        if (!token) return res.status(404).json({ success: false, message: "token not received" })
        const decodedData = jwt.verify(token, process.env.secret)

        if (!decodedData) {
            return res.status(404).json({ success: false, message: "authentication error" })
        }
        const userId = decodedData?._id
        // console.log(userId)
        const user = await user_model.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" })
        }
        const userObj = {
            name: user?.name,
            email: user?.email,
            userId: user?._id,
            role: user?.role,
            vote: user?.vote,
            phone: user?.phone
        }
        return res.status(200).json({ success: true, user: userObj })


    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
        // console.log(error)
    }
}

export const AllRepresentator = async (req, res) => {
    try {
        const response = await candidate_model.find({});
        if (response.length) {
            res.status(200).json({ success: true, representor: response })
        }
        // res.status(400).json({ success: false, message: "No Represator " })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}


export const voting = async (req, res) => {
    try {
        const { token, representor_id } = req.body;

        // Check if token or representor_id is missing
        if (!token || !representor_id) {
            return res.status(400).json({ success: false, message: "Token or representor_id missing" });
        }

        // Verify JWT token
        const decodedData = await jwt.verify(token, process.env.secret);

        // Check authentication
        if (!decodedData) {
            return res.status(401).json({ success: false, message: "Authentication error" });
        }

        const userId = decodedData._id;
        const user = await user_model.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if user has already voted
        if (user.role === "User" && user.vote === true) {
            return res.status(403).json({ success: false, message: "User has already voted" });
        }

        // Fetch current candidate and get their result array
        let candidate = await candidate_model.findById(representor_id);

        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }

        // Update candidate's result array
        let updatedCandidate;
        if (!candidate.result || candidate.result.length === 0) {
            // If result array doesn't exist or is empty, initialize it with 1
            updatedCandidate = await candidate_model.findByIdAndUpdate(
                representor_id,
                { $set: { "result": [1] } },
                { new: true }
            );
        } else {
            // Increment the existing result value
            updatedCandidate = await candidate_model.findByIdAndUpdate(
                representor_id,
                { $inc: { "result.0": 1 } },
                { new: true }
            );
        }

        if (!updatedCandidate) {
            return res.status(404).json({ success: false, message: "Candidate update failed" });
        }

        // Update user's vote status
        user.vote = true;
        await user.save();

        return res.status(200).json({ success: true, message: "Vote successful" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}







