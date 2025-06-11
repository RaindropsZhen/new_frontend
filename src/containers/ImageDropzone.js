import { Spinner } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import React, { useCallback, useState,useEffect } from 'react';
import styled from 'styled-components';

const Dropzone = styled.div`
  border: 1px dashed #ced4d9;
  border-radius: 5px;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 142px;
  img {
    height: 140px;
  }
`;

function ImageDropzone({ value, onChange,reset, setReset }) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(""); // Renamed from fileURL for clarity

  // Effect to set initial preview from 'value' prop
  useEffect(() => {
    if (value instanceof File) {
      setPreviewUrl(URL.createObjectURL(value));
    } else if (typeof value === 'string' && value) {
      const baseUrl = process.env.REACT_APP_API_URL || ''; // Fallback to empty string if not set
      setPreviewUrl(baseUrl + value);
    } else {
      setPreviewUrl(""); // Clear preview if value is null or invalid
    }
    // Cleanup object URL when component unmounts or value changes
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [value]);


  const onDrop = useCallback((acceptedFiles) => {
    setLoading(true);
    const file = acceptedFiles[0];
    if (file) {
      // Revoke previous object URL if it exists
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      onChange(file); // Pass the File object to the parent
    }
    setLoading(false);
  }, [onChange, previewUrl]); // Added previewUrl to dependencies

  useEffect(() => {
    if (reset) {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl("");
      if (setReset) setReset(false); 
    }
  }, [reset, setReset, previewUrl]); // Added previewUrl to dependencies

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/*',
  });

  let displaySrc = null;
  if (previewUrl) { // This will hold either blob URL or server path + API_URL
    displaySrc = previewUrl;
  } else if (typeof value === 'string' && value) { // Fallback for initial load if effect hasn't run
     const baseUrl = process.env.REACT_APP_API_URL || '';
     displaySrc = baseUrl + value;
  }


  return (
    <Dropzone {...getRootProps()}>
      <input {...getInputProps()} />
      {
        displaySrc ? (
          <img src={displaySrc} alt="Preview" />
        ) : loading ? (
          <Spinner variant="standard" animation="border" role="staus" />
        ) : (
          <span>拖拽图片，或者点击添加图片</span>)
      }
    </Dropzone>
  )
}

export default ImageDropzone;
