import jwt from "jsonwebtoken";
import { isBlacklisted } from './tokenBlacklist.js';
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET; 

export const userAuthentication = (req, res, next) => { 
    try{
        const token = req.headers.authorization.split(' ')[1];
        if (isBlacklisted(token)) {
            return res.status(401).json({ message: "Token has been invalidated" });
        }
        
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" });
            }
            req.user = decoded;

            next();
        });
        
    }catch(e){
        return res.status(401).json({error:`Unauthorized`})
    }};