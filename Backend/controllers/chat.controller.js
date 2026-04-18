const threadModel = require('../models/Threads.js');
const getApiResponse = require('../utils/GetResponse.js');

async function getThreads(req, res) {
    try{
        const threads = await threadModel.find({ user: req.user.id }).sort({updatedAt: -1});
        res.json(threads);
    }catch(error){
        console.error("Error fetching threads:", error);
        res.status(500).send("Error fetching threads");
    };
}

async function getThreadMessages(req, res) {
    const threadId = req.params.id;
    try{
        const thread = await threadModel.findOne({threadId, user: req.user.id});
        if(!thread){
            res.status(404).json({error: "Thread not found"});
            return;
        }
        res.json(thread.messages);
    }catch(error){
        console.error("Error fetching thread messages:", error);
        res.status(500).send("Error fetching thread messages");
    }
}

async function deleteThread(req, res) {
    const threadId = req.params.id;
    try{
        const deletedthread= await threadModel.findOneAndDelete({threadId, user: req.user.id});
        if(!deletedthread){
            res.status(404).json({error: "Thread not found"});
            return;
        }
        res.status(200).json({message: "Thread deleted successfully"});
    }catch(error){
        console.error("Error deleting thread:", error); 
        res.status(500).send("Error deleting thread");
    }
}


async function handleChatMessage(req, res) {

    const { threadId, message } = req.body;

    if(!threadId || !message){
         res.status(400).json({error: "Thread ID and message are required"});
         return;
    }

    try{
        let thread = await threadModel.findOne({threadId, user: req.user.id});

        if(!thread){
            thread = new threadModel({
                threadId,
                title: message,
                messages: [{role: 'user', content: message}],
                user: req.user.id
            });

        }else{
            thread.messages.push({role: 'user', content: message});

        }

        let assistantResponse;

        try {
            assistantResponse = await getApiResponse(message);
        } catch (error) {
            console.error('AI response error:', error.message || error);
            assistantResponse = 'I could not generate a response right now. Please check AI API key/configuration and try again.';
        }

        thread.messages.push({role: 'assistant', content: assistantResponse});
        thread.updatedAt = Date.now();
        await thread.save();

        res.json({response: assistantResponse});

    }catch(error){
        console.error("Error handling chat message:", error);
        res.status(500).send("Error handling chat message");
    }
}

module.exports = {
    getThreads,
    getThreadMessages,
    deleteThread,
    handleChatMessage
};