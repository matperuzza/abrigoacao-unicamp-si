import { createContext, useContext, useState, type ReactNode } from 'react';

export type DemoProfile = 'Voluntário' | 'Coordenação';
type DemoAccess = { profile: DemoProfile | null; selectProfile: (profile: DemoProfile | null) => void };
const Context = createContext<DemoAccess | null>(null);

export function DemoAccessProvider({ children }: { children: ReactNode }) {
  const [profile, selectProfile] = useState<DemoProfile | null>(null);
  return <Context.Provider value={{ profile, selectProfile }}>{children}</Context.Provider>;
}

export function useDemoAccess() {
  const value = useContext(Context);
  if (!value) throw new Error('DemoAccessProvider ausente.');
  return value;
}
