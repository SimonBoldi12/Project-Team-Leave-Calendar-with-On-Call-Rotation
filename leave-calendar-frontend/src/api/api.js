import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8080/api' })

export const getMembers = () => api.get('/members').then(r => r.data)

export const getLeaveRequests = (params = {}) =>
  api.get('/leave-requests', { params }).then(r => r.data)

export const getLeaveRequest = id =>
  api.get(`/leave-requests/${id}`).then(r => r.data)

export const createLeaveRequest = data =>
  api.post('/leave-requests', data).then(r => r.data)

export const updateLeaveStatus = (id, status) =>
  api.patch(`/leave-requests/${id}/status`, { status }).then(r => r.data)

export const deleteLeaveRequest = id =>
  api.delete(`/leave-requests/${id}`)

export const getOnCallSchedule = (from, weeks = 8) =>
  api.get('/oncall', { params: { from, weeks } }).then(r => r.data)

export const getCurrentOnCall = () =>
  api.get('/oncall/current').then(r => r.data)
