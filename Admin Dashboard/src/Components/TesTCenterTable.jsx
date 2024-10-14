import React, { useState } from "react";
import { Table, Button, Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useTestCenter from "../Hooks/useTestCenter";
import { TestCenterStore } from "../Store/TestCenterStore";

const TestCenterTable = () => {
  const { testCenters } = TestCenterStore((state) => ({
    testCenters: state.data,
  }));

  const { updateTestCenter, deleteTestCenter } = useTestCenter();

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    admin_email: "",
    institute_name: "",
    address: "",
    password: "",
    capacity: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const handleEdit = (testCenter) => {
    setEditingId(testCenter.test_center_id);
    setEditData({
      admin_email: testCenter.admin_email,
      institute_name: testCenter.institute_name,
      address: testCenter.address,
      password: testCenter.password,
      capacity: testCenter.capacity,
    });
  };

  const handleSave = () => {
    updateTestCenter({
      id: editingId,
      ...editData,
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

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedCenters = [...testCenters].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    // Update the store or local state as needed with sortedCenters
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
                  <th onClick={() => handleSort("test_center_id")}>Id</th>
                  <th onClick={() => handleSort("admin_email")}>Admin Email</th>
                  <th onClick={() => handleSort("institute_name")}>Institute</th>
                  <th onClick={() => handleSort("address")}>Address</th>
                  <th onClick={() => handleSort("password")}>Password</th>
                  <th onClick={() => handleSort("capacity")}>Capacity</th>
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
                          <div style={{ position: "relative", display: "inline-block" }}>
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={editData.password}
                              onChange={handleChange}
                            />
                            <EyeIcon onClick={togglePasswordVisibility}>
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </EyeIcon>
                          </div>
                        ) : (
                          "********"
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
                            <StyledButton variant="success" onClick={handleSave}>
                              Save
                            </StyledButton>
                            <StyledButton variant="secondary" onClick={() => setEditingId(null)}>
                              Cancel
                            </StyledButton>
                          </>
                        ) : (
                          <StyledButton variant="warning" onClick={() => handleEdit(testCenter)}>
                            Edit
                          </StyledButton>
                        )}
                        {editingId !== testCenter.test_center_id && (
                          <StyledButton variant="danger" onClick={() => handleDelete(testCenter.test_center_id)}>
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
  overflow-y: auto;
  max-height: 500px;
  width: 100%; /* Ensure full width */
`;

const StyledTable = styled(Table)`
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%; /* Ensure full width */
  margin: 20px 0; /* Margin for spacing */

  th, td {
    text-align: center;
    vertical-align: middle;
    padding: 15px; /* Increased padding for better spacing */
    cursor: pointer; /* Indicate clickable */
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #f0f0f0; /* Light gray on hover */
    }
  }

  th {
    background-color: #495057; /* Header background color */
    color: #fff; /* Header text color */
  }

  tbody tr {
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f9f9f9; /* Light background on row hover */
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
