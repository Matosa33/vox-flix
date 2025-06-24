import { ttsManager, Voice, TTSOptions } from '../tts-services';
import { TextProcessor, TextChunk } from '../text-processor';

// Local storage keys
const STORAGE_KEYS = {
  CLONED_VOICES: 'voxflix_cloned_voices',
  TTS_HISTORY: 'voxflix_tts_history',
  USER_SETTINGS: 'voxflix_settings'
};

// API Error class
export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Voice model interface
export interface VoiceModel {
  id: string;
  name: string;
  languages: string[];
  provider: string;
  isCloned?: boolean;
  preview?: string;
  createdAt?: string;
}

// TTS Request interface
export interface TTSRequest {
  text: string;
  voiceId: string;
  language?: string;
  speed?: number;
  pitch?: number;
  provider?: string;
}

// TTS History interface
export interface TTSHistoryItem {
  id: string;
  text: string;
  voiceId: string;
  voiceName: string;
  provider: string;
  createdAt: string;
  audioUrl?: string;
}

// Fetch all available voice models
export async function fetchVoiceModels(): Promise<VoiceModel[]> {
  try {
    const voices = await ttsManager.getAllVoices();
    
    // Get cloned voices from local storage
    const clonedVoices = getStoredClonedVoices();
    
    // Combine API voices with cloned voices
    const allVoices = [
      ...voices.map(v => ({
        id: v.id,
        name: v.name,
        languages: [v.language],
        provider: v.provider,
        preview: v.preview,
        isCloned: v.isCloned
      })),
      ...clonedVoices
    ];
    
    return allVoices;
  } catch (error) {
    console.error('Failed to fetch voice models:', error);
    // Return local/default voices as fallback
    return getDefaultVoices();
  }
}

// Generate TTS
export async function generateTTS(request: TTSRequest): Promise<string> {
  try {
    // Validate text
    const validation = TextProcessor.validateTextLength(request.text);
    if (!validation.valid) {
      throw new Error(validation.message);
    }
    
    // Clean text
    const cleanedText = TextProcessor.cleanTextForTTS(request.text);
    
    // Check if text needs chunking
    const chunks = TextProcessor.chunkText(cleanedText);
    
    if (chunks.length === 1) {
      // Single chunk - process normally
      return await processSingleChunk(request, cleanedText);
    } else {
      // Multiple chunks - process and combine
      return await processMultipleChunks(request, chunks);
    }
  } catch (error) {
    console.error('TTS generation failed:', error);
    throw error;
  }
}

// Process single chunk
async function processSingleChunk(request: TTSRequest, text: string): Promise<string> {
  const provider = ttsManager.getProvider(request.provider);
  
  const options: TTSOptions = {
    voiceId: request.voiceId,
    language: request.language,
    speed: request.speed,
    pitch: request.pitch
  };
  
  const result = await provider.generateSpeech(text, options);
  
  // Convert audio data to blob URL if needed
  if (result.audioData) {
    const blob = new Blob([result.audioData], { type: `audio/${result.format}` });
    const audioUrl = URL.createObjectURL(blob);
    
    // Save to history
    saveToHistory({
      text: request.text,
      voiceId: request.voiceId,
      voiceName: await getVoiceName(request.voiceId),
      provider: provider.name,
      audioUrl
    });
    
    return audioUrl;
  } else if (result.audioUrl) {
    saveToHistory({
      text: request.text,
      voiceId: request.voiceId,
      voiceName: await getVoiceName(request.voiceId),
      provider: provider.name,
      audioUrl: result.audioUrl
    });
    
    return result.audioUrl;
  }
  
  throw new Error('No audio data received');
}

// Process multiple chunks
async function processMultipleChunks(request: TTSRequest, chunks: TextChunk[]): Promise<string> {
  const provider = ttsManager.getProvider(request.provider);
  const audioChunks: ArrayBuffer[] = [];
  
  // Process each chunk
  for (const chunk of chunks) {
    const options: TTSOptions = {
      voiceId: request.voiceId,
      language: request.language,
      speed: request.speed,
      pitch: request.pitch
    };
    
    const result = await provider.generateSpeech(chunk.text, options);
    
    if (result.audioData) {
      audioChunks.push(result.audioData);
    }
  }
  
  // Combine audio chunks
  const combinedAudio = combineAudioChunks(audioChunks);
  const blob = new Blob([combinedAudio], { type: 'audio/wav' });
  const audioUrl = URL.createObjectURL(blob);
  
  // Save to history
  saveToHistory({
    text: request.text,
    voiceId: request.voiceId,
    voiceName: await getVoiceName(request.voiceId),
    provider: provider.name,
    audioUrl
  });
  
  return audioUrl;
}

// Combine audio chunks (simplified version)
function combineAudioChunks(chunks: ArrayBuffer[]): ArrayBuffer {
  // This is a simplified version - in production, you'd properly combine WAV files
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const combined = new Uint8Array(totalLength);
  
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(new Uint8Array(chunk), offset);
    offset += chunk.byteLength;
  }
  
  return combined.buffer;
}

// Voice Cloning
export interface VoiceCloneUpload {
  voiceName: string;
  description?: string;
  audioFiles: File[];
  provider?: string;
}

export async function uploadVoiceSamples(data: VoiceCloneUpload): Promise<string> {
  const provider = ttsManager.getProvider(data.provider);
  
  if (!provider.supportsCloning) {
    throw new Error(`${provider.name} does not support voice cloning`);
  }
  
  // Validate audio files
  const maxSize = parseInt(import.meta.env.VITE_MAX_AUDIO_SIZE || '10485760');
  for (const file of data.audioFiles) {
    if (file.size > maxSize) {
      throw new Error(`File ${file.name} is too large. Max size is ${maxSize / 1048576}MB`);
    }
  }
  
  // Clone voice
  const voiceId = await provider.cloneVoice!(data.audioFiles, data.voiceName);
  
  // Save to local storage
  const clonedVoice: VoiceModel = {
    id: voiceId,
    name: data.voiceName,
    languages: ['multilingual'],
    provider: provider.name,
    isCloned: true,
    createdAt: new Date().toISOString()
  };
  
  saveClonedVoice(clonedVoice);
  
  return voiceId;
}

// Local storage functions
function getStoredClonedVoices(): VoiceModel[] {
  const stored = localStorage.getItem(STORAGE_KEYS.CLONED_VOICES);
  return stored ? JSON.parse(stored) : [];
}

function saveClonedVoice(voice: VoiceModel) {
  const voices = getStoredClonedVoices();
  voices.push(voice);
  localStorage.setItem(STORAGE_KEYS.CLONED_VOICES, JSON.stringify(voices));
}

export function deleteClonedVoice(voiceId: string) {
  const voices = getStoredClonedVoices().filter(v => v.id !== voiceId);
  localStorage.setItem(STORAGE_KEYS.CLONED_VOICES, JSON.stringify(voices));
}

// History functions
export function getTTSHistory(): TTSHistoryItem[] {
  const stored = localStorage.getItem(STORAGE_KEYS.TTS_HISTORY);
  return stored ? JSON.parse(stored) : [];
}

function saveToHistory(item: Omit<TTSHistoryItem, 'id' | 'createdAt'>) {
  const history = getTTSHistory();
  history.unshift({
    ...item,
    id: `history_${Date.now()}`,
    createdAt: new Date().toISOString()
  });
  
  // Keep only last 50 items
  if (history.length > 50) {
    history.splice(50);
  }
  
  localStorage.setItem(STORAGE_KEYS.TTS_HISTORY, JSON.stringify(history));
}

// Helper functions
async function getVoiceName(voiceId: string): Promise<string> {
  const voices = await fetchVoiceModels();
  const voice = voices.find(v => v.id === voiceId);
  return voice?.name || voiceId;
}

function getDefaultVoices(): VoiceModel[] {
  return [
    { id: 'default_en', name: 'English (Default)', languages: ['en'], provider: 'coqui' },
    { id: 'default_es', name: 'Spanish (Default)', languages: ['es'], provider: 'coqui' },
    { id: 'default_fr', name: 'French (Default)', languages: ['fr'], provider: 'coqui' },
    { id: 'default_de', name: 'German (Default)', languages: ['de'], provider: 'coqui' }
  ];
}

// Settings functions
export interface UserSettings {
  defaultProvider: string;
  defaultLanguage: string;
  defaultSpeed: number;
  autoPlay: boolean;
}

export function getUserSettings(): UserSettings {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
  return stored ? JSON.parse(stored) : {
    defaultProvider: 'coqui',
    defaultLanguage: 'en',
    defaultSpeed: 1.0,
    autoPlay: true
  };
}

export function saveUserSettings(settings: UserSettings) {
  localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
}

// Model management (for Coqui/local models)
export async function downloadModel(modelId: string): Promise<void> {
  // This would trigger a download of a Coqui model
  // For now, we'll just simulate it
  console.log(`Downloading model: ${modelId}`);
  return new Promise(resolve => setTimeout(resolve, 2000));
}

export async function deleteModel(modelId: string): Promise<void> {
  // This would delete a local model
  console.log(`Deleting model: ${modelId}`);
  return Promise.resolve();
}

// Export for backwards compatibility
export const getClonedVoices = () => {
  return getStoredClonedVoices().filter(v => v.isCloned);
};

export const getTrainingStatus = async (voiceId: string) => {
  // Simulate training status
  return { status: 'completed', progress: 100 };
};

export const checkServerHealth = async () => {
  return { status: 'ok', service: ttsManager.getProvider().name };
};

// Fetch translations (for backwards compatibility)
export async function fetchTranslations() {
  return {
    en: { home: 'Home', browse: 'Browse', myVoices: 'My Voices' },
    fr: { home: 'Accueil', browse: 'Parcourir', myVoices: 'Mes Voix' },
    es: { home: 'Inicio', browse: 'Explorar', myVoices: 'Mis Voces' },
    de: { home: 'Startseite', browse: 'Durchsuchen', myVoices: 'Meine Stimmen' }
  };
}

// For voice training (simplified)
export async function startVoiceTraining(voiceId: string, settings = {}) {
  // In a real implementation, this would start training on a server
  console.log(`Starting training for voice ${voiceId}`, settings);
  return { trainingId: `training_${Date.now()}`, status: 'started' };
}

// Generate with cloned voice
export async function generateClonedTTS(voiceId: string, text: string, language = 'en'): Promise<string> {
  return generateTTS({
    text,
    voiceId,
    language,
    provider: 'coqui' // Cloned voices typically use the same provider
  });
}
