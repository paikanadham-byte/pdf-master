import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import PdfMerge from './components/PdfMerge';
import PdfTextExtract from './components/PdfTextExtract';
import PdfScanner from './components/PdfScanner';
import './AppModern.css';

const tools = [
  { key: 'upload', label: 'PDF Upload', icon: '📄' },
  { key: 'merge', label: 'PDF Merge', icon: '➕' },
  { key: 'extract', label: 'Extract Text', icon: '📝' },
  { key: 'scanner', label: 'PDF Scanner', icon: '📷' }
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTool, setActiveTool] = useState('upload');

  let content;
  switch (activeTool) {
    case 'merge':
      content = <PdfMerge />;
      break;
    case 'extract':
      content = <PdfTextExtract />;
      break;
    case 'scanner':
      content = <PdfScanner />;
      break;
    default:
      content = <FileUpload />;
  }

  return (
    <div className={`app-root${darkMode ? ' dark' : ''}`}>
      <aside className="sidebar">
        <div className="logo-area">
          <span className="logo-emoji">📚</span>
          <span className="logo-text">PDF Master</span>
        </div>
        <nav>
          {tools.map(tool => (
            <button
              className={`sidebar-btn${activeTool === tool.key ? ' active' : ''}`}
              key={tool.key}
              onClick={() => setActiveTool(tool.key)}
            >
              <span className="sb-ico">{tool.icon}</span>
              {tool.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button 
            className="sidebar-btn"
            onClick={() => setDarkMode(dm => !dm)}
            aria-label="Toggle dark mode"
          >
            <span className="sb-ico">{darkMode ? '🌞' : '🌙'}</span>
            {darkMode ? 'Light' : 'Dark'} Mode
          </button>
          <div className="sidebar-credit">
            <span>By paikanadham-byte</span>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="main-header">
          <h1>Free PDF Tools</h1>
        </header>
        <section className="tool-card">
          {content}
        </section>
      </main>
    </div>
  );
}
