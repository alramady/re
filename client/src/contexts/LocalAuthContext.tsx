import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface LocalAdminInfo {
  id: number;
  username: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  role: string;
  avatar: string | null;
}

interface LocalAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: LocalAdminInfo | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const LOCAL_AUTH_KEY = 'rased_local_auth';

// Hardcoded admin accounts
const ADMIN_ACCOUNTS: Record<string, { password: string; info: LocalAdminInfo }> = {
  'MRUHAILY': {
    password: '15001500',
    info: {
      id: 1,
      username: 'MRUHAILY',
      displayName: 'Muhammed ALRuhaily',
      email: 'mruhaily@ndmo.gov.sa',
      phone: null,
      role: 'root',
      avatar: null,
    }
  },
  'aalrebdi': {
    password: '15001500',
    info: {
      id: 2,
      username: 'aalrebdi',
      displayName: 'Abdullah ALRebdi',
      email: 'aalrebdi@ndmo.gov.sa',
      phone: null,
      role: 'system_admin',
      avatar: null,
    }
  },
  'msarhan': {
    password: '15001500',
    info: {
      id: 3,
      username: 'msarhan',
      displayName: 'Mohammed Sarhan',
      email: 'msarhan@ndmo.gov.sa',
      phone: null,
      role: 'system_admin',
      avatar: null,
    }
  },
  'malmoutaz': {
    password: '15001500',
    info: {
      id: 4,
      username: 'malmoutaz',
      displayName: 'Mohammed ALMoutaz',
      email: 'malmoutaz@ndmo.gov.sa',
      phone: null,
      role: 'system_admin',
      avatar: null,
    }
  },
};

const LocalAuthContext = createContext<LocalAuthState | null>(null);

export function LocalAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<LocalAdminInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_AUTH_KEY);
      if (stored) {
        setAdmin(JSON.parse(stored));
      }
    } catch {}
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const account = ADMIN_ACCOUNTS[username];
    if (!account) {
      return { success: false, error: 'اسم المستخدم غير صحيح' };
    }
    if (account.password !== password) {
      return { success: false, error: 'كلمة المرور غير صحيحة' };
    }
    
    setAdmin(account.info);
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(account.info));
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    setAdmin(null);
    localStorage.removeItem(LOCAL_AUTH_KEY);
  }, []);

  const isAuthenticated = !!admin;

  return (
    <LocalAuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      admin,
      login,
      logout,
    }}>
      {children}
    </LocalAuthContext.Provider>
  );
}

export function useLocalAuth() {
  const ctx = useContext(LocalAuthContext);
  if (!ctx) throw new Error('useLocalAuth must be used within LocalAuthProvider');
  return ctx;
}
