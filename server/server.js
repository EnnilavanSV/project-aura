import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js' //authRoutes : router - alias
import userRoutes from './routes/user.js' //userRoutes : router - alias

//Initialize the Express Application
const app = express(); //app is a instance name which will be used when we nee the sever something to do
const PORT = process.env.PORT || 5000; //PORT is used for broadcasting the server.IF not availale it chooses channel 5000

//MiddleWare  
// Middleware are functions that run before the server actually responds to a request.
//  Imagine data flowing through a pipe; middleware are the filters it passes through.
app.use(cors()); //Opens the bridge to react //its removes the forbidden rules to talk to any server
app.use(express.json()); //Allows the data to understand JSON data

//new connection routes
app.use('/api/auth', authRoutes); //if someone visits this url.they will be redirected to authroutes hallway
app.use('/api/user', userRoutes); //if someone visits this url.they will be redirected to  userrouts hallway

//Data base connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Atlas Connected Successfully'))
    .catch((error) => console.log('MongoDB Connection Error: ', error));

//test route
//URL path in which it listens
//req = what the user requests res = response to the user
//res.json to confirm the server is working by sending a json package to the browser
app.get('/api/status', (req, res) => {
    res.json({ message: "Project Aura Backend is locked and loaded." }); //we are telling the server to look for a get request
});

// --- TURN ON THE SERVER ---
//app.listen binds the server to port 5000 and constantly listens traffic
app.listen(PORT, () => {
    console.log(` Server is running securely on http://localhost:${PORT}`);
});