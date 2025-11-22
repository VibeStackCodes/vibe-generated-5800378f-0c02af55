import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { HomePage } from './pages/HomePage.tsx';
import { BuilderPage } from './pages/BuilderPage.tsx';
import { GraphPage } from './pages/GraphPage.tsx';
import { APIPage } from './pages/APIPage.tsx';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold">CalcFlow</span>
            <span className="text-sm opacity-90 hidden sm:inline">No-code/Low-code Calculator Studio</span>
          </div>
          <nav aria-label="Main" className="flex items-center gap-4">
            <Link to="/" className="px-3 py-2 rounded-md text-white hover:bg-blue-700">Home</Link>
            <Link to="/builder" className="px-3 py-2 rounded-md text-white hover:bg-blue-700">Builder</Link>
            <Link to="/graph" className="px-3 py-2 rounded-md text-white hover:bg-blue-700">Graph</Link>
            <Link to="/api" className="px-3 py-2 rounded-md text-white hover:bg-blue-700">API</Link>
          </nav>
        </div>
      </header>
      <main className="py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/api" element={<APIPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
