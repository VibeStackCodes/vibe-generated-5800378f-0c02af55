import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <section className="px-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow p-6 md:p-8 mb-6 flex flex-col md:flex-row md:items-center md:gap-6">
        <div className="md:flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">CalcFlow — Fast, Reliable No-code/Low-code Calculators</h1>
          <p className="text-gray-700 mb-4">Build domain-specific calculators with a drag-and-drop builder, switch between Standard and Scientific modes, plot 2D graphs, and embed with enterprise-grade APIs.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/builder" className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700">Launch Builder</Link>
            <Link to="/graph" className="px-4 py-2 border border-primary text-primary rounded hover:bg-blue-50">See Graphs</Link>
          </div>
        </div>
        <div className="md:w-1/3 mt-4 md:mt-0 self-center" aria-label="Hero visual" role="img">
          <div className="w-full h-40 bg-gradient-to-tr from-blue-100 to-blue-200 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded border border-gray-200 bg-white">
          <h3 className="text-lg font-semibold mb-2">Features</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>Two-mode Math Engine with 60+ functions</li>
            <li>Drag-and-drop Builder with versioned templates</li>
            <li>2D Graphing with export options</li>
            <li>Developer Library & Embeddable SDKs</li>
            <li>WCAG 2.1 AA accessibility baked-in</li>
          </ul>
        </div>
        <div className="p-4 rounded border border-gray-200 bg-white">
          <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
          <p className="text-sm text-gray-700">Open the Builder to create domain-specific calculators, switch modes seamlessly, and view history without losing data across sessions.</p>
        </div>
      </div>
    </section>
  );
};
