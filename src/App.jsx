import React, { useState } from 'react';
import FileUpload from './components/FileUpload';

export default function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [activeTool, setActiveTool] = useState('upload');

    // Placeholder components for new features
    function Scanner() {
        return <div>Scanner feature coming soon. (Integrate camera or file import for scanning PDF.)</div>;
    }
    function PdfEditor() {
        return <div>PDF Editor coming soon. (Tools for merging, splitting, rotating, etc.)</div>;
    }
    function FreeOptions() {
        return <div>More Free PDF tools coming soon. (e.g., compress, convert to Word, extract images, etc.)</div>;
    }

    let content;
    switch (activeTool) {
        case 'scanner':
            content = <Scanner />;
            break;
        case 'editor':
            content = <PdfEditor />;
            break;
        case 'free':
            content = <FreeOptions />;
            break;
        default:
            content = <FileUpload />;
    }

    return (
        <div style={{
            backgroundColor: darkMode ? '#1a1a1a' : '#fff',
            color: darkMode ? '#fff' : '#000',
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif',
            maxWidth: 1100,
            margin: 'auto',
            display: 'flex'
        }}>
            <aside style={{
                width: 220,
                background: darkMode ? '#222' : '#f5f5f5',
                padding: '24px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                borderRight: '1px solid #ccc'
            }}>
                <button onClick={() => setActiveTool('upload')}>PDF Upload</button>
                <button onClick={() => setActiveTool('scanner')}>PDF Scanner</button>
                <button onClick={() => setActiveTool('editor')}>PDF Editing Tools</button>
                <button onClick={() => setActiveTool('free')}>More Free Options</button>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    style={{ marginTop: 40 }}
                >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </aside>
            <main style={{ flex: 1, padding: 32 }}>
                <header style={{ marginBottom: 24 }}>
                    <h1>PDF Master — Sejda Free Features Clone</h1>
                </header>
                {content}
            </main>
        </div>
    );
}
