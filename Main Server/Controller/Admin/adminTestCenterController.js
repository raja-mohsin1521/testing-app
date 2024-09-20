const pool = require("../../db_Connection/db");

const addTestCenter = async (req, res) => {
  const { adminEmail, password, instituteName, address, capacity, city } = req.body;

  try {
    const emailCheckResult = await pool.query(
      'SELECT * FROM test_center WHERE admin_email = $1',
      [adminEmail]
    );

    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email address already in use',
      });
    }

    const result = await pool.query(
      'INSERT INTO test_center (admin_email, password, institute_name, address, capacity, city) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [adminEmail, password, instituteName, address, capacity, city]
    );

    return res.status(201).json({
      success: true,
      message: 'Test center added successfully',
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error adding test center:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getAllTestCenters = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM test_center');
    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching test centers:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const updateTestCenter = async (req, res) => {
  const { id, admin_email, institute_name, address, password, capacity } = req.body;

  if (!id || !admin_email || !institute_name || !address || !password || !capacity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `UPDATE test_center
       SET admin_email = $1, institute_name = $2, address = $3, password = $4, capacity = $5
       WHERE test_center_id = $6`,
      [admin_email, institute_name, address, password, capacity, id]
    );
    res.status(200).json({ message: 'Test center updated successfully' });
  } catch (error) {
    console.error('Error updating test center:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTestCenter = async (req, res) => {
  const { id } = req.body;
  
  try {
    const result = await pool.query('DELETE FROM test_center WHERE test_center_id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Test center deleted successfully',
        data: result.rows[0],
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Test center not found',
      });
    }
  } catch (error) {
    console.error('Error deleting test center:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getUpcomingTestCenters = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT tc.institute_name, t.test_name, t.subject, 
              st.test_date, st.test_time, tc.capacity
       FROM test_center tc
       JOIN scheduled_test st ON tc.test_center_id = st.test_center_id
       JOIN test t ON st.test_id = t.test_id
       WHERE st.test_date >= CURRENT_DATE`
    );

    if (result.rows.length > 0) {
      return res.status(200).json({
        success: true,
        data: result.rows,
      });
    } else {
      return res.status(204).json({
        success: false,
        message: 'No upcoming tests found for any test centers',
      });
    }
  } catch (error) {
    console.error('Error fetching upcoming test centers:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports = {
  addTestCenter,
  getAllTestCenters,
  updateTestCenter,
  deleteTestCenter,
  getUpcomingTestCenters,
};
