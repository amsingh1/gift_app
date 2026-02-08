const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
};

// Auth
export const signup = (data) =>
  fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const login = (data) =>
  fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const getMe = () =>
  fetch(`${API_BASE}/auth/me`, { headers: getHeaders() }).then(handleResponse);

export const updateProfile = (data) =>
  fetch(`${API_BASE}/auth/profile`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

// Events
export const getEvents = () =>
  fetch(`${API_BASE}/events`, { headers: getHeaders() }).then(handleResponse);

export const createEvent = (data) =>
  fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const getEvent = (id) =>
  fetch(`${API_BASE}/events/${id}`, { headers: getHeaders() }).then(handleResponse);

export const updateEvent = (id, data) =>
  fetch(`${API_BASE}/events/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteEvent = (id) =>
  fetch(`${API_BASE}/events/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse);

// Gifts
export const getGiftsByEvent = (eventId) =>
  fetch(`${API_BASE}/gifts/event/${eventId}`, { headers: getHeaders() }).then(handleResponse);

export const createGift = (data) =>
  fetch(`${API_BASE}/gifts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateGift = (id, data) =>
  fetch(`${API_BASE}/gifts/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteGift = (id) =>
  fetch(`${API_BASE}/gifts/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse);

export const reserveGift = (id) =>
  fetch(`${API_BASE}/gifts/${id}/reserve`, {
    method: 'PATCH',
    headers: getHeaders(),
  }).then(handleResponse);

// Sharing
export const createShareLink = (eventId, expiresInDays) =>
  fetch(`${API_BASE}/sharing/create-link`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ eventId, expiresInDays }),
  }).then(handleResponse);

export const acceptShareLink = (token) =>
  fetch(`${API_BASE}/sharing/accept/${token}`, {
    method: 'POST',
    headers: getHeaders(),
  }).then(handleResponse);

export const getSharedWithMe = () =>
  fetch(`${API_BASE}/sharing/shared-with-me`, { headers: getHeaders() }).then(handleResponse);

export const getEventMembers = (eventId) =>
  fetch(`${API_BASE}/sharing/event/${eventId}/members`, { headers: getHeaders() }).then(handleResponse);

export const removeEventMember = (eventId, userId) =>
  fetch(`${API_BASE}/sharing/event/${eventId}/member/${userId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse);

// Notifications
export const getNotifications = () =>
  fetch(`${API_BASE}/notifications`, { headers: getHeaders() }).then(handleResponse);

export const markNotificationRead = (id) =>
  fetch(`${API_BASE}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: getHeaders(),
  }).then(handleResponse);

export const markAllNotificationsRead = () =>
  fetch(`${API_BASE}/notifications/read-all`, {
    method: 'PATCH',
    headers: getHeaders(),
  }).then(handleResponse);
