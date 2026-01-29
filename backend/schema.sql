-- COMPANIES TABLE
CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    website_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- APPLICATIONS TABLE
CREATE TABLE applications (
    application_id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(company_id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    job_description TEXT,
    job_url VARCHAR(500),
    location VARCHAR(255),
    salary_range VARCHAR(100),
    work_type VARCHAR(50),
    application_date DATE NOT NULL,
    application_status VARCHAR(50) DEFAULT 'Applied',
    priority VARCHAR(20) DEFAULT 'Medium',
    source VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INTERACTIONS TABLE
CREATE TABLE interactions (
    interaction_id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(application_id) ON DELETE CASCADE,
    interaction_type VARCHAR(50) NOT NULL,
    interaction_date DATE NOT NULL,
    notes TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CONTACTS TABLE
CREATE TABLE contacts (
    contact_id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(company_id) ON DELETE CASCADE,
    contact_name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    linkedin_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX idx_applications_status ON applications(application_status);
CREATE INDEX idx_applications_date ON applications(application_date);
CREATE INDEX idx_applications_company ON applications(company_id);
CREATE INDEX idx_interactions_date ON interactions(interaction_date);