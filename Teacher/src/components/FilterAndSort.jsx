import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import styled from "styled-components";

// Styled components for custom styling
const FilterContainer = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const FilterLabel = styled(Form.Label)`
  font-weight: 600;
  color: #343a40;
  margin-bottom: 8px;
`;

const FilterSelect = styled(Form.Select)`
  border-radius: 8px;
  border: 1px solid #ced4da;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
  }
`;

const FilterAndSort = ({ courses, filters, sortBy, sortOrder, onFilterChange, onSortChange }) => {
  return (
    <FilterContainer>
      <Row>
        {/* Course Filter */}
        <Col md={3}>
          <Form.Group>
            <FilterLabel>Course</FilterLabel>
            <FilterSelect
              name="course"
              value={filters.course}
              onChange={onFilterChange}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </FilterSelect>
          </Form.Group>
        </Col>

        {/* Difficulty Filter */}
        <Col md={3}>
          <Form.Group>
            <FilterLabel>Difficulty</FilterLabel>
            <FilterSelect
              name="difficulty"
              value={filters.difficulty}
              onChange={onFilterChange}
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </FilterSelect>
          </Form.Group>
        </Col>

        {/* Sort By Dropdown */}
        <Col md={3}>
          <Form.Group>
            <FilterLabel>Sort By</FilterLabel>
            <FilterSelect
              name="sortBy"
              value={sortBy}
              onChange={onSortChange}
            >
              <option value="">Select Sort By</option>
              <option value="question_text">Question</option>
              <option value="difficulty_level">Difficulty</option>
              <option value="course_name">Course</option>
              <option value="module_name">Module</option>
            </FilterSelect>
          </Form.Group>
        </Col>

        {/* Sort Order Dropdown */}
        <Col md={3}>
          <Form.Group>
            <FilterLabel>Sort Order</FilterLabel>
            <FilterSelect
              name="sortOrder"
              value={sortOrder}
              onChange={onSortChange}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </FilterSelect>
          </Form.Group>
        </Col>
      </Row>
    </FilterContainer>
  );
};

export default FilterAndSort;