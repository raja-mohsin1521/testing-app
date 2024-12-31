
import React from 'react';
import styled from 'styled-components';

const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 10px 20px;
  border-radius: 10px;
  border: 2px dashed #007bff;
  transition: background-color 0.3s ease, border 0.3s ease;

  &:hover {
    background-color: #f1f3f5;
    border-color: #0056b3;
  }

  input[type="file"] {
    display: none;
  }

  label {
    cursor: pointer;
    background-color: #007bff;
    color: white;
    padding: 8px 20px;
    border-radius: 50px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const ExcelFileUpload = ({ label, onChange, id }) => {
  return (
    <FileInputWrapper>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="file"
        accept=".xlsx, .xls"
        onChange={onChange}
      />
    </FileInputWrapper>
  );
};

export default ExcelFileUpload;
