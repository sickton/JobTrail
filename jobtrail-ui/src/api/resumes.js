import client from './client'

export const getResumes = () =>
    client.get('/api/resumes').then((r) => r.data)

export const addResume = (formData) =>
    client.post('/api/resumes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)

export const deleteResume = (id) =>
    client.delete(`/api/resumes/${id}`).then((r) => r.data)
