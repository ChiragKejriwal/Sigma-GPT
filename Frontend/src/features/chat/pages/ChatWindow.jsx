import '../style/chatWindow.css';
import { useEffect, useState } from 'react';
import { ScaleLoader } from 'react-spinners';
import Chat from './Chat.jsx';
import { useChat } from '../hooks/useChat';
import { requestReply } from '../services/chat.api.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

export default function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    setNewChat,
    currThreadId,
    setPrevChats,
    theme,
    toggleTheme,
  } = useChat();
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);

    try {
      const geminiReply = await requestReply(prompt, currThreadId);
      setReply(geminiReply.response);
      console.log(geminiReply.response);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: 'user',
          content: prompt,
        },
        {
          role: 'assistant',
          content: reply,
        },
      ]);
    }

    setPrompt('');
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const onLogout = async () => {
    try {
      await handleLogout();
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          SigmaGPT<i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="theme-and-profile" onClick={handleProfileClick}>
          <span className="theme-toggle" onClick={toggleTheme}>
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </span>
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i>Settings
          </div>
          <div className="dropDownItem" onClick={onLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>Log Out
          </div>
        </div>
      )}
      <Chat />
      <ScaleLoader color="#fff" loading={loading}></ScaleLoader>
      <div className="chatInput">
        <div className="userInput">
          <input
            placeholder="Ask anything?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              e.key === 'Enter' ? getReply() : '';
            }}
          ></input>
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">SigmaGPT can make mistakes . Check important info .See Cookie Preferences.</p>
      </div>
    </div>
  );
}
