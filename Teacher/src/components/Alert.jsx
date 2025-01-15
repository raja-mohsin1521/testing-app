import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const AlertContainer = styled.div`
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  color: white;
  text-align: center;
`;

const SuccessAlert = styled(AlertContainer)`
  background-color: #28a745; /* Green */
`;

const ErrorAlert = styled(AlertContainer)`
  background-color: #dc3545; /* Red */
`;

const Alert = ({ alertMessage, statusCode }) => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    // Show the alert whenever the alertMessage changes
    setShowAlert(true);

    // Hide the alert after 3 seconds
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer if component unmounts
  }, []); // Run the effect whenever alertMessage or statusCode changes

  if (!showAlert) return null;

  // Determine the alert color based on status code
  const isSuccess = statusCode >= 200 && statusCode <= 299;
  return isSuccess ? (
    <SuccessAlert>{alertMessage}</SuccessAlert>
  ) : (
    <ErrorAlert>{alertMessage}</ErrorAlert>
  );
};

export default Alert;
