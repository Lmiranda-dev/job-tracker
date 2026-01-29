import React, { useState, useEffect } from 'react';
import { getCompanies, createCompany } from '../services/api';

function ApplicationForm({ onSubmit, onCancel }) {
  const [companies, setCompanies] = useState([]);
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [formData, setFormData] = useState({
    company_id: '',
    job_title: '',
    job_description: '',
    job_url: '',
    location: '',
    salary_range: '',
    work_type: 'Remote',
    application_date: new Date().toISOString().split('T')[0],
    application_status: 'Applied',
    priority: 'Medium',
    source: '',
    notes: ''
  });

  const [newCompany, setNewCompany] = useState({
    company_name: '',
    industry: '',
    company_size: '',
    website_url: ''
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await getCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCompanyChange = (e) => {
    setNewCompany({
      ...newCompany,
      [e.target.name]: e.target.value
    });
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      const response = await createCompany(newCompany);
      setCompanies([...companies, response.data]);
      setFormData({ ...formData, company_id: response.data.company_id });
      setShowNewCompany(false);
      setNewCompany({ company_name: '', industry: '', company_size: '', website_url: '' });
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  };

  return (
    <div style={{ 
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '800px'
    }}>
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', maxWidth: '800px', width: '100%' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', width: '100%' }}>Add New Application</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Company Selection */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Company *</label>
          {!showNewCompany ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                required
                style={{ ...inputStyle, flex: 1 }}
              >
                <option value="">Select a company</option>
                {companies.map(company => (
                  <option key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCompany(true)}
                style={{ ...buttonStyle, backgroundColor: '#E5E7EB', color: '#374151' }}
              >
                + New
              </button>
            </div>
          ) : (
            <div style={{ border: '1px solid #D1D5DB', borderRadius: '6px', padding: '16px' }}>
              <h3 style={{ fontWeight: '500', marginBottom: '12px' }}>Add New Company</h3>
              <input
                type="text"
                name="company_name"
                placeholder="Company Name *"
                value={newCompany.company_name}
                onChange={handleCompanyChange}
                required
                style={{ ...inputStyle, marginBottom: '8px' }}
              />
              <input
                type="text"
                name="industry"
                placeholder="Industry"
                value={newCompany.industry}
                onChange={handleCompanyChange}
                style={{ ...inputStyle, marginBottom: '8px' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleAddCompany}
                  style={{ ...buttonStyle, backgroundColor: '#10B981', color: 'white' }}
                >
                  Add Company
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewCompany(false)}
                  style={{ ...buttonStyle, backgroundColor: '#E5E7EB', color: '#374151' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Job Title */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Job Title *</label>
          <input
            type="text"
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* Location */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Remote, New York, NY"
            style={inputStyle}
          />
        </div>

        {/* Work Type and Salary in one row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Work Type</label>
            <select
              name="work_type"
              value={formData.work_type}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Salary Range</label>
            <input
              type="text"
              name="salary_range"
              value={formData.salary_range}
              onChange={handleChange}
              placeholder="e.g., $80k-$100k"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Application Date and Source in one row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Application Date *</label>
            <input
              type="date"
              name="application_date"
              value={formData.application_date}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Source</label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select source</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Indeed">Indeed</option>
              <option value="Company Website">Company Website</option>
              <option value="Referral">Referral</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Job URL */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Job URL</label>
          <input
            type="url"
            name="job_url"
            value={formData.job_url}
            onChange={handleChange}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>

        {/* Notes */}
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            style={inputStyle}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="submit"
            style={{ ...buttonStyle, backgroundColor: '#3B82F6', color: 'white' }}
          >
            Add Application
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{ ...buttonStyle, backgroundColor: '#E5E7EB', color: '#374151' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default ApplicationForm;