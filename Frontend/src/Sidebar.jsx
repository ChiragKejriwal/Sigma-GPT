import './public/Sidebar.css';
import { useContext, useEffect } from 'react';
import  {MyContext}  from './MyContext.jsx';
import {v1 as uuidv1} from 'uuid'

export default function Sidebar(){
    const {allThreads,setAllThreads , currThreadId, setNewChat,setPrompt,setReply,setCurrThreadId, setPrevChats}= useContext(MyContext);

    const getAllThreads = async()=>{
        try{
            const response = await fetch("http://localhost:8080/api/threads");
            const res = await response.json();

            const filterData =res.map(thread=> ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filterData);


        }catch(err){
            console.log(err);
        }
    };

    useEffect(()=>{
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () =>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread=async(newThreadId)=>{

        setCurrThreadId(newThreadId);

        try{
            const response = await fetch(`http://localhost:8080/api/threads/${newThreadId}`);
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        }catch(err){
            console.log(err);
        }
    }

    const deleteThread = async(threadId)=>{
        try{
            const response = await fetch(`http://localhost:8080/api/threads/${threadId}`,{method: "DELETE"});
            const res =await response.json();
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId) );
            if(threadId=== currThreadId){
                createNewChat();
            }
        }catch(err){
            console.log(err);
        }
    }

    return (
        <section className='sidebar'>
            {/* New Chat  Button */}
            <button onClick={createNewChat}>
                <img className="logo" src="src/assets/blacklogo.png" alt="SigmaGPT" />
                <span><i class="fa-solid fa-pen-to-square"></i></span>
            </button>

            {/* Sidebar History */}

            <ul className='history'>
                {
                    allThreads?.map((thread,idx)=>(
                        <li key={idx} onClick={(e)=>changeThread(thread.threadId)}
                            className={thread.threadId===currThreadId?"highlighted":""}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash"
                            onClick={(e)=>{
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}> </i>
                        </li>
                    ))
                }
            </ul>

            {/* Footer */}
            <div className="sign">
                <p>Made By Chirag ❤️</p>
            </div>
        </section>
    )
};