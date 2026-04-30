import { useContext, useEffect } from 'react';
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout, getMe, updateProfile, deleteAccount } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading, authError, setAuthError } = context;

  const getErrorMessage = (error, fallback) => {
    return error?.response?.data?.message || error?.message || fallback;
  };

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setAuthError('');
    try {
      const data = await login({ email, password });
      if (!data?.user) {
        throw new Error('Login failed');
      }

      setUser(data.user);
      return { success: true, data };
    } catch (error) {
      const message = getErrorMessage(error, 'Invalid email or password');
      setAuthError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    setAuthError('');
    try {
      const data = await register({ username, email, password });
      if (!data?.user) {
        throw new Error('Registration failed');
      }

      setUser(data.user);
      return { success: true, data };
    } catch (error) {
      const message = getErrorMessage(error, 'Registration failed');
      setAuthError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async ({ username, email, password }) => {
    setLoading(true);
    setAuthError('');
    try {
      const data = await updateProfile({ username, email, password });
      if (!data?.user) {
        throw new Error('Profile update failed');
      }

      setUser(data.user);
      return { success: true, data };
    } catch (error) {
      const message = getErrorMessage(error, 'Profile update failed');
      setAuthError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setAuthError('');
    try {
      const data = await deleteAccount();
      setUser(null);
      return { success: true, data };
    } catch (error) {
      const message = getErrorMessage(error, 'Account deletion failed');
      setAuthError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data?.user ?? null);
      } catch (error) {
        setUser(null);
        if (error?.response?.status !== 401) {
          console.error('Error fetching user:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    loading,
    authError,
    setAuthError,
    handleLogin,
    handleRegister,
    handleLogout,
    handleUpdateProfile,
    handleDeleteAccount,
  };
};
