import { createContext, useContext, useState, type ReactNode } from 'react';

export type DemoProfile = 'Voluntário' | 'Coordenação';

export type DemoPermissions = {
  canReadPlaybook: boolean;
  canWritePlaybook: boolean;
  canReadProjects: boolean;
  canWriteTransitions: boolean;
  canAdminister: boolean;
};

const PERMISSIONS: Record<DemoProfile, DemoPermissions> = {
  Voluntário: {
    canReadPlaybook: true,
    canWritePlaybook: true,
    canReadProjects: true,
    canWriteTransitions: true,
    canAdminister: false,
  },
  Coordenação: {
    canReadPlaybook: true,
    canWritePlaybook: true,
    canReadProjects: true,
    canWriteTransitions: true,
    canAdminister: true,
  },
};

type DemoAccess = {
  profile: DemoProfile | null;
  permissions: DemoPermissions | null;
  selectProfile: (profile: DemoProfile | null) => void;
};

const Context = createContext<DemoAccess | null>(null);

export function DemoAccessProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<DemoProfile | null>(null);
  const permissions = profile ? PERMISSIONS[profile] : null;

  const selectProfile = (newProfile: DemoProfile | null) => {
    setProfile(newProfile);
  };

  return (
    <Context.Provider value={{ profile, permissions, selectProfile }}>
      {children}
    </Context.Provider>
  );
}

export function useDemoAccess() {
  const value = useContext(Context);
  if (!value) throw new Error('DemoAccessProvider ausente.');
  return value;
}

export function usePermissions() {
  const { permissions } = useDemoAccess();
  return permissions ?? {
    canReadPlaybook: false,
    canWritePlaybook: false,
    canReadProjects: false,
    canWriteTransitions: false,
    canAdminister: false,
  };
}