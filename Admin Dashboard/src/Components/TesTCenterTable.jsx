import React, { useState } from 'react';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import useTestCenter from '../Hooks/useTestCenter';
import { TestCenterStore } from '../Store/TestCenterStore';

const TestCenterTable = () => {
  const { testCenters } = TestCenterStore((state) => ({
    testCenters: state.data
  }));

  const { updateTestCenter, deleteTestCenter } = useTestCenter();

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ admin_email: '', institute_name: '', address: '', password: '', capacity: '' });
  const [showPassword, setShowPassword] = useState(false); 

  const handleEdit = (testCenter) => {
    setEditingId(testCenter.test_center_id);
    setEditData({
      admin_email: testCenter.admin_email,
      institute_name: testCenter.institute_name,
      address: testCenter.address,
      password: testCenter.password,
      capacity: testCenter.capacity, // Include capacity
    });
  };

  const handleSave = () => {
    updateTestCenter({
      id: editingId,
      admin_email: editData.admin_email,
      institute_name: editData.institute_name,
      address: editData.address,
      password: editData.password,
      capacity: editData.capacity, // Include capacity
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDelete = (id) => {
    deleteTestCenter(id);
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
                  <th>Id</th>
                  <th>Admin Email</th>
                  <th>Institute</th>
                  <th>Address</th>
                  <th>Password</th>
                  <th>Capacity</th> {/* Add Capacity column */}
                  <th colSpan={2}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testCenters.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      <NoDataMessage>No test centers found</NoDataMessage>
                    </td>
                  </tr>
                ) : (
                  testCenters.map((testCenter, index) => (
                    <tr key={testCenter.test_center_id}>
                      <td data-label="No">{index + 1}</td>
                      <td data-label="Admin Email">
                        {editingId === testCenter.test_center_id ? (
                          <input
                            type="email"
                            name="admin_email"
                            value={editData.admin_email}
                            onChange={handleChange}
                          />
                        ) : (
                          testCenter.admin_email
                        )}
                      </td>
                      <td data-label="Institute">
                        {editingId === testCenter.test_center_id ? (
                          <input
                            type="text"
                            name="institute_name"
                            value={editData.institute_name}
                            onChange={handleChange}
                          />
                        ) : (
                          testCenter.institute_name
                        )}
                      </td>
                      <td data-label="Address">
                        {editingId === testCenter.test_center_id ? (
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
                      <td data-label="Password">
                        {editingId === testCenter.test_center_id ? (
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              value={editData.password}
                              onChange={handleChange}
                            />
                            <EyeIcon onClick={togglePasswordVisibility}>
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </EyeIcon>
                          </div>
                        ) : (
                          '********'
                        )}
                      </td>
                      <td data-label="Capacity">
                        {editingId === testCenter.test_center_id ? (
                          <input
                            type="number"
                            name="capacity"
                            value={editData.capacity}
                            onChange={handleChange}
                          />
                        ) : (
                          testCenter.capacity
                        )}
                      </td>
                      <td>
                        {editingId === testCenter.test_center_id ? (
                          <>
                            <StyledButton className="my-2" variant="success" onClick={handleSave}>
                              Save
                            </StyledButton>
                            <StyledButton className="my-2" variant="secondary" onClick={() => setEditingId(null)}>
                              Cancel
                            </StyledButton>
                          </>
                        ) : (
                          <StyledButton className="my-2" variant="warning" onClick={() => handleEdit(testCenter)}>
                            Edit
                          </StyledButton>
                        )}
                        {editingId !== testCenter.test_center_id && (
                          <StyledButton className="my-2" variant="danger" onClick={() => handleDelete(testCenter.test_center_id)}>
                            Delete
                          </StyledButton>
                        )}
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
  overflow-y: auto; /* Add vertical scrolling */
  max-height: 500px; /* Set a fixed height */
`;

const StyledTable = styled(Table)`
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  th, td {
    text-align: center;
    vertical-align: middle;
  }

  @media (max-width: 768px) {
    thead {
      display: none;
    }

    tbody {
      display: block;
      max-height: 80vh;
      overflow-y: auto;
    }

    tr {
      display: block;
      margin-bottom: 10px;
      border-bottom: 1px solid #dee2e6;
    }

    td {
      display: block;
      text-align: right;
      position: relative;
      padding-left: 50%;
      padding-right: 10px;
      white-space: nowrap;
    }

    td::before {
      content: attr(data-label);
      position: absolute;
      left: 0;
      width: 50%;
      padding-left: 10px;
      font-weight: bold;
      text-align: left;
    }
  }
`;

const Heading = styled.h2`
  text-align: center;
  color: #333;
`;

const NoDataMessage = styled.p`
  color: #888;
`;

const StyledButton = styled(Button)`
  margin: 0 5px;
`;

const EyeIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #007bff;
`;

export default TestCenterTable;
