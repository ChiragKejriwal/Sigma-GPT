import { createContext, useEffect, useMemo, useState } from 'react';
import { v1 as uuidv1 } from 'uuid';

export const MyContext = createContext(null);

export function ChatProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('');
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const providerValues = useMemo(
    () => ({
      prompt,
      setPrompt,
      reply,
      setReply,
      currThreadId,
      setCurrThreadId,
      newChat,
      setNewChat,
      prevChats,
      setPrevChats,
      allThreads,
      setAllThreads,
      theme,
      toggleTheme,
    }),
    [prompt, reply, currThreadId, newChat, prevChats, allThreads, theme]
  );

  return <MyContext.Provider value={providerValues}>{children}</MyContext.Provider>;
}
