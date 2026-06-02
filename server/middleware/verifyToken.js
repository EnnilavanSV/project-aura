import jwt from 'jsonwebtoken'

//bouncer function
const verifyToken = (req, res, next) => { //next is a keyword which opens the door 
    //look for token
    const authHeader = req.header("Authorization");

    //if there is no header
    if (!authHeader) {
        return res.status(401).json({ message: "Access denied.You need a VIP badge" });
    }

    //to get the token separate from the header
    //done spliting the header and taking the next element from the start
    const token = authHeader.split(" ")[1];



    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified;
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid badge or expired" });
    }

};

export default verifyToken;