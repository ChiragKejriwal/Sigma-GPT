import './app.css';
import ChatWindow from './ChatWindow.jsx';
import Sidebar from './Sidebar.jsx';
import { MyContext } from './MyContext.jsx';
import { useState  , useEffect} from 'react';
import {v1 as uuidv1} from 'uuid';

export function App() {
  let [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const [currThreadId, setCurrThreadId] =useState(uuidv1());
  const [prevChats, setPrevChats]= useState([]);// stores all chats of curr thread
  const [newChat, setNewChat]= useState(true);
  const [allThreads, setAllThreads]=useState([]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const providerValues = {
    prompt,setPrompt,
    reply,setReply,
    currThreadId,setCurrThreadId,
    newChat,setNewChat,
    prevChats,setPrevChats,
    allThreads,setAllThreads,
    theme,
    toggleTheme,
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <div className="main">
        <MyContext.Provider value={providerValues}>
          <Sidebar />
          <ChatWindow />
        </MyContext.Provider>
      </div>
    </>
  )
}
