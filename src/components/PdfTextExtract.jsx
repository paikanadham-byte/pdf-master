cat > src/components/PdfTextExtract.jsx <<'EOF'
import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PdfTextExtract() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setText('');
      setMessage('');
    } else {
      setFile(null);
      setMessage('Please select a valid PDF file.');
    }
  };

  const extractText = async () => {
    if (!file) return;
    setLoading(true);
    setMessage('');
    setText('');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let extracted = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        extracted += content.items.map(item => item.str).join(' ') + '\\n\\n';
      }
      setText(extracted);
    } catch (err) {
      setMessage('Failed to extract text from PDF.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Extract Text from PDF</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      <button className="btn" onClick={extractText} disabled={!file || loading} style={{ marginLeft: 14 }}>
        Extract
      </button>
      {loading && <p style={{ marginTop: 12 }}>Extracting...</p>}
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
      {text && (
        <div style={{ marginTop: 20 }}>
          <textarea value={text} readOnly rows={13} />
        </div>
      )}
    </div>
  );
}
EOF
