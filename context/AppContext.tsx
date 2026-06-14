import { createContext, useContext, useState, ReactNode } from 'react';
import { AnalysisResult } from '@/lib/mockData';

type AppState = {
  photo: string | null;
  workTypeId: string | null;
  result: AnalysisResult | null;
  setPhoto: (photo: string | null) => void;
  setWorkTypeId: (id: string | null) => void;
  setResult: (result: AnalysisResult | null) => void;
  reset: () => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [workTypeId, setWorkTypeId] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  function reset() {
    setPhoto(null);
    setWorkTypeId(null);
    setResult(null);
  }

  return (
    <AppContext.Provider value={{ photo, workTypeId, result, setPhoto, setWorkTypeId, setResult, reset }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
