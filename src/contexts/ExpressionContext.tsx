import React, { createContext, useContext, useMemo, useState } from 'react';

export type Mode = 'standard' | 'scientific';

type HistoryItem = {
  expr: string;
  result: number;
  timestamp: number;
};

type ContextValue = {
  tokens: string[];
  setTokens: (t: string[]) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
};

const ExpressionContext = createContext<ContextValue | undefined>(undefined);

export const useExpression = (): ContextValue => {
  const c = useContext(ExpressionContext);
  if (!c) throw new Error('useExpression must be used within ExpressionProvider');
  return c;
};

export const ExpressionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default expression represents a simple parabola in tokens: x ^ 2
  const [tokens, setTokens] = useState<string[]>(['x', '^', '2']);
  const [mode, setMode] = useState<Mode>('scientific');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addHistory = (item: HistoryItem) => {
    setHistory((h) => [item, ...h]);
  };

  const value = useMemo<ContextValue>(() => ({ tokens, setTokens, mode, setMode, history, addHistory }), [tokens, mode, history]);

  return <ExpressionContext.Provider value={value}>{children}</ExpressionContext.Provider>;
};
