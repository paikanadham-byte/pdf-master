import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function PdfMerge() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [mergedUrl, setMergedUrl] = useState(null);

  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    setFiles(newFiles);
    setMessage('');
    setMergedUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setMessage('Please select at least 2 PDF files.');
      return;
    }

    const mergedPdf = await PDFDocument.create();

    for (let file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    setMergedUrl(URL.createObjectURL(blob));
    setMessage('PDFs merged successfully!');
  };

  return (
    <div>
      <h2>Merge PDFs</h2>
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFilesChange}
      />
      <button className="btn" onClick={handleMerge} disabled={files.length < 2} style={{ marginLeft: 14 }}>
        Merge
      </button>
      {message && <p style={{ marginTop: 15 }}>{message}</p>}
      {mergedUrl &&
        <div style={{ marginTop: 22 }}>
          <a className="btn" href={mergedUrl} download="merged.pdf">Download Merged PDF</a>
        </div>
      }
    </div>
  );
}
