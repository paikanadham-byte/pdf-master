import React, { useState } from 'react';

export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setMessage(`Selected: ${selectedFile.name}`);
            // Here you can handle uploading/processing
        } else {
            setFile(null);
            setMessage('Please select a valid PDF file.');
        }
    };

    return (
        <div style={{
            border: '2px dashed #aaa',
            borderRadius: 10,
            padding: 40,
            textAlign: 'center',
            background: '#fafafa'
        }}>
            <h2>Upload your PDF</h2>
            <input
                type="file"
                accept="application/pdf"
                style={{ margin: '20px 0' }}
                onChange={handleFileChange}
            />
            {message && <p>{message}</p>}
            {file && (
                <div style={{ marginTop: 20 }}>
                    <strong>Ready for processing!</strong>
                </div>
            )}
        </div>
    );
}
