import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type DonationFlowState = {
  confirmed: boolean;
  confirmedAmount: number | null;
};

type DonationFlowContextType = {
  state: DonationFlowState;
  confirm: (amount: number) => void;
  reset: () => void;
  setConfirmedAmount: (amount: number | null) => void;
};

const Context = createContext<DonationFlowContextType | null>(null);

export function DonationFlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DonationFlowState>({
    confirmed: false,
    confirmedAmount: null,
  });

  const confirm = useCallback((amount: number) => {
    setState({ confirmed: true, confirmedAmount: amount });
  }, []);

  const reset = useCallback(() => {
    setState({ confirmed: false, confirmedAmount: null });
  }, []);

  const setConfirmedAmount = useCallback((amount: number | null) => {
    setState(prev => ({ ...prev, confirmedAmount: amount }));
  }, []);

  return (
    <Context.Provider value={{ state, confirm, reset, setConfirmedAmount }}>
      {children}
    </Context.Provider>
  );
}

export function useDonationFlow() {
  const value = useContext(Context);
  if (!value) {
    throw new Error('useDonationFlow deve ser usado dentro de DonationFlowProvider');
  }
  return value;
}