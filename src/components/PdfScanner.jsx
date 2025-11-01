cat > src/components/PdfScanner.jsx <<'EOF'
import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function PdfScanner() {
  const [images, setImages] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPdfUrl(null);
    setCapturedImages([]);
    setCameraOn(false);
  };

  const handleStartCamera = async () => {
    setError('');
    setImages([]);
    setCapturedImages([]);
    setPdfUrl(null);
    setCameraOn(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (e) {
      setError('Failed to access camera.');
    }
  };

  const handleStopCamera = () => {
    setCameraOn(false);
    if (videoRef.current && videoRef.current.srcObject) {
      let tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      setCapturedImages(prev => [...prev, new File([blob], `captured_${prev.length + 1}.png`, { type: 'image/png' })]);
    }, 'image/png');
  };

  const handleConvert = async () => {
    const srcImages = cameraOn ? capturedImages : images;
    if (!srcImages.length) return;
    const pdfDoc = await PDFDocument.create();

    for (let imageFile of srcImages) {
      const imgBytes = await imageFile.arrayBuffer();
      let img;
      if (imageFile.type === 'image/jpeg') {
        img = await pdfDoc.embedJpg(imgBytes);
      } else if (imageFile.type === 'image/png') {
        img = await pdfDoc.embedPng(imgBytes);
      } else continue;

      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: img.width,
        height: img.height
      });
    }
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    setPdfUrl(URL.createObjectURL(blob));
  };

  const removeCapturedImage = idx => {
    setCapturedImages(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <h2>PDF Scanner</h2>
      <div style={{ margin: '20px 0', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn" onClick={handleStartCamera} disabled={cameraOn}>Use Camera</button>
        <button className="btn" onClick={handleStopCamera} disabled={!cameraOn}>Stop Camera</button>
        <input
          type="file"
          accept="image/png,image/jpeg"
          multiple
          style={{ marginLeft: 10 }}
          onChange={handleImageChange}
          disabled={cameraOn}
        />
      </div>
      {error && <div style={{ color: 'red', marginBottom: 14 }}>{error}</div>}
      {cameraOn && (
        <div style={{ marginBottom: 18 }}>
          <video ref={videoRef} width={340} height={240} style={{ borderRadius: 10, background: '#000', border: '2px solid #222' }} autoPlay />
          <br />
          <button className="btn" onClick={handleCapture} style={{ marginTop: 10 }}>Capture Photo</button>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
      )}
      {cameraOn && capturedImages.length > 0 && (
        <div>
          <h4 style={{ marginBottom: 8 }}>Captured Images:</h4>
          <div style={{ display: 'flex', gap: 10 }}>
            {capturedImages.map((img, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <img
                  src={URL.createObjectURL(img)}
                  alt={`capture-${idx}`}
                  width={85}
                  style={{ borderRadius: 5, border: '1px solid #ccc' }}
                />
                <button
                  onClick={() => removeCapturedImage(idx)}
                  style={{
                    position: 'absolute',
                    top: 2, right: 2,
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    width: 22,
                    height: 22,
                    fontWeight: 700,
                    color: '#333',
                    boxShadow: '0 2px 6px #aaa'
                  }}
                  title="Remove"
                >✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {!cameraOn && images.length > 0 && (
        <div>
          <h4 style={{ marginBottom: 8 }}>Selected Images:</h4>
          <div style={{ display: 'flex', gap: 10 }}>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt={`upload-${idx}`}
                width={85}
                style={{ borderRadius: 5, border: '1px solid #ccc' }}
              />
            ))}
          </div>
        </div>
      )}
      <div style={{ marginTop: 22 }}>
        <button
          className="btn"
          onClick={handleConvert}
          disabled={cameraOn ? capturedImages.length === 0 : images.length === 0}
        >
          Convert {cameraOn ? 'Captured' : 'Selected'} Images to PDF
        </button>
      </div>
      {pdfUrl &&
        <div style={{ marginTop: 26 }}>
          <a className="btn" href={pdfUrl} download="scanned.pdf">
            <b>Download PDF</b>
          </a>
        </div>
      }
    </div>
  );
}
EOF
