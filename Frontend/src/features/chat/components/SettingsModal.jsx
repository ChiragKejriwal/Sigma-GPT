import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/settingsModal.css';

export default function SettingsModal({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  user,
  onOpenProfile,
  onLogout,
  onDeleteAccount,
  loading,
}) {
  const [activeTab, setActiveTab] = useState('general');
  const [language, setLanguage] = useState('auto');
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setActiveTab('general');
      setFeedback('');
      setFeedbackType('');
      setLanguage('auto');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const closeSettings = () => {
    setFeedback('');
    setFeedbackType('');
    onClose();
  };

  const handleLogoutClick = async () => {
    await onLogout();
    closeSettings();
    navigate('/login');
  };

  const handleDeleteClick = async () => {
    const confirmed = window.confirm('Delete your account permanently?');
    if (!confirmed) {
      return;
    }

    const result = await onDeleteAccount();
    if (result?.success) {
      closeSettings();
      navigate('/login');
      return;
    }

    setFeedback(result?.message || 'Account deletion failed');
    setFeedbackType('error');
  };

  const handleUpdateProfileClick = () => {
    closeSettings();
    onOpenProfile();
  };

  return (
    <div className="settingsOverlay" onClick={closeSettings}>
      <div className="settingsModal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="settingsClose" onClick={closeSettings} aria-label="Close settings">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <aside className="settingsSidebar">
          <button
            type="button"
            className={`settingsTab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <i className="fa-solid fa-gear"></i>
            <span>General</span>
          </button>
          <button
            type="button"
            className={`settingsTab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <i className="fa-regular fa-user"></i>
            <span>Account</span>
          </button>
        </aside>

        <section className="settingsContent">
          {activeTab === 'general' ? (
            <>
              <div className="settingsHeader">
                <h2>General</h2>
              </div>

              <div className="settingsCard">
                <div className="settingsCardIcon">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div className="settingsCardBody">
                  <h3>Secure your account</h3>
                  <p>Keep your account protected with stronger settings and quick access to the controls you need.</p>
                </div>
              </div>

              <div className="settingsRows">
                <div className="settingsRow">
                  <div>
                    <h4>Appearance</h4>
                  </div>
                  <button type="button" className="settingsValueButton" onClick={onToggleTheme}>
                    <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
                    <i className="fa-solid fa-chevron-down"></i>
                  </button>
                </div>

                <div className="settingsRow">
                  <div>
                    <h4>Language</h4>
                  </div>
                  <select className="settingsSelect" value={language} onChange={(event) => setLanguage(event.target.value)}>
                    <option value="auto">Auto detect</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="settingsRow">
                  <div>
                    <h4>Logout</h4>
                  </div>
                  <button type="button" className="settingsDangerButton" onClick={handleLogoutClick} disabled={loading}>
                    {loading ? 'Logging out...' : 'Log out'}
                  </button>
                </div>
              </div>

              {feedback && (
                <p className={`settingsFeedback ${feedbackType === 'error' ? 'error' : 'success'}`} role="status" aria-live="polite">
                  <i className={`fa-solid ${feedbackType === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
                  <span>{feedback}</span>
                </p>
              )}
            </>
          ) : (
            <>
              <div className="settingsHeader">
                <h2>Account</h2>
              </div>

              <div className="settingsRows accountRows">
                <div className="settingsRow plain">
                  <div>
                    <h4>Username</h4>
                  </div>
                  <p className="settingsStaticValue">{user?.username || '—'}</p>
                </div>

                <div className="settingsRow plain">
                  <div>
                    <h4>Email</h4>
                  </div>
                  <p className="settingsStaticValue">{user?.email || '—'}</p>
                </div>

                <div className="settingsRow">
                  <div>
                    <h4>Update profile</h4>
                  </div>
                  <button type="button" className="settingsPrimaryButton" onClick={handleUpdateProfileClick}>
                    Edit profile
                  </button>
                </div>

                <div className="settingsRow">
                  <div>
                    <h4>Delete account</h4>
                  </div>
                  <button type="button" className="settingsDangerButton" onClick={handleDeleteClick} disabled={loading}>
                    {loading ? 'Working...' : 'Delete account'}
                  </button>
                </div>
              </div>

              {feedback && (
                <p className={`settingsFeedback ${feedbackType === 'error' ? 'error' : 'success'}`} role="status" aria-live="polite">
                  <i className={`fa-solid ${feedbackType === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
                  <span>{feedback}</span>
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
