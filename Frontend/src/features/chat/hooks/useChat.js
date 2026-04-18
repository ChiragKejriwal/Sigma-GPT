import { useContext } from 'react';
import { MyContext } from '../chat.context.jsx';

export function useChat() {
  const context = useContext(MyContext);

  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  return context;
}
