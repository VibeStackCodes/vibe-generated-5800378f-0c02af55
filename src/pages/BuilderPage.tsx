import React, { useMemo } from 'react';
import { useExpression } from '../contexts/ExpressionContext.tsx';
import { evaluateTokens } from '../lib/mathEvaluator.ts';
import { Button } from '../components/ui/Button.tsx';
import { Link } from 'react-router-dom';

type Block = { label: string; value: string; disabled?: boolean };

const BLOCKS: Block[] = [
  { label: 'x', value: 'x' }, { label: 'π', value: 'pi' }, { label: 'e', value: 'e' },
  { label: '(', value: '(' }, { label: ')', value: ')' },
  { label: '+', value: '+' }, { label: '-', value: '-' }, { label: '*', value: '*' }, { label: '/', value: '/' }, { label: '^', value: '^' },
  { label: 'sin', value: 'sin' }, { label: 'cos', value: 'cos' }, { label: 'tan', value: 'tan' }, { label: 'log', value: 'log' }, { label: 'sqrt', value: 'sqrt' },
  { label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }
];

export const BuilderPage: React.FC = () => {
  const { tokens, setTokens, mode, setMode, history, addHistory } = useExpression();

  const onDragStart = (e: React.DragEvent, b: Block) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(b));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;
    try {
      const b: Block = JSON.parse(data);
      setTokens([...tokens, b.value]);
    } catch {
      // ignore invalid drag data
    }
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const expressionStr = useMemo(() => tokens.join(' '), [tokens]);

  const onClear = () => setTokens([]);

  const onEvaluate = () => {
    const res = evaluateTokens(tokens, 0, mode);
    if (res.error) {
      // simple alert for accessibility: show as inline message
      console.warn(res.error);
      return;
    }
    if (res.result !== null) {
      addHistory({ expr: expressionStr, result: res.result, timestamp: Date.now() });
    }
  };

  return (
    <section className="px-4 py-6 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-4">
        <aside className="w-full lg:w-1/4 bg-white border border-gray-200 rounded-md p-3 shadow-sm">
          <div className="mb-2 font-semibold text-sm text-gray-700">Mode</div>
          <div className="flex gap-2 mb-3" role="group" aria-label="Mode switch">
            <button
              className={`px-3 py-2 rounded-md text-sm ${mode === 'standard' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setMode('standard')}
            >Standard</button>
            <button
              className={`px-3 py-2 rounded-md text-sm ${mode === 'scientific' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setMode('scientific')}
            >Scientific</button>
          </div>
          <div className="text-xs text-gray-500">Tip: Drag blocks into the canvas to build an expression like x ^ 2 + sin(x).</div>
        </aside>
        <main className="flex-1 bg-white border border-gray-200 rounded-md p-3 min-h-[420px]" onDrop={onDrop} onDragOver={onDragOver} aria-label="Formula Builder Canvas">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Formula Builder</div>
            <Link to="/graph" className="text-sm text-primary">Graph View</Link>
          </div>
          <div className="h-40 border rounded-md mb-2 p-2 overflow-auto" aria-label="Drop area">
            {tokens.length === 0 && <div className="text-sm text-gray-500 p-2">Drop blocks here to build your expression</div>}
            <div className="flex flex-wrap gap-2 items-center">
              {tokens.map((t, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-sm">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button onClick={onEvaluate} ariaLabel="Evaluate expression" className="bg-primary text-white">Evaluate</Button>
            <Button onClick={onClear} ariaLabel="Clear expression" className="bg-gray-200 text-gray-800">Clear</Button>
            <span className="ml-auto text-sm text-gray-600">Expression: {expressionStr || '(empty)'}</span>
          </div>
        </main>
        <section className="w-full lg:w-1/4 bg-white border border-gray-200 rounded-md p-3 h-full">
          <div className="font-semibold mb-2">Block Palette</div>
          <div className="grid grid-cols-2 gap-2" aria-label="Palette">
            {BLOCKS.map((b) => (
              <div key={b.value} draggable onDragStart={(e) => onDragStart(e, b)} className={`cursor-move select-none px-2 py-1 rounded text-sm border ${b.value === '(' || b.value === ')' ? 'border-dashed' : 'border-gray-200'}`} aria-label={`Block ${b.label}`}>
                {b.label}
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-500">Notes: In Standard mode, only arithmetic operators are allowed. Scientific mode unlocks sin/cos/tan/log/sqrt.</div>
          <div className="mt-4 text-xs text-gray-500">History: {history.length} items</div>
          <div aria-live="polite" className="mt-2 h-20 overflow-auto text-xs text-gray-700">
            {history.length === 0 && <div className="text-gray-400">No history yet.</div>}
            {history.map((h, i) => (
              <div key={i} className="mb-1">{new Date(h.timestamp).toLocaleTimeString()} — {h.expr} = {h.result.toFixed(4)}</div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};
