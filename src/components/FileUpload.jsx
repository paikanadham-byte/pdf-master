<div
  onDrop={e => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  }}
  onDragOver={e => e.preventDefault()}
  style={{
    border: '2px dashed #aaa',
    padding: 20,
    textAlign: 'center',
    borderRadius: 4,
    cursor: 'pointer'
  }}
>
  {file ? file.name : 'Drag and drop a PDF here or click to select'}
  <input
    type="file"
    accept="application/pdf"
    onChange={e => setFile(e.target.files[0])}
    style={{ display: 'none' }}
  />
</div>
