import React, { useState } from 'react';
import FileUpload from './components/FileUpload';

export default function App() {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div style={{
            backgroundColor: darkMode ? '#1a1a1a' : '#fff',
            color: darkMode ? '#fff' : '#000',
            minHeight: '100vh',
            padding: 24,
            fontFamily: 'Arial, sans-serif',
            maxWidth: 900,
            margin: 'auto'
        }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>PDF Master — Complete MVP</h1>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    style={{ padding: '6px 12px', cursor: 'pointer' }}
                >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </header>

            <FileUpload />
        </div>
    );
}
