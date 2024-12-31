const pool = require("../../db_Connection/db");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

const updateQuestion = async (req, res) => {
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "optionImages", maxCount: 4 },
  ])(req, res, async (err) => {
    if (err) {
      return res.status(500).send("Error uploading files.");
    }

    const {
      teacher_id,
      question_id,
      question_text,
      answer,
      difficulty_level,
      options,
    } = req.body;

    try {
      if (!teacher_id) {
        return res.status(400).send("Teacher ID is required.");
      }

      const updatedImageUrl = req.files?.image?.[0]?.path || null;
      const optionImages = req.files?.optionImages?.map((file) => file.path) || [];

      const updatedOptions = options.map((option, index) => ({
        text: option.text || null,
        image: option.image || optionImages[index] || null,
      }));

      const result = await pool.query(
        `UPDATE obj_question SET 
            question_text = $1, 
            correct_answer = $2, 
            difficulty_level = $3, 
            image_url = $4, 
            option_1_text = $5, 
            option_1_image = $6, 
            option_2_text = $7, 
            option_2_image = $8, 
            option_3_text = $9, 
            option_3_image = $10, 
            option_4_text = $11, 
            option_4_image = $12 
          WHERE obj_question_id = $13 AND teacher_id = $14 
          RETURNING *`,
        [
          question_text || null,
          answer || null,
          difficulty_level || null,
          updatedImageUrl,
          updatedOptions[0].text,
          updatedOptions[0].image,
          updatedOptions[1].text,
          updatedOptions[1].image,
          updatedOptions[2].text,
          updatedOptions[2].image,
          updatedOptions[3].text,
          updatedOptions[3].image,
          question_id,
          teacher_id,
        ]
      );

      if (!result.rows.length) {
        return res
          .status(404)
          .send("Question not found or you're not authorized to update this question");
      }

      res.json({ question: result.rows[0] });
    } catch (err) {
      console.error("Error updating question:", err);
      res.status(500).send("Error updating question");
    }
  });
};


const getAllCourses = async (req, res) => {
  try {
    
    const result = await pool.query(`SELECT * FROM courses`);

    res.status(200).json( result.rows );
   
  } catch (err) {
    res.status(500).send(err);
  }
};

const getModulesForCourse = async (req, res) => {
  const { courseId } = req.params;

  if (!courseId) {
    return res.status(400).send("Course ID is required");
  }

  try {
    const result = await pool.query(`SELECT * FROM modules WHERE course_id = $1`, [courseId]);

    if (result.rows.length === 0) {
      return res.status(404).send("No modules found for the given course ID");
    }

    res.status(200).json({ modules: result.rows });
  } catch (err) {
    res.status(500).send("Error fetching modules for the course");
  }
};

const addObjQuestion = async (req, res) => {
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'options[0][image]', maxCount: 1 },
    { name: 'options[1][image]', maxCount: 1 },
    { name: 'options[2][image]', maxCount: 1 },
    { name: 'options[3][image]', maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      return res.status(500).send("Error uploading files.");
    }

    const {
      questionText,
      correctAnswer,
      difficultyLevel,
      course_id,
      module_id,
      options,
      token: teacher_id,
    } = req.body;

    try {
      const checkQuery = `
        SELECT COUNT(*) FROM obj_question WHERE question_text = $1
      `;
      const checkValues = [questionText];
      const checkResult = await pool.query(checkQuery, checkValues);

      if (checkResult.rows[0].count > 0) {
        return res.status(400).send("Question already exists in the database.");
      }

      const uploadedImageUrl = req.files?.image?.[0]?.path || null;

      const optionImages = [];
      for (let i = 0; i < 4; i++) {
        const field = `options[${i}][image]`;
        if (req.files[field]) {
          optionImages.push(req.files[field][0].path);
        } else {
          optionImages.push(null);
        }
      }

      const preparedOptions = options.map((option, index) => ({
        text: option?.text || null,
        image: optionImages[index] || null,
      }));

      const result = await pool.query(
        `INSERT INTO obj_question (
          teacher_id, 
          question_text, 
          correct_answer, 
          option_1, 
          option_1_image, 
          option_2, 
          option_2_image, 
          option_3, 
          option_3_image, 
          option_4, 
          option_4_image, 
          difficulty_level, 
          course_id, 
          module_id, 
          image_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
        [
          teacher_id,
          questionText,
          correctAnswer,
          preparedOptions[0]?.text,
          preparedOptions[0]?.image,
          preparedOptions[1]?.text,
          preparedOptions[1]?.image,
          preparedOptions[2]?.text,
          preparedOptions[2]?.image,
          preparedOptions[3]?.text,
          preparedOptions[3]?.image,
          difficultyLevel,
          course_id || null,
          module_id || null,
          uploadedImageUrl,
        ]
      );

      res.status(201).json({ question: result.rows[0] });
    } catch (err) {
      console.error("Error adding question:", err);
      res.status(500).send("Error adding question");
    }
  });
};


const addSubjectiveQuestion = async (req, res) => {
  upload.fields([{ name: 'image', maxCount: 1 }])(req, res, async (err) => {
    if (err) {
      return res.status(500).send("Error uploading files.");
    }

    const {
      token: teacher_id,
      questionText,
      notes,
      difficultyLevel,
      marks,
      module_id,
      course_id,
    } = req.body;

    try {
      const uploadedImageUrl = req.files?.image?.[0]?.path || null;

      // Check if the question text already exists in the database
      const checkQuery = `
        SELECT COUNT(*) FROM subjective_questions WHERE question_text = $1
      `;
      const checkValues = [questionText];
      const checkResult = await pool.query(checkQuery, checkValues);

      if (checkResult.rows[0].count > 0) {
        return res.status(400).send("Question already exists in the database.");
      }

      // If the question does not exist, proceed with the insertion
      const result = await pool.query(
        `INSERT INTO subjective_questions (
          teacher_id,
          question_text,
          notes,
          difficulty_level,
          marks,
          module_id,
          course_id,
          image_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          teacher_id,
          questionText,
          notes,
          difficultyLevel,
          marks,
          module_id,
          course_id,
          uploadedImageUrl,
        ]
      );

      res.status(201).json({ question: result.rows[0] });
    } catch (err) {
      console.error("Error adding subjective question:", err);
      res.status(500).send("Error adding question");
    }
  });
};


const getObjectiveQuestionsWithoutImages = async (req, res) => {
  const { teacher_id, currentpage: page } = req.body;

  if (!teacher_id) {
    return res.status(400).send("Teacher ID is required.");
  }

  const limit = 25;
  const offset = (page - 1) * limit;

  try {
    // Fetch the rows matching the condition
    const result = await pool.query(
      `SELECT 
        obj_question_id, 
        teacher_id, 
        question_text, 
        correct_answer, 
        option_1, 
        option_2, 
        option_3, 
        option_4, 
        difficulty_level, 
        obj_question.course_id, 
        obj_question.module_id,
        courses.course_name AS course_name, 
        modules.module_name AS module_name
      FROM obj_question 
      JOIN courses ON obj_question.course_id = courses.id
      JOIN modules ON obj_question.module_id = modules.id
      WHERE teacher_id = $1 AND (image_url IS NULL OR image_url = '') 
      LIMIT $2 OFFSET $3;`,
      [teacher_id, limit, offset]
    );

    // Fetch the total count matching the condition
    const totalCountResult = await pool.query(
      `SELECT COUNT(*) AS total 
      FROM obj_question 
      WHERE teacher_id = $1 AND (image_url IS NULL OR image_url = '');`,
      [teacher_id]
    );

    const totalCount = totalCountResult.rows[0]?.total || 0;

    if (!result.rows.length) {
      return res.status(404).send("No objective questions found for this teacher.");
    }

    res.json({
      objective: result.rows,
      total: parseInt(totalCount, 10),
    });
  } catch (err) {
    console.error("Error fetching objective questions without images:", err);
    res.status(500).send("Error fetching objective questions without images");
  }
};



const getSubjectiveQuestionsWithoutImages = async (req, res) => {
  const { teacher_id, currentpage: page } = req.body;
  

  if (!teacher_id) {
    return res.status(400).send("Teacher ID is required.");
  }

  const limit = 25;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT 
          subj_question_id, 
          teacher_id, 
          question_text, 
          difficulty_level, 
          subjective_questions.course_id, 
          subjective_questions.module_id,
         courses.course_name AS course_name, 
          modules.module_name AS module_name,
          notes,
          marks
        FROM subjective_questions 
        JOIN courses ON subjective_questions.course_id = courses.id
        JOIN modules ON subjective_questions.module_id = modules.id
        WHERE teacher_id = $1 AND image_url IS NULL 
        LIMIT $2 OFFSET $3`,
      [teacher_id, limit, offset]
    );

    const totalCountResult = await pool.query(
      `SELECT COUNT(*) AS total 
        FROM subjective_questions 
        WHERE teacher_id = $1 AND image_url IS NULL`,
      [teacher_id]
    );

    const totalCount = totalCountResult.rows[0]?.total || 0;

    if (!result.rows.length) {
      return res.status(404).send("No subjective questions found for this teacher.");
    }

    res.json({
      subjective: result.rows,
      total: parseInt(totalCount, 10),
    });
  } catch (err) {
    console.error("Error fetching subjective questions without images:", err);
    res.status(500).send("Error fetching subjective questions without images");
  }
};



const getObjectiveQuestionsWithImages = async (req, res) => {
  const { teacher_id, page  } = req.body;
console.log('req.body', req.body)
  if (!teacher_id) {
    return res.status(400).send("Teacher ID is required.");
  }

  const limit = 4;
  const offset = (page - 1) * limit;

  try {
  
    const result = await pool.query(
      `SELECT 
      obj_question.obj_question_id, 
      obj_question.teacher_id, 
      obj_question.question_text, 
      obj_question.correct_answer, 
      obj_question.option_1, 
      obj_question.option_2, 
      obj_question.option_3, 
      obj_question.option_4, 
      obj_question.difficulty_level, 
      obj_question.course_id, 
      obj_question.module_id,
      obj_question.image_url, 
      obj_question.option_1_image, 
      obj_question.option_2_image, 
      obj_question.option_3_image, 
      obj_question.option_4_image,
      courses.course_name AS course_name, 
      modules.module_name AS module_name
FROM obj_question 
JOIN courses ON obj_question.course_id = courses.id
JOIN modules ON obj_question.module_id = modules.id
WHERE obj_question.teacher_id = $1 AND (obj_question.image_url IS NOT NULL AND obj_question.image_url != '')
LIMIT $2 OFFSET $3;

`,
      [teacher_id, limit, offset]
    );

   
    const totalCountResult = await pool.query(
      `SELECT COUNT(*) AS total 
        FROM obj_question 
        WHERE teacher_id = $1 AND image_url IS NOT NULL`,
      [teacher_id]
    );

    const totalCount = totalCountResult.rows[0]?.total || 0;

    if (!result.rows.length) {
      return res.status(404).send("No objective questions with images found for this teacher.");
    }

    res.json({
      objective: result.rows,
      total: parseInt(totalCount, 10),
    });
  } catch (err) {
    console.error("Error fetching objective questions with images:", err);
    res.status(500).send("Error fetching objective questions with images");
  }
};

const getSubjectiveQuestionsWithImages = async (req, res) => {
  const { teacher_id, page = 1 } = req.body;
console.log('req.body', req.body)
  console.log('req.body', req.body);

  if (!teacher_id) {
    return res.status(400).send("Teacher ID is required.");
  }

  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT 
          subjective_questions.subj_question_id, 
          subjective_questions.teacher_id, 
          subjective_questions.question_text, 
          subjective_questions.difficulty_level, 
          subjective_questions.notes, 
          subjective_questions.image_url, 
          subjective_questions.marks,
          subjective_questions.course_id, 
          subjective_questions.module_id,
          courses.course_name AS course_name, 
          modules.module_name AS module_name
        FROM subjective_questions
        JOIN courses ON subjective_questions.course_id = courses.id
        JOIN modules ON subjective_questions.module_id = modules.id
        WHERE subjective_questions.teacher_id = $1 
          AND (subjective_questions.image_url IS NOT NULL AND subjective_questions.image_url != '')
        LIMIT $2 OFFSET $3`,
      [teacher_id, limit, offset]
    );

    // Fetch the total count
    const totalCountResult = await pool.query(
      `SELECT COUNT(*) AS total 
        FROM subjective_questions
        WHERE teacher_id = $1 
          AND (image_url IS NOT NULL AND image_url != '')`,
      [teacher_id]
    );

    const totalCount = totalCountResult.rows[0]?.total || 0;

    if (!result.rows.length) {
      return res.status(404).send("No subjective questions with images found for this teacher.");
    }

    res.json({
      subjective: result.rows,
      total: parseInt(totalCount, 10),
    });
  } catch (err) {
    console.error("Error fetching subjective questions with images:", err);
    res.status(500).send("Error fetching subjective questions with images");
  }
};




const deleteQuestion = async (req, res) => {
  const { id:question_id, teacher_id, type } = req.body;
console.log('req.body', req.body)
  

  const tableName = type === "sub" ? "subjective_questions" : type === "obj" ? "obj_question" : null;

  if (!tableName) {
    return res.status(400).send("Invalid type. Must be 'sub' or 'obj'.");
  }

  try {
  
    

    const result = await pool.query(
      `DELETE FROM ${tableName} 
        WHERE ${tableName === "subjective_questions" ? "subj_question_id" : "obj_question_id"} = $1 
          AND teacher_id = $2
        RETURNING *`,
      [question_id, teacher_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Question not found or you're not authorized to delete this question.");
    }

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).send("Error deleting question");
  }
};



const importObj = async (req, res) => {
  const { data, teacher_id = 14 } = req.body;

  let skippedCount = 0;
  let addedCount = 0;

  try {
    for (const question of data) {
      const {
        Question_Text,
        Option_1,
        Option_2,
        Option_3,
        Option_4,
        Correct_Answer,
        Difficulty_Level,
        Course,
        Module,
      } = question;

      const checkQuery = `
        SELECT COUNT(*) FROM obj_question WHERE question_text = $1
      `;
      const checkValues = [Question_Text];

      const result = await pool.query(checkQuery, checkValues);
      const count = result.rows[0].count;

      if (count > 0) {
        skippedCount++;
        continue;
      }

      const query = `
        INSERT INTO obj_question (
          question_text, 
          correct_answer, 
          option_1, 
          option_2, 
          option_3, 
          option_4, 
          difficulty_level, 
          teacher_id, 
          course_id, 
          module_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;
      const values = [
        Question_Text,
        Correct_Answer,
        Option_1,
        Option_2,
        Option_3,
        Option_4,
        Difficulty_Level,
        teacher_id,
        Course,
        Module,
      ];

      await pool.query(query, values);
      addedCount++;
    }

    console.log(`Total Obj skipped questions: ${skippedCount}`);
    console.log(`Total Obj added questions: ${addedCount}`);

    return res
      .status(200)
      .json({ message: "Objective questions imported successfully", skippedCount, addedCount });
  } catch (error) {
    console.error("Error importing objective questions:", error);
    return res
      .status(500)
      .json({ message: "Error importing objective questions", error });
  }
};



const importSub = async (req, res) => {
  const { data, teacher_id } = req.body;

  let skippedCount = 0;
  let addedCount = 0;

  try {
    for (const question of data) {
      const {
        Question_Text,
        Marks,
        Notes,
        Course,
        Module,
        Difficulty_Level,
      } = question;

      const checkQuery = `
        SELECT COUNT(*) FROM subjective_questions WHERE question_text = $1
      `;
      const checkValues = [Question_Text];

      const result = await pool.query(checkQuery, checkValues);
      const count = result.rows[0].count;

      if (count > 0) {
        skippedCount++;
        continue;
      }

      const query = `
        INSERT INTO subjective_questions (
          question_text, 
          difficulty_level, 
          teacher_id, 
          course_id, 
          module_id, 
          notes, 
          marks
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      const values = [
        Question_Text,
        Difficulty_Level,
        teacher_id,
        Course,
        Module,
        Notes,
        Marks,
      ];

      await pool.query(query, values);
      addedCount++;
    }

    console.log(`Total Sub skipped questions: ${skippedCount}`);
    console.log(`Total Sub added questions: ${addedCount}`);

    return res
      .status(200)
      .json({ message: "Subjective questions imported successfully", skippedCount, addedCount });
  } catch (error) {
    console.error("Error importing subjective questions:", error);
    return res
      .status(500)
      .json({ message: "Error importing subjective questions", error });
  }
};





module.exports = {
  addObjQuestion,
  addSubjectiveQuestion,
  updateQuestion,
  getObjectiveQuestionsWithoutImages,
  getSubjectiveQuestionsWithoutImages,
  getObjectiveQuestionsWithImages,
  getSubjectiveQuestionsWithImages,
  deleteQuestion,
  importSub,
  importObj,
  getAllCourses,
  getModulesForCourse
};
