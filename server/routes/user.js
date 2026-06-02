import express from 'express'
import verifyToken from '../middleware/verifyToken.js';
import User from '../models/User.js'

const router = express.Router();

//The vip profile room
//verify token in the middle will intercept the rquest before  async
router.get('/profile', verifyToken, async (req, res) => {
    try {
        //as the bouncer let us in,we have acces to req.user (which holds therir id)
        //we will search the  database for that id
        const user = await User.findById(req.user.userId).select('-password') //it returns evertything except password

        res.status(200).json({
            message: "welcome to VIP room",
            userData: user
        });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching profile" });
    }
});

export default router;