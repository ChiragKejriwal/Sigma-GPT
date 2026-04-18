const API_BASE = 'http://localhost:8080/api/chat';

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || data?.error || 'Request failed');
  }

  return response.json();
}

export async function requestReply(message, threadId) {
  return apiRequest('/chatMessage', {
    method: 'POST',
    body: JSON.stringify({
      message,
      threadId,
    }),
  });
}

export async function fetchThreads() {
  return apiRequest('/threads');
}

export async function fetchThreadMessages(threadId) {
  return apiRequest(`/threads/${threadId}`);
}

export async function removeThread(threadId) {
  return apiRequest(`/threads/${threadId}`, {
    method: 'DELETE',
  });
}
