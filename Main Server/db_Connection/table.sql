-- Create table for 'teacher'
CREATE TABLE IF NOT EXISTS teacher (
    teacher_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    phone VARCHAR(20),
    hire_date DATE,
    subject_specialization VARCHAR(255),
    address TEXT,
    required_objective_questions INT DEFAULT 0,
    required_subjective_questions INT DEFAULT 0
);

-- Create table for 'courses'
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL,
    total_modules INT NOT NULL
);

-- Create table for 'modules'
CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    module_name VARCHAR(255) NOT NULL,
    description TEXT,
    course_id INT NOT NULL,
    CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Create table for 'obj_question'
CREATE TABLE IF NOT EXISTS obj_question (
    obj_question_id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    correct_answer VARCHAR(255),
    option_1 VARCHAR(255),
    option_2 VARCHAR(255),
    option_3 VARCHAR(255),
    option_4 VARCHAR(255),
    difficulty_level VARCHAR(10) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    teacher_id INT,
    image_url TEXT,
    option_1_image TEXT,
    option_2_image TEXT,
    option_3_image TEXT,
    option_4_image TEXT,
    course_id INT,
    module_id INT,
    CONSTRAINT obj_question_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id) ON DELETE SET NULL,
    CONSTRAINT obj_question_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT obj_question_module_id_fkey FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- Create table for 'subjective_questions'
CREATE TABLE IF NOT EXISTS subjective_questions (
    subj_question_id SERIAL PRIMARY KEY,
    question_text TEXT NOT NULL,
    difficulty_level VARCHAR(10) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    teacher_id INT,
    notes TEXT,
    image_url TEXT,
    course_id INT,
    module_id INT,
    marks INT,
    CONSTRAINT subjective_questions_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id) ON DELETE SET NULL,
    CONSTRAINT subjective_questions_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT subjective_questions_module_id_fkey FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);
