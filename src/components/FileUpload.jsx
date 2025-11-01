cat > src/components/FileUpload.jsx <<'EOF'
import React, { useState } from 'react';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setMessage(`Selected: ${selectedFile.name}`);
    } else {
      setFile(null);
      setMessage('Please select a valid PDF file.');
    }
  };

  return (
    <div>
      <h2>Upload your PDF</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
      />
      {message && <p style={{ margin: '8px 0 0 0' }}>{message}</p>}
      {file && (
        <div style={{ marginTop: 22 }}>
          <span className="btn" style={{ pointerEvents: 'none', opacity: 0.8 }}>
            Ready for processing!
          </span>
        </div>
      )}
    </div>
  );
}
EOF
