import '../style/sidebar.css';
import { v1 as uuidv1 } from 'uuid';
import blackLogo from '../../../assets/blacklogo.png';
import whiteLogo from '../../../assets/whitelogo.png';
import { useChat } from '../hooks/useChat';
import { fetchThreadMessages, fetchThreads, removeThread } from '../services/chat.api.js';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] = useState(true);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    theme,
  } = useChat();

  const logoSrc = theme === 'light' ? whiteLogo : blackLogo;
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getAllThreads = async () => {
    try {
      const threads = await fetchThreads();
      const filterData = threads.map((thread) => ({ threadId: thread.threadId, title: thread.title }));
      setAllThreads(filterData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt('');
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const messages = await fetchThreadMessages(newThreadId);
      setPrevChats(messages);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      await removeThread(threadId);
      setAllThreads((prev) => prev.filter((thread) => thread.threadId !== threadId));
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    setSearchQuery('');
  };

  const closeSearch = () => {
    setIsSearchActive(false);
    setSearchQuery('');
  };

  // Filter threads based on search query
  const filteredThreads = isSearchActive 
    ? allThreads.filter(thread => 
        thread.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allThreads;

  const displayThreads = isSearchActive ? filteredThreads : allThreads;

  return (
    <section className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <img 
          className="logo" 
          src={logoSrc} 
          alt="SigmaGPT"
          onClick={!isSidebarOpen ? toggleSidebar : undefined}
          style={{ cursor: !isSidebarOpen ? 'pointer' : 'default' }}
        />
        {isSidebarOpen && (
          <button className="toggle-btn" onClick={toggleSidebar}>
            <i className="fa-solid fa-bars"></i>
          </button>
        )}
      </div>

      <div className="menu-section">
        <button className="menu-item new-chat-btn" onClick={createNewChat}>
          <i className="fa-regular fa-pen-to-square"></i>
          {isSidebarOpen && <span>New chat</span>}
        </button>
        <button className="menu-item search-btn" onClick={toggleSearch}>
          <i className="fa-solid fa-magnifying-glass"></i>
          {isSidebarOpen && <span>Search chats</span>}
        </button>
        <button className="menu-item more-btn" disabled>
          <i className="fa-solid fa-ellipsis"></i>
          {isSidebarOpen && <span>More</span>}
        </button>
      </div>

      {isSidebarOpen && isSearchActive && (
        <div className="search-box-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search chats"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="search-input"
            />
            <button 
              className="search-close-btn"
              onClick={closeSearch}
              aria-label="Close search"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}

      {isSidebarOpen && <div className="recents-header">Recents</div>}

      <ul className="history">
        {displayThreads?.map((thread, idx) => (
          <li
            key={idx}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? 'highlighted' : ''}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {isSidebarOpen && (
        <div className="sign">
          <p>Made By Chirag ❤️</p>
        </div>
      )}
      {!isSidebarOpen && (
        <div className="user-icon-closed">
          <div className="icon-circle">C</div>
        </div>
      )}
    </section>
  );
}
