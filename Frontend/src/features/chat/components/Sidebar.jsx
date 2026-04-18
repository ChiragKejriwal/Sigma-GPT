import '../style/sidebar.css';
import { v1 as uuidv1 } from 'uuid';
import blackLogo from '../../../assets/blacklogo.png';
import { useChat } from '../hooks/useChat';
import { fetchThreadMessages, fetchThreads, removeThread } from '../services/chat.api.js';
import { useEffect } from 'react';

export default function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useChat();

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

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img className="logo" src={blackLogo} alt="SigmaGPT" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.map((thread, idx) => (
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

      <div className="sign">
        <p>Made By Chirag ❤️</p>
      </div>
    </section>
  );
}
