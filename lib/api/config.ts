export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

export const getAuthHeadersFormData = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Re-export for backward compatibility during migration
export { API_URL as API_URL_FROM_CONFIG };

