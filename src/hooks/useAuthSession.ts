import { useState, useEffect, useCallback } from 'react';
import { User } from '../types/logbook';
import { dbEngine } from '../services/mysqlEngine';

const SESSION_USER_ID_KEY = 'kominfo_session_user_id';

export function useAuthSession() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load active session
  const refreshUsersAndSession = useCallback(() => {
    const allUsers = dbEngine.getAllUsers();
    setAvailableUsers(allUsers);

    const savedSessionUserId = sessionStorage.getItem(SESSION_USER_ID_KEY);
    if (savedSessionUserId) {
      const parsedId = parseInt(savedSessionUserId, 10);
      const matched = allUsers.find((u) => u.id === parsedId);
      if (matched) {
        setCurrentUser(matched);
      } else if (allUsers.length > 0) {
        // Fallback to first user
        setCurrentUser(allUsers[0]);
        sessionStorage.setItem(SESSION_USER_ID_KEY, String(allUsers[0].id));
      } else {
        setCurrentUser(null);
      }
    } else {
      // Default to User #1 (Budi Pratama) for instant exploration
      if (allUsers.length > 0) {
        setCurrentUser(allUsers[0]);
        sessionStorage.setItem(SESSION_USER_ID_KEY, String(allUsers[0].id));
      } else {
        setCurrentUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshUsersAndSession();
    const unsubscribe = dbEngine.subscribe(() => {
      refreshUsersAndSession();
    });
    return () => unsubscribe();
  }, [refreshUsersAndSession]);

  const loginOrRegister = (username: string, nomorTelepon: string) => {
    const res = dbEngine.processLoginRegister(username, nomorTelepon);
    if (res.success && res.user) {
      sessionStorage.setItem(SESSION_USER_ID_KEY, String(res.user.id));
      setCurrentUser(res.user);
    }
    return res;
  };

  const loginUser = (identifier: string, password?: string) => {
    const res = dbEngine.loginUser(identifier, password);
    if (res.success && res.user) {
      sessionStorage.setItem(SESSION_USER_ID_KEY, String(res.user.id));
      setCurrentUser(res.user);
    }
    return res;
  };

  const registerIntern = (data: Parameters<typeof dbEngine.registerIntern>[0]) => {
    const res = dbEngine.registerIntern(data);
    if (res.success && res.user) {
      sessionStorage.setItem(SESSION_USER_ID_KEY, String(res.user.id));
      setCurrentUser(res.user);
    }
    return res;
  };

  const switchUser = (userId: number) => {
    const target = availableUsers.find((u) => u.id === userId);
    if (target) {
      sessionStorage.setItem(SESSION_USER_ID_KEY, String(target.id));
      setCurrentUser(target);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_USER_ID_KEY);
    setCurrentUser(null);
  };

  return {
    currentUser,
    availableUsers,
    isLoading,
    loginOrRegister,
    loginUser,
    registerIntern,
    switchUser,
    logout,
  };
}
