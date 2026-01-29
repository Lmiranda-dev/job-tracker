import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    total_applications: 0,
    by_status: [],
    response_rate: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const getStatusCount = (status) => {
    const statusObj = stats.by_status.find(s => s.application_status === status);
    return statusObj ? parseInt(statusObj.count) : 0;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      {/* Total Applications */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#666', fontSize: '14px', fontWeight: '500', margin: '0 0 10px 0' }}>Total Applications</h3>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', margin: 0 }}>{stats.total_applications}</p>
      </div>

      {/* Pending */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#666', fontSize: '14px', fontWeight: '500', margin: '0 0 10px 0' }}>Pending</h3>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3B82F6', margin: 0 }}>
          {getStatusCount('Applied') + getStatusCount('Screening')}
        </p>
      </div>

      {/* Interviews */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#666', fontSize: '14px', fontWeight: '500', margin: '0 0 10px 0' }}>Interviews</h3>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#8B5CF6', margin: 0 }}>
          {getStatusCount('Interview Scheduled') + getStatusCount('Interviewed')}
        </p>
      </div>

      {/* Response Rate */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#666', fontSize: '14px', fontWeight: '500', margin: '0 0 10px 0' }}>Response Rate</h3>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>{stats.response_rate}%</p>
      </div>
    </div>
  );
}

export default Dashboard;