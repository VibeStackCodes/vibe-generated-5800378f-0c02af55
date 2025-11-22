import React from 'react';

export const APIPage: React.FC = () => {
  const snippet = `// Embeddable calculator snippet
import { CalcFlow } from 'calcflow-sdk';

const client = new CalcFlow.Client({ apiKey: 'YOUR_KEY' });
const calc = client.createCalculator({ templateId: '1234' });
calc.run({ input: { x: 5, y: 2 } }).then(result => console.log(result));`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      alert('Code snippet copied to clipboard');
    } catch {
      // ignore
    }
  };

  return (
    <section className="px-4 py-6 max-w-5xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Developer Library & Embedding</h3>
        <p className="text-sm text-gray-700 mb-3">Use the public API/SDK to embed calculators into your platform with branding and access controls.</p>
        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto" aria-label="Snippet">
{snippet}
        </pre>
        <button onClick={copy} className="mt-2 px-3 py-2 rounded bg-primary text-white">Copy Snippet</button>
      </div>
    </section>
  );
};
