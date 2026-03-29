import { createContext, useContext, useState, type ReactNode } from 'react';

type Mode = 'beginner' | 'advanced';

interface SettingsContextType {
  mode: Mode;
  setMode: (m: Mode) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<Mode>('beginner');

  return (
    <SettingsContext.Provider value={{ mode, setMode }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
