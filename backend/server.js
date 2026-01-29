const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== COMPANIES ROUTES ====================

// Get all companies
app.get('/api/companies', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM companies ORDER BY company_name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new company
app.post('/api/companies', async (req, res) => {
  try {
    const { company_name, industry, company_size, website_url, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO companies (company_name, industry, company_size, website_url, notes) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [company_name, industry, company_size, website_url, notes]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== APPLICATIONS ROUTES ====================

// Get all applications with company info
app.get('/api/applications', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, c.company_name, c.industry 
       FROM applications a
       LEFT JOIN companies c ON a.company_id = c.company_id
       ORDER BY a.application_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single application
app.get('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT a.*, c.company_name 
       FROM applications a
       LEFT JOIN companies c ON a.company_id = c.company_id
       WHERE a.application_id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new application
app.post('/api/applications', async (req, res) => {
  try {
    const {
      company_id, job_title, job_description, job_url, location,
      salary_range, work_type, application_date, application_status,
      priority, source, notes
    } = req.body;

    const result = await pool.query(
      `INSERT INTO applications 
       (company_id, job_title, job_description, job_url, location, 
        salary_range, work_type, application_date, application_status, 
        priority, source, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [company_id, job_title, job_description, job_url, location,
       salary_range, work_type, application_date, application_status,
       priority, source, notes]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update application
app.put('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company_id, job_title, job_description, job_url, location,
      salary_range, work_type, application_date, application_status,
      priority, source, notes
    } = req.body;

    const result = await pool.query(
      `UPDATE applications 
       SET company_id = $1, job_title = $2, job_description = $3, 
           job_url = $4, location = $5, salary_range = $6, work_type = $7,
           application_date = $8, application_status = $9, priority = $10,
           source = $11, notes = $12, updated_at = CURRENT_TIMESTAMP
       WHERE application_id = $13 
       RETURNING *`,
      [company_id, job_title, job_description, job_url, location,
       salary_range, work_type, application_date, application_status,
       priority, source, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update application status (quick update)
app.patch('/api/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { application_status } = req.body;

    const result = await pool.query(
      `UPDATE applications 
       SET application_status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE application_id = $2 
       RETURNING *`,
      [application_status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete application
app.delete('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM applications WHERE application_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== INTERACTIONS ROUTES ====================

// Get interactions for an application
app.get('/api/applications/:id/interactions', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT * FROM interactions 
       WHERE application_id = $1 
       ORDER BY interaction_date DESC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add interaction
app.post('/api/applications/:id/interactions', async (req, res) => {
  try {
    const { id } = req.params;
    const { interaction_type, interaction_date, notes, follow_up_date } = req.body;

    const result = await pool.query(
      `INSERT INTO interactions 
       (application_id, interaction_type, interaction_date, notes, follow_up_date)
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [id, interaction_type, interaction_date, notes, follow_up_date]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== STATS/DASHBOARD ROUTES ====================

// Get overview stats
app.get('/api/stats/overview', async (req, res) => {
  try {
    const totalApps = await pool.query('SELECT COUNT(*) FROM applications');
    const byStatus = await pool.query(
      `SELECT application_status, COUNT(*) 
       FROM applications 
       GROUP BY application_status`
    );
    const responseRate = await pool.query(
      `SELECT 
         COUNT(*) FILTER (WHERE application_status != 'Applied') * 100.0 / COUNT(*) as rate
       FROM applications`
    );

    res.json({
      total_applications: parseInt(totalApps.rows[0].count),
      by_status: byStatus.rows,
      response_rate: parseFloat(responseRate.rows[0].rate || 0).toFixed(1)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get applications by month
app.get('/api/stats/by-month', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         TO_CHAR(application_date, 'YYYY-MM') as month,
         COUNT(*) as count
       FROM applications
       GROUP BY month
       ORDER BY month DESC
       LIMIT 12`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});