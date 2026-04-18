import express from 'express';
import Thread from '../models/Threads.js';
import getApiResponse from '../utils/GetResponse.js';

const router = express.Router();

router.get('/threads', async (req, res) => {
    try{
        const threads = await Thread.find().sort({updatedAt: -1});
        res.json(threads);
    }catch(error){
        console.error("Error fetching threads:", error);
        res.status(500).send("Error fetching threads");
    };
});

router.get('/threads/:id', async (req, res) => {
    const threadId = req.params.id;
    try{
        const thread = await Thread.findOne({threadId});
        if(!thread){
            res.status(404).json({error: "Thread not found"});
        }
        res.json(thread.messages);
    }catch(error){
        console.error("Error fetching thread messages:", error);
        res.status(500).send("Error fetching thread messages");
    }
});

router.delete('/threads/:id', async (req, res) => {
    const threadId = req.params.id;
    try{
        const deletedthread= await Thread.findOneAndDelete({threadId});
        if(!deletedthread){
            res.status(404).json({error: "Thread not found"});
        }
        res.status(200).json({message: "Thread deleted successfully"});
    }catch(error){
        console.error("Error deleting thread:", error); 
        res.status(500).send("Error deleting thread");
    }
});

router.post('/chat', async (req, res) => {

    const { threadId, message } = req.body;

    if(!threadId || !message){
         res.status(400).json({error: "Thread ID and message are required"});
    }

    try{
        let thread = await Thread.findOne({threadId});

        if(!thread){
            thread = new Thread({
                threadId,
                title: message,
                messages: [{role: 'user', content: message}],
            });

        }else{
            thread.messages.push({role: 'user', content: message});

        }

        const assistantResponse = await getApiResponse(message);
        thread.messages.push({role: 'assistant', content: assistantResponse});
        thread.updatedAt = Date.now();
        await thread.save();

        res.json({response: assistantResponse});

    }catch(error){
        console.error("Error handling chat message:", error);
        res.status(500).send("Error handling chat message");
    }
});

export default router;