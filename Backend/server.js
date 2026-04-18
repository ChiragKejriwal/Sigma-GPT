import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', chatRoutes);

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to Database");
    }catch(error){
        console.error("Database connection error:",error);
    }
}

app.listen(8080, () => {
    console.log('Server is running on port 8080');
    connectDb();
});

// app.get('/test', async (req, res) => {
//     // const ai = new GoogleGenAI({
//     //     apiKey: process.env.GEMINI_API_KEY,
//     // });
//     // try {
//     //     const response = await ai.models.generateContent({
//     //         model: "gemini-2.5-flash",
//     //         contents: "Give me a joke about programming.",
//     //     });
//     //     console.log('Generated content:', response.text);
//     //     res.json(response.text);
//     // }catch (error) {
//     //     console.error('Error generating content:', error);
//     //     res.status(500).send('Error generating content');
//     // }   
// });
