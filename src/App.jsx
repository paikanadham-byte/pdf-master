import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import PdfMerge from './components/PdfMerge';
import PdfTextExtract from './components/PdfTextExtract';
import PdfScanner from './components/PdfScanner';

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
        <div style={{
            backgroundColor: darkMode ? '#1a1a1a' : '#fff',
            color: darkMode ? '#fff' : '#000',
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif',
            width: '100vw',
            height: '100vh',
            display: 'flex'
        }}>
            <aside style={{
                width: 240,
                background: darkMode ? '#222' : '#f5f5f5',
                padding: '32px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                borderRight: '1px solid #ccc',
                height: '100vh',
                boxSizing: 'border-box'
            }}>
                <button onClick={() => setActiveTool('upload')}>PDF Upload</button>
                <button onClick={() => setActiveTool('merge')}>PDF Merge</button>
                <button onClick={() => setActiveTool('extract')}>Extract Text</button>
                <button onClick={() => setActiveTool('scanner')}>PDF Scanner (Camera or Image)</button>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    style={{ marginTop: 40 }}
                >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </aside>
            <main style={{
                flex: 1,
                padding: 0,
                margin: 0,
                minHeight: '100vh',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <header style={{
                    padding: '24px 40px 12px 40px',
                    background: darkMode ? '#181818' : '#fff',
                    borderBottom: '1px solid #eee'
                }}>
                    <h1 style={{ margin: 0 }}>PDF Master — Free PDF Tools</h1>
                </header>
                <div style={{
                    flex: 1,
                    padding: 40,
                    overflow: 'auto'
                }}>
                    {content}
                </div>
            </main>
        </div>
    );
}
