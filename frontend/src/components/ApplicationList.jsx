import React from 'react';

function ApplicationList({ applications, onStatusChange, onDelete }) {
  const statusColors = {
    'Applied': { bg: '#DBEAFE', color: '#1E40AF' },
    'Screening': { bg: '#FEF3C7', color: '#92400E' },
    'Interview Scheduled': { bg: '#E9D5FF', color: '#6B21A8' },
    'Interviewed': { bg: '#C7D2FE', color: '#3730A3' },
    'Offer': { bg: '#D1FAE5', color: '#065F46' },
    'Rejected': { bg: '#FEE2E2', color: '#991B1B' },
    'Withdrawn': { bg: '#F3F4F6', color: '#374151' }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const tableHeaderStyle = {
    padding: '12px 24px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    borderBottom: '1px solid #E5E7EB'
  };

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table style={{ width: '100%', backgroundColor: 'white', border: '1px solid #E5E7EB', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead style={{ backgroundColor: '#F9FAFB' }}>
          <tr>
            <th style={tableHeaderStyle}>Company</th>
            <th style={tableHeaderStyle}>Job Title</th>
            <th style={tableHeaderStyle}>Location</th>
            <th style={tableHeaderStyle}>Applied</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.application_id} style={{ borderBottom: '1px solid #E5E7EB' }}>
              <td style={{ padding: '16px 24px' }}>
                <div style={{ fontWeight: '500', color: '#111827' }}>{app.company_name}</div>
                <div style={{ fontSize: '14px', color: '#6B7280' }}>{app.industry}</div>
              </td>
              <td style={{ padding: '16px 24px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{app.job_title}</div>
                <div style={{ fontSize: '14px', color: '#6B7280' }}>{app.work_type}</div>
              </td>
              <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6B7280' }}>
                {app.location}
              </td>
              <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6B7280' }}>
                {formatDate(app.application_date)}
              </td>
              <td style={{ padding: '16px 24px' }}>
                <select
                  value={app.application_status}
                  onChange={(e) => onStatusChange(app.application_id, e.target.value)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: statusColors[app.application_status].bg,
                    color: statusColors[app.application_status].color,
                    cursor: 'pointer'
                  }}
                >
                  <option value="Applied">Applied</option>
                  <option value="Screening">Screening</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Interviewed">Interviewed</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </td>
              <td style={{ padding: '16px 24px', fontSize: '14px' }}>
                <button
                  onClick={() => onDelete(app.application_id)}
                  style={{
                    color: '#DC2626',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationList;