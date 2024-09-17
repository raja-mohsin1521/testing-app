const pool = require("../../db_Connection/db");

// Add a new test
const addTest = async (req, res) => {
    const { name, subject, eligibility_criteria, difficulty_level, number_of_questions } = req.body;
  
    try {
      // Insert new test
      const result = await pool.query(
        'INSERT INTO test (test_name, subject, eligibility_criteria, difficulty_level, number_of_questions) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, subject, eligibility_criteria, difficulty_level, number_of_questions]
      );
  
      return res.status(201).json({
        success: true,
        message: 'Test added successfully',
        data: result.rows[0],
      });
  
    } catch (error) {
      console.error('Error adding test:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  

// Get all tests
const getAllTests = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM test');
    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update a test
const updateTest = async (req, res) => {
    const { id, name, subject, eligibility_criteria, difficulty_level, number_of_questions } = req.body; // Update these variable names
    console.log('req.body', req.body);
  
    // Validate the required fields
    if (!id || !name || !difficulty_level || number_of_questions === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      const result = await pool.query(
        `UPDATE test
         SET test_name = $1, subject = $2, eligibility_criteria = $3, difficulty_level = $4, number_of_questions = $5
         WHERE test_id = $6`,
        [name, subject, eligibility_criteria, difficulty_level, number_of_questions, id] // Match the order to variables
      );
      res.status(200).json({ message: 'Test updated successfully' });
    } catch (error) {
      console.error('Error updating test:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
// Delete a test
const deleteTest = async (req, res) => {
  const { id } = req.body;

  try {
    const result = await pool.query('DELETE FROM test WHERE test_id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Test deleted successfully',
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }
  } catch (error) {
    console.error('Error deleting test:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  addTest,
  getAllTests,
  updateTest,
  deleteTest,
};
