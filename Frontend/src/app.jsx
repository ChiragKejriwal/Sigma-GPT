import './style.css';
import { AuthProvider } from './features/auth/auth.context.jsx';
import { ChatProvider } from './features/chat/chat.context.jsx';
import { AppRoutes } from './app.routes.jsx';
import { RouterProvider } from 'react-router-dom';

export function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <RouterProvider router={AppRoutes} />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
