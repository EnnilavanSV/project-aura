import express from 'express';
import User from '..//models/User.js'; //getting the blueprint
import bcrypt from 'bcryptjs'; //encryption tool
import { mongo } from 'mongoose';
import jwt from 'jsonwebtoken'

const router = express.Router();

//the sign up door
//route : POST /api/auth/register
//post is used for listening the  request and will sumbit data.Aync used for waiting until the communication is completed
router.post('/register', async (req, res) => {
    try {
        //catch the data coming from react
        const { username, email, password } = req.body;

        //checking if the forget something?
        if (!username || !email || !password) {
            return res.status(400).json({ message: "please fill in all the fields." }); //it tells bad request and code stops running
        }

        //checking the database if this email is already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "user already exists with this email." });
        }

        //encrypt the password
        //salt is added to the password before ecryption to make it uncrackable
        //salt is a string of random characters 

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //build the new user(using the blueprint)

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        });

        await newUser.save() //saves to mongoDB

        res.status(201).json({ message: "Account Created Successfully." }); // tells the frontend it worked.201 means it created


    } catch (error) {
        console.log("Registration error", error);
        res.status(500).json({ message: "Server error during registration." });
    }
});

//The login door
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //checking both fields are filled
        if (!email || !password) {
            return res.status(400).json({ message: "please fill in all fields." });
        }

        //checking if alreadyexists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //checking password
        //using bcrypt to mathematically compare the typed password and hashedpassword
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "password is incorrect" });
        }

        //if passed all these.print token
        //embedding their unique database id to find who they are
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET, //signed with secreat vault
            { expiresIn: '1d' } //token expires in 1day
        );

        //giving token(wristband) back to the user
        res.status(200).json({
            message: "Login successfull",
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email

            }
        });
    } catch (error) {
        console.log("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }

}
);

export default router;

