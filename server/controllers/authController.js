import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { addToBlacklist } from "../middlewares/tokenBlacklist.js";
import { configDotenv } from "dotenv";
import Playlist from "../models/Playlist.js";

configDotenv();

const secretKey = process.env.JWT_SECRET;

// User registration
export const register = async (req, res) => {
try {
    const {username, email, password, role} = req.body;
    if (!username || !email || !password){
        return res.status(400).json({ message: "Please enter all the required fields"});
    }

    const { role: userRole } = req.body; 
    const { role: adminRole } = req.user || {}; // it ensures that, even if there is no token(role property), during registration then also the new user should be able to register
    
    if (userRole === 'admin' && adminRole !== 'admin') {
        return res.status(403).json({ message: "Only admins can register new admin." });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:'",.<>?]).{8,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!passwordRegex.test(password)){ // Returns a Boolean value that indicates whether or not a pattern exists in a searched string
        return res.status(400).json({ message: "Password must be at least 8 characters long, contain a number, an uppercase letter, and a special character" })
    }
    if (!emailRegex.test(email)){
        return res.status(400).json({ message: "Invalid email address. Please include @ and a valid domain" })
    }

    const userExists = await User.findOne({where: { email, deleted: false }}); // Search for a single instance. Returns the first instance found, or null if none can be found.
    if (userExists){
        return res.status(400).json({message: "User Already exists"}); // Sends a JSON object 
    }

    const hashedPassword = await bcrypt.hash(password, 10); // hashing of password using bcrypt, with 10 rounds of salting

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || 'user',
    });

    // Create a "Liked Songs" playlist for the user
    await Playlist.create({
        name: 'Liked Songs',
        description: 'Songs that you liked',
        createdBy: user.id,
    });

    return res.status(201).json({message: "User created successfully"});
} catch(error) {
    console.log(error);
    return res.status(500).json({message: "Internal server error"});
}
};


// User login 
export const login = async (req, res) =>{
    try{
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).json({message: "Please provide all the required fields"})
        }

        const user = await User.findOne({where: {email}});
        if (!user || user.deleted){
            return res.status(401).json({message: "Invalid credentials or user deleted"});
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password); //Internally, bcrypt extracts the salt and cost factor from the hashed password and It hashes the plain-text password using the same salt and cost factor.
        if (!passwordMatch){
            return res.status(401).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user.id, username: user.username, email: user.email, role: user.role}, secretKey, {expiresIn: '1h'});
        // HS256, is default algo, if not specified

        return res.status(200).json({message: "Login successfull", token, userRole: user.role});

    } catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
};


// logout controller
export const logout = (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token){
        addToBlacklist(token);
    }
    res.status(200).json({message: "Logout successful"});
}
