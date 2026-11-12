import { createContext, useContext, useState, type ReactNode } from 'react';
import { router } from 'expo-router';
import { findCredential, getPersonById, type Person, type Credential, type AccessProfile } from './people';

export type AuthSession = {
  person: Person;
  credential: Credential;
  profile: AccessProfile;
} | null;

export type AuthPermissions = {
  canReadPlaybook: boolean;
  canWritePlaybook: boolean;
  canReadProjects: boolean;
  canWriteTransitions: boolean;
  canAdminister: boolean;
};

const PERMISSIONS: Record<AccessProfile, AuthPermissions> = {
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

type AuthContextType = {
  session: AuthSession;
  permissions: AuthPermissions | null;
  login: (login: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
};

const Context = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>(null);
  const [isLoading, setIsLoading] = useState(true);

  const permissions = session ? PERMISSIONS[session.profile] : null;

  const login = (loginInput: string, password: string) => {
    const trimmedLogin = loginInput.trim();
    const trimmedPassword = password.trim();

    if (!trimmedLogin || !trimmedPassword) {
      return { success: false, error: 'Preencha login e senha.' };
    }

    const credential = findCredential(trimmedLogin, trimmedPassword);
    if (!credential) {
      return { success: false, error: 'Credenciais inválidas. Verifique login e senha.' };
    }

    const person = getPersonById(credential.personId);
    if (!person) {
      return { success: false, error: 'Pessoa não encontrada.' };
    }

    setSession({ person, credential, profile: credential.profile });
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setSession(null);
    router.replace('/member/enter');
  };

  return (
    <Context.Provider value={{ session, permissions, login, logout, isLoading }}>
      {children}
    </Context.Provider>
  );
}

export function useAuth() {
  const value = useContext(Context);
  if (!value) throw new Error('AuthProvider ausente.');
  return value;
}

export function useSession() {
  const { session } = useAuth();
  return session;
}

export function usePermissions() {
  const { permissions } = useAuth();
  return permissions ?? {
    canReadPlaybook: false,
    canWritePlaybook: false,
    canReadProjects: false,
    canWriteTransitions: false,
    canAdminister: false,
  };
}