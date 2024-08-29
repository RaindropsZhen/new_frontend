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
  const [fileURL,setfileRUL] = useState("");
  const onDrop = useCallback((acceptedFiles) => {
    setLoading(true);
    const file = acceptedFiles[0];
    setfileRUL(URL.createObjectURL(file));
    onChange(file)
    setLoading(false);
  }, []);
  useEffect(() => {
    // If reset is true, clear the fileURL and inform the parent component
    if (reset) {
      setfileRUL("");
      setReset(false); // Reset the reset trigger
    }
  }, [reset, setReset]);
  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/*',
  });

  return (
    <Dropzone {...getRootProps()}>
      <input {...getInputProps()} />
      {
        fileURL ? (
          <img src={fileURL} />
        ) : loading ? (
          <Spinner variant="standard" animation="border" role="staus" />
        ) : (
          <span>拖拽图片，或者点击添加图片</span>)
      }
    </Dropzone>
  )
}

export default ImageDropzone;