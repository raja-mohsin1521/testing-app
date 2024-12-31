import React, { useState, useRef } from "react";
import { Container, Button, Row, Col, ProgressBar, Spinner, Alert } from "react-bootstrap";
import styled from "styled-components";
import QuestionForm from "../components/QuestionForm";
import QuestionsTable from "../components/QuestionsTable";
import SubQuestionForm from "../components/SubQuestionForm";
import ExcelFileUpload from "../components/ExcellFileUpload"; 
import * as XLSX from "xlsx"; 
import useQuestion from "../Hooks/useQustions";
import SubjectiveQuestionsTable from "../components/SubjectiveQuestionTable";
import ObjQuestionCard from "../components/ObjQuestionCard";
import SubQuestionCard from "../components/SubjectiveQuestionCard";

const StyledContainer = styled(Container)`
  background: linear-gradient(135deg, #f6f9fc, #e9ecef);
  min-height: 100vh;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const HeaderRow = styled(Row)`
  margin-bottom: 20px;
  text-align: center;
  align-items: center;
  @media (max-width: 576px) {
    display: flex;
    flex-direction: column;
  }
`;

const StyledButton = styled(Button)`
  background-color: #007bff;
  border: none;
  padding: 12px 24px;
  font-size: 18px;
  border-radius: 50px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
  width: 100%;
  max-width: 250px;
  margin: 10px auto;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 123, 255, 0.5);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.6);
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 10px 20px;
    margin: 15px 0;
  }
`;

const DecorativeLine = styled.div`
  width: 80%;
  height: 4px;
  background: linear-gradient(to right, #007bff, #17a2b8);
  margin: 20px auto;
  border-radius: 10px;
`;

const AnimatedForm = styled.div`
  animation: ${({ isVisible }) =>
    isVisible
      ? "fadeIn 0.5s ease-in-out forwards"
      : "fadeOut 0.5s ease-in-out forwards"};
  overflow: hidden;

  @keyframes fadeIn {
    0% {
      opacity: 0;
      height: 0;
    }
    100% {
      opacity: 1;
      height: auto;
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
      height: auto;
    }
    100% {
      opacity: 0;
      height: 0;
    }
  }
`;

const QuestionsPage = () => {
  const [showObjForm, setShowObjForm] = useState(false);
  const [showSubForm, setShowSubForm] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [progress, setProgress] = useState(0); 
  const [showAlert, setShowAlert] = useState(false);  
  const [toggleTable, setToggleTable] = useState(false);  
  const fileInputRef = useRef(null);  
  const { importObj, importSub } = useQuestion();

  const toggleSubForm = () => {
    setShowSubForm(!showSubForm);
    setShowObjForm(false);
  };

  const toggleObjForm = () => {
    setShowObjForm(!showObjForm);
    setShowSubForm(false);
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadstart = () => {
        setLoading(true); 
      };

      reader.onload = async (evt) => {
        const binaryStr = evt.target.result;
        const wb = XLSX.read(binaryStr, { type: "binary" });

        const sheetNames = wb.SheetNames;

        

        sheetNames.forEach(async (sheetName, index) => {
          const ws = wb.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

          

          const cleanedData = cleanData(data); 

          setProgress(((index + 1) / sheetNames.length) * 100);

          if (sheetName === "Objective Questions") {
            
            await importObj(cleanedData);
          } else if (sheetName === "Subjective Questions") {
            
            await importSub(cleanedData);
          }
        });

        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);

        if (fileInputRef.current) {
          fileInputRef.current.value = ""; 
        }
      };

      reader.onloadend = () => {
        setLoading(false); 
      };

      reader.readAsBinaryString(file);
    }
    
  };

  const cleanData = (data) => {
    const headers = data[0];
    return data
      .slice(1) 
      .filter((row) => row.some((cell) => cell !== "")) 
      .map((row) => {
        return headers.reduce((acc, header, index) => {
          acc[header] = typeof row[index] === 'string' ? row[index].trim() : row[index] || null;
          return acc;
        }, {}); 
      });
  };

  return (
    <StyledContainer fluid>
      {showAlert && (
        <Alert variant="success" className="text-center">
          File uploaded successfully!
        </Alert>
      )}

      <AnimatedForm isVisible={showSubForm}>{showSubForm && <SubQuestionForm />}</AnimatedForm>
      {!showSubForm ? <></> : <DecorativeLine />}

      <AnimatedForm isVisible={showObjForm}>{showObjForm && <QuestionForm />}</AnimatedForm>
      {!showObjForm ? <></> : <DecorativeLine />}

      <HeaderRow>
        <Col sm={6}>
          <StyledButton onClick={toggleObjForm}>
            {showObjForm ? "Hide Form" : "Add Objective Question"}
          </StyledButton>
        </Col>
        <Col sm={6}>
          <StyledButton onClick={toggleSubForm}>
            {showSubForm ? "Hide Form" : "Add Subjective Question"}
          </StyledButton>
        </Col>
      </HeaderRow>

      <Row className="mb-5 text-center justify-content-center">
        <Col sm={12} md={6} lg={6}>
          <ExcelFileUpload
            label="Upload Sheets"
            onChange={(e) => handleFileUpload(e, "Subjective")}
            id="subExcelUpload"
            ref={fileInputRef} 
          />
        </Col>
      </Row>

      {loading && (
        <div className="text-center mb-4">
          <Spinner animation="border" variant="primary" />
          <ProgressBar now={progress} label={`${progress.toFixed(0)}%`} />
        </div>
      )}
<hr />
<Button className="btn-dark mb-5" onClick={()=>{setToggleTable(!toggleTable)}}>{toggleTable?'Show Image Based':'Show Table'}</Button>

      {toggleTable?<><h1>Objective Questions</h1>
      <QuestionsTable />
      <h1>Subjective Questions</h1>
      <SubjectiveQuestionsTable/></>:<><h1>Objective Questions</h1>
      <ObjQuestionCard/>
      <h1>Subjective Questions</h1>
      <SubQuestionCard/></>}

      
    </StyledContainer>
  );
};

export default QuestionsPage;
