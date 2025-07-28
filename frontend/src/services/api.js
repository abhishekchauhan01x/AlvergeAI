// API utility for chat app
export const fetchConversations = async (token) => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'}/chat/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) {
    const error = new Error(`HTTP error! status: ${res.status}`);
    error.status = res.status;
    throw error;
  }
  
  return await res.json();
};

export const fetchMessages = async (token, convId) => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:3000/api'}/chat/${convId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) {
    const error = new Error(`HTTP error! status: ${res.status}`);
    error.status = res.status;
    throw error;
  }
  
  return await res.json();
}; 