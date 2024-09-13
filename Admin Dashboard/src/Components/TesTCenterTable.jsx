// src/Components/TestCentersTable.js
import React, { useState } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import useTestCenterStore from '../Store/TestCenterStore';

const TestCenterTable = () => {
  const { testCenters, deleteTestCenter, updateTestCenter } = useTestCenterStore((state) => ({
    testCenters: state.testCenters,
    deleteTestCenter: state.deleteTestCenter,
    updateTestCenter: state.updateTestCenter,
  }));

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ adminName: '', instituteName: '', address: '' });

  const handleEdit = (testCenter) => {
    setEditingId(testCenter.id);
    setEditData({
      adminName: testCenter.adminName,
      instituteName: testCenter.instituteName,
      address: testCenter.address,
    });
  };

  const handleSave = () => {
    updateTestCenter({
      id: editingId,
      adminName: editData.adminName,
      instituteName: editData.instituteName,
      address: editData.address,
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <Heading>Test Centers List</Heading>
        </Col>
      </Row>
      <Row>
        <Col>
          <TableContainer>
            <StyledTable striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Admin Name</th>
                  <th>Institute/Place Name</th>
                  <th>Address</th>
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testCenters.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      <NoDataMessage>No test centers found</NoDataMessage>
                    </td>
                  </tr>
                ) : (
                  testCenters.map((testCenter) => (
                    <tr key={testCenter.id}>
                      <td>{testCenter.id}</td>
                      <td>
                        {editingId === testCenter.id ? (
                          <input
                            type="text"
                            name="adminName"
                            value={editData.adminName}
                            onChange={handleChange}
                          />
                        ) : (
                          testCenter.adminName
                        )}
                      </td>
                      <td>
                        {editingId === testCenter.id ? (
                          <input
                            type="text"
                            name="instituteName"
                            value={editData.instituteName}
                            onChange={handleChange}
                          />
                        ) : (
                          testCenter.instituteName
                        )}
                      </td>
                      <td>
                        {editingId === testCenter.id ? (
                          <input
                            type="text"
                            name="address"
                            value={editData.address}
                            onChange={handleChange}
                          />
                        ) : (
                          testCenter.address
                        )}
                      </td>
                      <td>
                        {editingId === testCenter.id ? (
                          <>
                            <StyledButton variant="success" onClick={handleSave}>Save</StyledButton>
                            <StyledButton variant="secondary" onClick={() => setEditingId(null)}>Cancel</StyledButton>
                          </>
                        ) : (
                          <StyledButton variant="warning" onClick={() => handleEdit(testCenter)}>Edit</StyledButton>
                        )}
                      
                        <StyledButton variant="danger" onClick={() => deleteTestCenter(testCenter.id)}>Delete</StyledButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </StyledTable>
          </TableContainer>
        </Col>
      </Row>
    </Container>
  );
};

const TableContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled(Table)`
  thead {
    background-color: #343a40;
    color: #fff;
  }
`;

const Heading = styled.h2`
  text-align: center;
  color: #343a40;
  margin-bottom: 20px;
`;

const NoDataMessage = styled.div`
  color: #6c757d;
`;

const StyledButton = styled(Button)`
  margin-right: 10px;
`;

export default TestCenterTable;
