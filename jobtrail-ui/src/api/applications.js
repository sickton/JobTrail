import client from './client'

export const getApplications = () =>
  client.get('/api/applications').then((r) => r.data)

export const createApplication = (data) =>
  client.post('/api/applications', data).then((r) => r.data)

export const updateApplication = (id, data) =>
  client.put(`/api/applications/${id}`, data).then((r) => r.data)

export const deleteApplication = (id) =>
  client.delete(`/api/applications/${id}`)
