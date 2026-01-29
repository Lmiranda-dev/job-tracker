import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Applications
export const getApplications = () => axios.get(`${API_URL}/applications`);
export const getApplication = (id) => axios.get(`${API_URL}/applications/${id}`);
export const createApplication = (data) => axios.post(`${API_URL}/applications`, data);
export const updateApplication = (id, data) => axios.put(`${API_URL}/applications/${id}`, data);
export const updateApplicationStatus = (id, status) => 
  axios.patch(`${API_URL}/applications/${id}/status`, { application_status: status });
export const deleteApplication = (id) => axios.delete(`${API_URL}/applications/${id}`);

// Companies
export const getCompanies = () => axios.get(`${API_URL}/companies`);
export const createCompany = (data) => axios.post(`${API_URL}/companies`, data);

// Interactions
export const getInteractions = (appId) => axios.get(`${API_URL}/applications/${appId}/interactions`);
export const createInteraction = (appId, data) => 
  axios.post(`${API_URL}/applications/${appId}/interactions`, data);

// Stats
export const getStats = () => axios.get(`${API_URL}/stats/overview`);
export const getStatsByMonth = () => axios.get(`${API_URL}/stats/by-month`);