import React, { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { PDFDocument, rgb } from 'pdf-lib';

export default function FileUpload() {
    const [files, setFiles] = useState([]); // For multiple PDFs (merge)
    const [file, setFile] = useState(null); // Current file to view
    const [scale, setScale] = useState(1.0);
    const [rotation, setRotation] = useState(0);
    const [annotations, setAnnotations] = useState([]); // {x, y, text}

    // Add new file
    const handleFile = (newFile) => {
        setFile(newFile);
        setScale(1.0);
        setRotation(0);
        setAnnotations([]);
        setFiles([newFile]);
    };

    // Merge PDFs
    const handleMerge = async () => {
        if (files.length < 2) return alert('Select 2 or more PDFs to merge');
        const mergedPdf = await PDFDocument.create();
        for (const f of files) {
            const arrayBuffer = await f.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }
        const mergedBytes = await mergedPdf.save();
        const blob = new Blob([mergedBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'merged.pdf';
        link.click();
    };

    // Split / extract pages
    const handleExtract = async (pageNumbers) => {
        if (!file) return;
        const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, pageNumbers);
        copiedPages.forEach(p => newPdf.addPage(p));
        const bytes = await newPdf.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'extracted.pdf';
        link.click();
    };

    // Text annotation overlay
    const handleAddAnnotation = () => {
        const text = prompt('Enter annotation text:');
        if (text) setAnnotations([...annotations, { x: 50, y: 50, text }]);
    };

    // Download PDF with annotations
    const handleDownload = async () => {
        if (!file) return;
        const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
        const pages = pdfDoc.getPages();
        annotations.forEach((ann) => {
            pages[0].drawText(ann.text, { x: ann.x, y: ann.y, size: 14, color: rgb(1, 0, 0) });
        });
        const bytes = await pdfDoc.save();
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'annotated.pdf';
        link.click();
    };

    return (
        <div style={{ marginTop: 20 }}>
            <div
                onDrop={e => {
                    e.preventDefault();
                    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
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
                    onChange={e => e.target.files.length && handleFile(e.target.files[0])}
                    style={{ display: 'none' }}
                    multiple
                />
            </div>

            {file && (
                <div>
                    {/* Controls */}
                    <div style={{ marginTop: 10, marginBottom: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button onClick={() => setRotation((rotation + 90) % 360)}>Rotate 90°</button>
                        <button onClick={() => setScale(scale + 0.25)}>Zoom In</button>
                        <button onClick={() => setScale(scale - 0.25)}>Zoom Out</button>
                        <button onClick={handleAddAnnotation}>Add Text</button>
                        <button onClick={handleDownload}>Download PDF</button>
                        <button onClick={handleMerge}>Merge PDFs</button>
                        <button onClick={() => handleExtract([0])}>Extract Page 1</button>
                    </div>

                    {/* PDF Viewer */}
                    <div style={{
                        border: '1px solid #ccc',
                        borderRadius: 4,
                        height: '80vh',
                        width: '100%',
                        overflow: 'auto'
                    }}>
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                            <Viewer
                                fileUrl={URL.createObjectURL(file)}
                                defaultScale={scale}
                                rotation={rotation}
                            />
                        </Worker>
                    </div>
                </div>
            )}
        </div>
    );
}
