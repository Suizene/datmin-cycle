// API endpoints configuration
// Uses relative URLs because of the proxy in package.json
export default {
  // Auth endpoints
  login: '/api/auth/login',
  register: '/api/auth/register',
  profile: '/api/auth/profile',
  
  // Motorcycle endpoints
  motorcycles: '/api/motorcycles',
  motorcycle: (id) => `/api/motorcycles/${id}`,
  
  // Parts endpoints
  parts: '/api/parts',
  part: (id) => `/api/parts/${id}`,
  
  // Health check
  health: '/api/health'
};
