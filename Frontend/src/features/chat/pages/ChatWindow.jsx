import '../style/chatWindow.css';
import { useEffect, useRef, useState } from 'react';
import { ScaleLoader } from 'react-spinners';
import Chat from './Chat.jsx';
import SettingsModal from '../components/SettingsModal.jsx';
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
    prevChats,
    newChat,
  } = useChat();
  const { user, handleLogout, handleUpdateProfile, handleDeleteAccount, authError, setAuthError, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileMessageType, setProfileMessageType] = useState('');
  const profileMenuRef = useRef(null);
  const hasMessages = prevChats.length > 0;
  const showEmptyState = newChat && !hasMessages;

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

  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user, isProfileModalOpen]);

  const handleProfileClick = () => {
    setProfileMessage('');
    setProfileMessageType('');
    setAuthError('');
    setIsOpen(false);
    setIsProfileModalOpen(true);
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    setIsSettingsModalOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setProfileMessageType('');
    setProfileMessage('');
    setAuthError('');
    setProfileForm((current) => ({
      ...current,
      password: '',
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileMessage('');
    setAuthError('');

    const result = await handleUpdateProfile(profileForm);

    if (result?.success) {
      setProfileMessage('Profile updated successfully');
      setProfileMessageType('success');
      setProfileForm((current) => ({
        ...current,
        password: '',
      }));
    } else {
      setProfileMessage(result?.message || authError || 'Profile update failed');
      setProfileMessageType('error');
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

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
        <span className="brand">
          SigmaGPT<i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="theme-and-profile" ref={profileMenuRef}>
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          <button
            type="button"
            className="userIcon"
            onClick={() => setIsOpen((current) => !current)}
            aria-label="Open account menu"
            aria-expanded={isOpen}
          >
            <i className="fa-solid fa-user"></i>
          </button>
          {isOpen && (
            <div className="dropDown" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i>
            <span>Upgrade Plan</span>
          </button>
          <button type="button" className="dropDownItem" onClick={handleSettingsClick}>
            <i className="fa-solid fa-gear"></i>
            <span>Settings</span>
          </button>
          <button type="button" className="dropDownItem" onClick={handleProfileClick}>
            <i className="fa-solid fa-circle-user"></i>
            <span>Profile</span>
          </button>
          <button type="button" className="dropDownItem danger" onClick={onLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Log Out</span>
          </button>
            </div>
          )}
        </div>
      </div>
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
        theme={theme}
        onToggleTheme={toggleTheme}
        user={user}
        onOpenProfile={handleProfileClick}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        loading={authLoading}
      />
      {isProfileModalOpen && (
        <div className="profileModalOverlay" onClick={closeProfileModal}>
          <div className="profileModal" onClick={(event) => event.stopPropagation()}>
            <div className="profileModalHeader">
              <div>
                <h2>Edit profile</h2>
                <p>Update your account information</p>
              </div>
              <button type="button" className="profileModalClose" onClick={closeProfileModal} aria-label="Close profile modal">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form className="profileForm" onSubmit={handleProfileSubmit}>
              <div className="profileAvatarWrap">
                <div className="profileAvatar">
                  {(profileForm.username || user?.username || 'U')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
              </div>

              <label className="profileField">
                <span>Display name</span>
                <input
                  type="text"
                  value={profileForm.username}
                  onChange={(event) => {
                    setProfileForm((current) => ({ ...current, username: event.target.value }));
                    setProfileMessage('');
                    setProfileMessageType('');
                    setAuthError('');
                  }}
                  placeholder="Enter display name"
                />
              </label>

              <label className="profileField">
                <span>Email</span>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(event) => {
                    setProfileForm((current) => ({ ...current, email: event.target.value }));
                    setProfileMessage('');
                    setProfileMessageType('');
                    setAuthError('');
                  }}
                  placeholder="Enter email address"
                />
              </label>

              <label className="profileField">
                <span>New password</span>
                <input
                  type="password"
                  value={profileForm.password}
                  onChange={(event) => {
                    setProfileForm((current) => ({ ...current, password: event.target.value }));
                    setProfileMessage('');
                    setProfileMessageType('');
                    setAuthError('');
                  }}
                  placeholder="Leave blank to keep current password"
                />
              </label>

              {(profileMessage || authError) && (
                <p className={`profileMessage ${profileMessageType === 'success' ? 'success' : 'error'}`} role="status" aria-live="polite">
                  <i className={`fa-solid ${profileMessageType === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                  <span>{profileMessage || authError}</span>
                </p>
              )}

              <p className="profileHint">Your profile helps people recognize you.</p>

              <div className="profileActions">
                <button type="button" className="secondaryButton" onClick={closeProfileModal}>
                  Cancel
                </button>
                <button type="submit" className="primaryButton" disabled={authLoading}>
                  {authLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEmptyState ? (
        <div className="emptyState">
          <div className="emptyStateCopy">
            <h1>What&apos;s on the agenda today?</h1>
          </div>
          <div className="chatInput chatInputEmpty">
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
      ) : (
        <>
          <div className="chatBody">
            <Chat />
            <div className="loaderWrap">
              <ScaleLoader color="#fff" loading={loading}></ScaleLoader>
            </div>
          </div>
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
        </>
      )}
    </div>
  );
}
