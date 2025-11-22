import React, { useMemo, useState } from 'react';
import { evaluateTokens } from '../lib/mathEvaluator.ts';
import { useExpression } from '../contexts/ExpressionContext.tsx';

export const GraphPage: React.FC = () => {
  const { tokens, mode } = useExpression();
  const [minX, setMinX] = useState<number>(-10);
  const [maxX, setMaxX] = useState<number>(10);
  const [points, setPoints] = useState<Array<{x: number, y: number}>>([]);

  const domain = useMemo(() => {
    const pts: Array<{x: number, y: number}> = [];
    const steps = 200;
    const range = maxX - minX;
    const step = range / steps;
    for (let i = 0; i <= steps; i++) {
      const x = minX + i * step;
      const res = evaluateTokens(tokens, x, mode);
      const y = res.result ?? NaN;
      pts.push({ x, y: Number.isFinite(y) ? y : NaN as number });
    }
    return pts;
  }, [tokens, minX, maxX, mode]);

  React.useEffect(() => {
    const pts = domain;
    setPoints(pts);
  }, [domain]);

  const exportCSV = () => {
    const header = 'x,y\n';
    const rows = points.map(p => `${p.x},${p.y}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'graph.csv';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  // Simple path for SVG
  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    // Normalize to viewBox width 800 etc; we'll map x domain to range [0,800]
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minXv = Math.min(...xs);
    const maxXv = Math.max(...xs);
    const minYv = Math.min(...ys.filter(v => Number.isFinite(v)) as number[]);
    const maxYv = Math.max(...ys.filter(v => Number.isFinite(v)) as number[]);
    const w = 800, h = 320;
    const toX = (x: number) => ((x - minXv) / (maxXv - minXv)) * w;
    const toY = (y: number) => isFinite(y) ? h - ((y - minYv) / (maxYv - minYv)) * h : h/2;
    let d = '';
    points.forEach((p, idx) => {
      const x = toX(p.x);
      const y = toY(p.y);
      d += (idx === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
    });
    return d;
  }, [points]);

  return (
    <section className="px-4 py-6 max-w-6xl mx-auto">
      <div className="mb-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">2D Graph Visualization</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Domain</label>
          <input type="number" value={minX} onChange={e => setMinX(parseFloat(e.target.value))} className="w-20 px-2 py-1 border rounded" />
          <span className="px-1">to</span>
          <input type="number" value={maxX} onChange={e => setMaxX(parseFloat(e.target.value))} className="w-20 px-2 py-1 border rounded" />
          <button onClick={exportCSV} className="px-3 py-1 rounded bg-primary text-white">Export CSV</button>
        </div>
      </div>
      <div className="border border-gray-200 bg-white rounded-md p-2 overflow-auto" style={{ maxHeight: '420px' }} aria-label="Graph canvas">
        <svg width={800} height={320} viewBox={`0 0 800 320`} role="img" aria-label="Graph">
          <defs>
            <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <rect x={0} y={0} width={800} height={320} fill="#ffffff" />
          <path d={pathD} fill="none" stroke="#003d82" strokeWidth={2} />
        </svg>
      </div>
      <div className="mt-2 text-sm text-gray-700">Domain: [{minX}, {maxX}]</div>
    </section>
  );
};
