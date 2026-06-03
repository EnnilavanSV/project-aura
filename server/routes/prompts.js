import express from 'express'
import verifyToken from '../middleware/verifyToken.js';
import Prompt from '../models/Prompt.js'

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    try {
        const newPrompt = new Prompt({
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            user: req.user.userId
        })

        const savedPrompt = await newPrompt.save();
        res.status(201).json(savedPrompt)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to save Prompt" })
    }
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const userPrompts = await Prompt.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json(userPrompts);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch prompts" });
    }
});


router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const prompt = await Prompt.findById(req.params.id)

        if (!prompt) {
            return res.status(400).json({ message: "Promptnot found" });
        }

        console.log("The Database says the owner is: ", prompt.user);
        console.log("The Token says you are:       ", req.user.userId);

        //Security check whether the user is authorised

        
        if (String(prompt.user) !== String(req.user.userId)) {
            return res.status(401).json({ message: "Not authorized to delete this prompt" });
        }

        await prompt.deleteOne();
        res.status(200).json({ message: "Prompt deleted succesfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Deletion of Prompt failed" });
    }
})

export default router;