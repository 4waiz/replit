import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AnalysisResult } from '@/lib/agentEngine';
import { Weather, fetchWeather, DEMO_WEATHER } from '@/lib/weatherService';

type AppState = {
  photo: string | null;
  workTypeId: string | null;
  result: AnalysisResult | null;
  weather: Weather;
  weatherLoading: boolean;
  setPhoto: (photo: string | null) => void;
  setWorkTypeId: (id: string | null) => void;
  setResult: (result: AnalysisResult | null) => void;
  refreshWeather: () => Promise<Weather>;
  reset: () => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [workTypeId, setWorkTypeId] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [weather, setWeather] = useState<Weather>(DEMO_WEATHER);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);

  async function refreshWeather(): Promise<Weather> {
    setWeatherLoading(true);
    const w = await fetchWeather();
    setWeather(w);
    setWeatherLoading(false);
    return w;
  }

  // Warm up live weather as soon as the app wakes.
  useEffect(() => {
    refreshWeather();
  }, []);

  function reset() {
    setPhoto(null);
    setWorkTypeId(null);
    setResult(null);
  }

  return (
    <AppContext.Provider
      value={{
        photo,
        workTypeId,
        result,
        weather,
        weatherLoading,
        setPhoto,
        setWorkTypeId,
        setResult,
        refreshWeather,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
