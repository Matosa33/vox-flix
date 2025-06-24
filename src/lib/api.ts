const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// API Helper functions
export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(error.error || 'Request failed', response.status);
  }

  return response.json();
}

// Voice Models API
export async function fetchVoiceModels() {
  return apiRequest('/voice-models');
}

export async function fetchTranslations() {
  return apiRequest('/translations');
}

// Text-to-Speech API
export interface TTSRequest {
  voiceId: string;
  text: string;
  language?: string;
  speed?: number;
  pitch?: number;
}

export async function generateTTS(request: TTSRequest): Promise<string> {
  const response = await apiRequest('/tts', {
    method: 'POST',
    body: JSON.stringify(request),
  });
  
  // Return the audio URL
  return `http://localhost:4000${response.audioUrl}`;
}

// Model Management API
export async function getDownloadedModels() {
  return apiRequest('/models');
}

export async function downloadModel(modelId: string) {
  return apiRequest('/models/download', {
    method: 'POST',
    body: JSON.stringify({ modelId }),
  });
}

export async function deleteModel(modelId: string) {
  return apiRequest(`/models/${modelId}`, {
    method: 'DELETE',
  });
}

// Voice Cloning API
export interface VoiceCloneUpload {
  voiceName: string;
  description?: string;
  audioFiles: File[];
}

export async function uploadVoiceSamples(data: VoiceCloneUpload) {
  const formData = new FormData();
  formData.append('voiceName', data.voiceName);
  if (data.description) {
    formData.append('description', data.description);
  }
  
  data.audioFiles.forEach((file) => {
    formData.append('audio', file);
  });

  const response = await fetch(`${API_BASE}/voice-clone/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }));
    throw new ApiError(error.error || 'Upload failed', response.status);
  }

  return response.json();
}

export async function startVoiceTraining(voiceId: string, settings = {}) {
  return apiRequest('/voice-clone/train', {
    method: 'POST',
    body: JSON.stringify({ voiceId, settings }),
  });
}

export async function getTrainingStatus(voiceId: string) {
  return apiRequest(`/voice-clone/status/${voiceId}`);
}

export async function getClonedVoices() {
  return apiRequest('/voice-clone/my-voices');
}

export async function deleteClonedVoice(voiceId: string) {
  return apiRequest(`/voice-clone/${voiceId}`, {
    method: 'DELETE',
  });
}

export async function generateClonedTTS(voiceId: string, text: string, language = 'en-US'): Promise<string> {
  const response = await apiRequest('/voice-clone/generate', {
    method: 'POST',
    body: JSON.stringify({ voiceId, text, language }),
  });
  
  return `http://localhost:4000${response.audioUrl}`;
}

// Health check
export async function checkServerHealth() {
  return apiRequest('/health');
}
