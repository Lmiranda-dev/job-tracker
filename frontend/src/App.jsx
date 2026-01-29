import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard.jsx';
import ApplicationList from './components/ApplicationList.jsx';
import ApplicationForm from './components/ApplicationForm.jsx';
import { getApplications, createApplication, updateApplicationStatus, deleteApplication } from './services/api';

function App() {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await getApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Error loading applications:', error);
      alert('Failed to load applications. Make sure the backend is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddApplication = async (formData) => {
    try {
      await createApplication(formData);
      loadApplications();
      setShowForm(false);
      alert('Application added successfully!');
    } catch (error) {
      console.error('Error adding application:', error);
      alert('Failed to add application');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      loadApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApplication(id);
        loadApplications();
      } catch (error) {
        console.error('Error deleting application:', error);
        alert('Failed to delete application');
      }
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '20px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '24px 32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Job Application Tracker</h1>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '32px', backgroundColor: '#FFFFFF' }}>
        {!showForm ? (
          <>
            {/* Dashboard Stats */}
            <Dashboard />

            {/* Add Application Button */}
            <div style={{ marginBottom: '24px' }}>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                + Add New Application
              </button>
            </div>

            {/* Applications List */}
            {applications.length === 0 ? (
              <div style={{ backgroundColor: 'white', padding: '48px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <p style={{ color: '#6B7280', fontSize: '18px' }}>No applications yet. Click "Add New Application" to get started!</p>
              </div>
            ) : (
              <ApplicationList
                applications={applications}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            )}
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '20px 0' }}>
            <div style={{ width: '100%', maxWidth: '900px' }}>
              <ApplicationForm
                onSubmit={handleAddApplication}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;