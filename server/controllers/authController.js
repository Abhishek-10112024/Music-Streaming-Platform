import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { addToBlacklist } from "../middlewares/tokenBlacklist.js";
import { configDotenv } from "dotenv";

configDotenv();

const secretKey = process.env.JWT_SECRET;

// User registration
export const register = async (req, res) => {
try {
    
    // request body for new user registration
    const {username, email, password, role} = req.body;
    if (!username || !email || !password){
        return res.status(400).json({ message: "Please enter all the required fields"});
    }

    // constraints on email and password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:'",.<>?]).{8,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!passwordRegex.test(password)){
        return res.status(400).json({ message: "Password must be at least 8 characters long, contain a number, an uppercase letter, and a special character" })
    }
    if (!emailRegex.test(email)){
        return res.status(400).json({ message: "Invalid email address. Please include @ and a valid domain" })
    }

    // Checking for duplicate user
    const userExists = await User.findOne({where: {email}});
    if (userExists){
        return res.status(400).json({message: "User Already exists"});
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating new user
    await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || 'user',
    })

    // After successful creation, send the success message
    return res.status(201).json({message: "User created successfully"});
} catch(error) {
    console.log(error);
    return res.status(500).json({message: "Internal server error"});
}
};


// User login 
export const login = async (req, res) =>{
    try{
        // request body for login
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).json({message: "Please provide all the required fields"})
        }
    
        // checkig for user
        const user = await User.findOne({where: {email}});
        if (!user){
            return res.status(401).json({message: "Invalid credentials"});
        }
    
        // checking password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch){
            return res.status(401).json({message: "Invalid credentials"});
        }
    
        // jwt access token generation
        const token = jwt.sign({id: user.id, username: user.username, email: user.email, role: user.role}, secretKey, {expiresIn: '1h'});
    
        // success meassage alongwith token and user role
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
