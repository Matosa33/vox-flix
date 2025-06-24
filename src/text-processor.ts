// Text processing utilities for handling long texts

export interface TextChunk {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
  estimatedDuration: number; // in seconds
}

export class TextProcessor {
  private static readonly WORDS_PER_MINUTE = 150;
  private static readonly MAX_CHUNK_SIZE = 5000; // characters
  private static readonly SENTENCE_ENDINGS = /[.!?]+/g;
  private static readonly PARAGRAPH_BREAK = /\n\n+/g;

  /**
   * Split long text into manageable chunks for TTS processing
   */
  static chunkText(text: string, maxChunkSize = this.MAX_CHUNK_SIZE): TextChunk[] {
    const chunks: TextChunk[] = [];
    const paragraphs = text.split(this.PARAGRAPH_BREAK);
    
    let currentChunk = '';
    let startIndex = 0;
    let chunkId = 0;

    for (const paragraph of paragraphs) {
      if (paragraph.length > maxChunkSize) {
        // Split large paragraphs by sentences
        const sentences = this.splitBySentences(paragraph);
        
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length > maxChunkSize && currentChunk.length > 0) {
            // Save current chunk
            chunks.push(this.createChunk(chunkId++, currentChunk, startIndex));
            startIndex += currentChunk.length;
            currentChunk = sentence;
          } else {
            currentChunk += (currentChunk ? ' ' : '') + sentence;
          }
        }
      } else {
        if (currentChunk.length + paragraph.length > maxChunkSize && currentChunk.length > 0) {
          // Save current chunk
          chunks.push(this.createChunk(chunkId++, currentChunk, startIndex));
          startIndex += currentChunk.length;
          currentChunk = paragraph;
        } else {
          currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
        }
      }
    }

    // Add remaining text
    if (currentChunk.trim()) {
      chunks.push(this.createChunk(chunkId++, currentChunk, startIndex));
    }

    return chunks;
  }

  /**
   * Split text by sentences
   */
  private static splitBySentences(text: string): string[] {
    const sentences: string[] = [];
    let lastIndex = 0;
    let match;

    while ((match = this.SENTENCE_ENDINGS.exec(text)) !== null) {
      const sentence = text.substring(lastIndex, match.index + match[0].length).trim();
      if (sentence) {
        sentences.push(sentence);
      }
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    const remaining = text.substring(lastIndex).trim();
    if (remaining) {
      sentences.push(remaining);
    }

    return sentences;
  }

  /**
   * Create a text chunk with metadata
   */
  private static createChunk(id: number, text: string, startIndex: number): TextChunk {
    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = (wordCount / this.WORDS_PER_MINUTE) * 60;

    return {
      id: `chunk_${id}`,
      text: text.trim(),
      startIndex,
      endIndex: startIndex + text.length,
      estimatedDuration
    };
  }

  /**
   * Estimate total reading time for text
   */
  static estimateReadingTime(text: string): number {
    const wordCount = text.split(/\s+/).length;
    return (wordCount / this.WORDS_PER_MINUTE) * 60; // in seconds
  }

  /**
   * Clean and prepare text for TTS
   */
  static cleanTextForTTS(text: string): string {
    // Remove multiple spaces
    let cleaned = text.replace(/\s+/g, ' ');
    
    // Remove special characters that might cause issues
    cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');
    
    // Normalize quotes
    cleaned = cleaned.replace(/[""]/g, '"');
    cleaned = cleaned.replace(/['']/g, "'");
    
    // Add pauses for better speech
    cleaned = cleaned.replace(/([.!?])\s*([A-Z])/g, '$1 $2');
    
    return cleaned.trim();
  }

  /**
   * Extract metadata from text (title, author, etc.)
   */
  static extractMetadata(text: string): { title?: string; author?: string; content: string } {
    const lines = text.split('\n');
    let title: string | undefined;
    let author: string | undefined;
    let contentStart = 0;

    // Try to detect title (usually first line or after "Title:")
    if (lines[0] && lines[0].length < 100 && !lines[0].includes('.')) {
      title = lines[0].trim();
      contentStart = 1;
    }

    // Try to detect author
    for (let i = contentStart; i < Math.min(5, lines.length); i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('by ') || line.includes('author:')) {
        author = lines[i].replace(/^(by |author:)/i, '').trim();
        contentStart = i + 1;
        break;
      }
    }

    const content = lines.slice(contentStart).join('\n');
    return { title, author, content };
  }

  /**
   * Validate text length
   */
  static validateTextLength(text: string): { valid: boolean; message?: string } {
    const maxLength = parseInt(import.meta.env.VITE_MAX_TEXT_LENGTH || '50000');
    
    if (text.length === 0) {
      return { valid: false, message: 'Text cannot be empty' };
    }
    
    if (text.length > maxLength) {
      return { 
        valid: false, 
        message: `Text is too long. Maximum ${maxLength} characters allowed (approximately ${Math.floor(maxLength / 1250)} pages)` 
      };
    }
    
    return { valid: true };
  }
}