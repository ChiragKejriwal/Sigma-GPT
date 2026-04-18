import { createBrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Protected from './features/auth/components/Protected.jsx';
import Login from './features/auth/pages/Login.jsx';
import Register from './features/auth/pages/Register.jsx';
import Sidebar from './features/chat/components/Sidebar.jsx';
import ChatWindow from './features/chat/pages/ChatWindow.jsx';

function ChatLayout() {
  return (
    <div className="main">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export const AppRoutes = createBrowserRouter([
    {
        path: "/Login",
        element: <Login/>
    },
    {
        path: "/Register",
        element: <Register/>
    },
    {
        path: "/",
        element: 
        <Protected>
            <ChatLayout/>
        </Protected>
    }
]);

