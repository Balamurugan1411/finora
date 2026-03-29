import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for guest user in localStorage on mount
    const guestUser = localStorage.getItem('finora_guest_user');
    if (guestUser) {
      setUser(JSON.parse(guestUser));
      setLoading(false);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        localStorage.removeItem('finora_guest_user');
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('finora_guest_user');
    setUser(null);
    setSession(null);
  };

  const signInAsGuest = () => {
    const guestId = `guest-${Math.random().toString(36).substring(2, 9)}`;
    const mockUser = {
      id: guestId,
      email: `${guestId}@finora.ai`,
      user_metadata: { full_name: 'Guest User' },
    } as any;
    localStorage.setItem('finora_guest_user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, signInAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
