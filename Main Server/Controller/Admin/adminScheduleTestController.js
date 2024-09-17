const pool = require("../../db_Connection/db");

const getAllTests = async (req, res) => {
  try {
    const result = await pool.query('SELECT test_id,test_name FROM test');
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

const getAllCities = async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT city FROM test_center');
    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getAllCenters = async (req, res) => {
  try {
    const result = await pool.query('SELECT test_center_id, capacity,city, institute_name FROM test_center');
    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching centers:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getSpecificCenters = async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City parameter is required',
      });
    }

    const cities = Array.isArray(city) ? city : [city];
    const placeholders = cities.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
      SELECT test_center_id, institute_name ,capacity
      FROM test_center 
      WHERE city IN (${placeholders})
    `;

    const result = await pool.query(query, cities);

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching specific centers:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


const addScheduledTest = async (req, res) => {
    console.log('req.body', req.body);
    
    // Map the fields from request body to the expected variables
    const {
      selectedTest: test_id,
      selectedCenters: [test_center_id], // Assuming only one center is selected
      regStartDate: registration_start_date,
      regEndDate: registration_end_date,
      testDateTime: test_date_time,
    } = req.body;
  
    // Check if any required field is missing
    if (!test_id || !test_center_id || !registration_start_date || !registration_end_date || !test_date_time) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }
  
    try {
      // Insert the new test into the database
      const result = await pool.query(
        `INSERT INTO scheduled_test (test_id, test_center_id, registration_start_date, registration_end_date, test_date_time) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [test_id, test_center_id, registration_start_date, registration_end_date, test_date_time]
      );
  
      return res.status(201).json({
        success: true,
        message: 'Scheduled test added successfully',
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error adding scheduled test:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  




  const getScheduleTestDetails = async (req, res) => {
    try {
     
      const today = new Date().toISOString().split('T')[0];
  
      
      const result = await pool.query(
        `SELECT 
           t.test_name AS "testName", 
           tc.institute_name AS "testCenterName", 
           st.test_date_time AS "testDateTime"
         FROM scheduled_test st
         JOIN test t ON st.test_id = t.test_id
         JOIN test_center tc ON st.test_center_id = tc.test_center_id
         WHERE DATE(st.test_date_time) >= $1`, [today]
      );
  
      if (result.rows.length > 0) {
        return res.status(200).json({
          success: true,
          data: result.rows,
        });
      } else {
        return res.status(204).json({
          success: true,
          message: 'No upcoming tests found',
        });
      }
    } catch (error) {
      console.error('Error fetching test details:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  


module.exports = {
    addScheduledTest,
  getAllTests,
  getAllCities,
  getAllCenters,
  getSpecificCenters,
  getScheduleTestDetails
};
