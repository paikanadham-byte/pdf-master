import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function FileUpload() {
    const [file, setFile] = useState(null);

    return (
        <div style={{ marginTop: 20 }}>
            <div
                onDrop={e => {
                    e.preventDefault();
                    if (e.dataTransfer.files.length > 0) {
                        setFile(e.dataTransfer.files[0]);
                    }
                }}
                onDragOver={e => e.preventDefault()}
                onClick={() => document.getElementById('fileInput').click()}
                style={{
                    border: '2px dashed #aaa',
                    padding: 40,
                    textAlign: 'center',
                    borderRadius: 6,
                    cursor: 'pointer',
                    color: '#555',
                }}
            >
                {file ? file.name : 'Drag & drop a PDF here or click to select'}
                <input
                    id="fileInput"
                    type="file"
                    accept="application/pdf"
                    onChange={e => setFile(e.target.files[0])}
                    style={{ display: 'none' }}
                />
            </div>

            {file && (
                <div style={{ border: '1px solid #ccc', borderRadius: 4, marginTop: 20, padding: 8 }}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                        <Viewer fileUrl={URL.createObjectURL(file)} />
                    </Worker>
                </div>
            )}
        </div>
    );
}
