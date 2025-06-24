import axios from 'axios';

export interface TTSProvider {
  name: string;
  generateSpeech: (text: string, options: TTSOptions) => Promise<AudioResult>;
  listVoices: () => Promise<Voice[]>;
  supportsCloning: boolean;
  cloneVoice?: (samples: File[], voiceName: string) => Promise<string>;
}

export interface TTSOptions {
  voiceId: string;
  language?: string;
  speed?: number;
  pitch?: number;
  emotion?: string;
}

export interface AudioResult {
  audioUrl?: string;
  audioData?: ArrayBuffer;
  format: string;
}

export interface Voice {
  id: string;
  name: string;
  language: string;
  gender?: string;
  preview?: string;
  provider: string;
  isCloned?: boolean;
}

// Coqui TTS Provider (Local/Open Source)
export class CoquiTTSProvider implements TTSProvider {
  name = 'Coqui TTS';
  supportsCloning = true;
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:5002') {
    this.baseUrl = baseUrl;
  }

  async generateSpeech(text: string, options: TTSOptions): Promise<AudioResult> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/tts`,
        {
          text,
          speaker_wav: options.voiceId.startsWith('cloned_') ? options.voiceId : undefined,
          language: options.language || 'en',
          model_name: import.meta.env.VITE_COQUI_MODEL || 'tts_models/multilingual/multi-dataset/xtts_v2'
        },
        { responseType: 'arraybuffer' }
      );

      return {
        audioData: response.data,
        format: 'wav'
      };
    } catch (error) {
      console.error('Coqui TTS error:', error);
      throw new Error('Failed to generate speech with Coqui TTS');
    }
  }

  async listVoices(): Promise<Voice[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/speakers`);
      return response.data.map((speaker: any) => ({
        id: speaker.speaker_id,
        name: speaker.name,
        language: speaker.language || 'multilingual',
        provider: 'coqui',
        gender: speaker.gender
      }));
    } catch (error) {
      // Return default voices if API not available
      return [
        { id: 'default_en', name: 'English Speaker', language: 'en', provider: 'coqui' },
        { id: 'default_es', name: 'Spanish Speaker', language: 'es', provider: 'coqui' },
        { id: 'default_fr', name: 'French Speaker', language: 'fr', provider: 'coqui' },
        { id: 'default_de', name: 'German Speaker', language: 'de', provider: 'coqui' },
      ];
    }
  }

  async cloneVoice(samples: File[], voiceName: string): Promise<string> {
    const formData = new FormData();
    formData.append('voice_name', voiceName);
    samples.forEach((file, index) => {
      formData.append(`audio_${index}`, file);
    });

    try {
      const response = await axios.post(`${this.baseUrl}/api/clone`, formData);
      return response.data.voice_id;
    } catch (error) {
      console.error('Voice cloning error:', error);
      throw new Error('Failed to clone voice');
    }
  }
}

// ElevenLabs Provider
export class ElevenLabsProvider implements TTSProvider {
  name = 'ElevenLabs';
  supportsCloning = true;
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateSpeech(text: string, options: TTSOptions): Promise<AudioResult> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${options.voiceId}`,
        {
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: options.emotion || 0,
            use_speaker_boost: true
          }
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      return {
        audioData: response.data,
        format: 'mp3'
      };
    } catch (error) {
      console.error('ElevenLabs error:', error);
      throw new Error('Failed to generate speech with ElevenLabs');
    }
  }

  async listVoices(): Promise<Voice[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: { 'xi-api-key': this.apiKey }
      });

      return response.data.voices.map((voice: any) => ({
        id: voice.voice_id,
        name: voice.name,
        language: voice.labels?.language || 'en',
        gender: voice.labels?.gender,
        provider: 'elevenlabs',
        isCloned: voice.category === 'cloned',
        preview: voice.preview_url
      }));
    } catch (error) {
      console.error('Failed to fetch ElevenLabs voices:', error);
      return [];
    }
  }

  async cloneVoice(samples: File[], voiceName: string): Promise<string> {
    const formData = new FormData();
    formData.append('name', voiceName);
    formData.append('description', `Voice cloned via VoxFlix on ${new Date().toISOString()}`);
    samples.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(
        `${this.baseUrl}/voices/add`,
        formData,
        {
          headers: {
            'xi-api-key': this.apiKey
          }
        }
      );
      return response.data.voice_id;
    } catch (error) {
      console.error('ElevenLabs cloning error:', error);
      throw new Error('Failed to clone voice with ElevenLabs');
    }
  }
}

// OpenAI Provider
export class OpenAIProvider implements TTSProvider {
  name = 'OpenAI';
  supportsCloning = false;
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateSpeech(text: string, options: TTSOptions): Promise<AudioResult> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/audio/speech`,
        {
          model: 'tts-1-hd',
          input: text,
          voice: options.voiceId,
          speed: options.speed || 1.0
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      return {
        audioData: response.data,
        format: 'mp3'
      };
    } catch (error) {
      console.error('OpenAI TTS error:', error);
      throw new Error('Failed to generate speech with OpenAI');
    }
  }

  async listVoices(): Promise<Voice[]> {
    // OpenAI has fixed voices
    return [
      { id: 'alloy', name: 'Alloy', language: 'en', gender: 'neutral', provider: 'openai' },
      { id: 'echo', name: 'Echo', language: 'en', gender: 'male', provider: 'openai' },
      { id: 'fable', name: 'Fable', language: 'en', gender: 'male', provider: 'openai' },
      { id: 'onyx', name: 'Onyx', language: 'en', gender: 'male', provider: 'openai' },
      { id: 'nova', name: 'Nova', language: 'en', gender: 'female', provider: 'openai' },
      { id: 'shimmer', name: 'Shimmer', language: 'en', gender: 'female', provider: 'openai' }
    ];
  }
}

// TTS Service Manager
export class TTSServiceManager {
  private providers: Map<string, TTSProvider> = new Map();
  private activeProvider: string;

  constructor() {
    // Initialize providers based on environment variables
    const service = import.meta.env.VITE_TTS_SERVICE || 'coqui';
    
    // Always initialize Coqui as fallback
    this.providers.set('coqui', new CoquiTTSProvider());

    if (import.meta.env.VITE_ELEVENLABS_API_KEY) {
      this.providers.set('elevenlabs', new ElevenLabsProvider(import.meta.env.VITE_ELEVENLABS_API_KEY));
    }

    if (import.meta.env.VITE_OPENAI_API_KEY) {
      this.providers.set('openai', new OpenAIProvider(import.meta.env.VITE_OPENAI_API_KEY));
    }

    this.activeProvider = service;
  }

  getProvider(name?: string): TTSProvider {
    const providerName = name || this.activeProvider;
    const provider = this.providers.get(providerName);
    
    if (!provider) {
      console.warn(`Provider ${providerName} not found, falling back to Coqui`);
      return this.providers.get('coqui')!;
    }
    
    return provider;
  }

  async getAllVoices(): Promise<Voice[]> {
    const allVoices: Voice[] = [];
    
    for (const [name, provider] of this.providers) {
      try {
        const voices = await provider.listVoices();
        allVoices.push(...voices);
      } catch (error) {
        console.error(`Failed to fetch voices from ${name}:`, error);
      }
    }
    
    return allVoices;
  }

  setActiveProvider(name: string) {
    if (this.providers.has(name)) {
      this.activeProvider = name;
    } else {
      throw new Error(`Provider ${name} not found`);
    }
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

// Export singleton instance
export const ttsManager = new TTSServiceManager();