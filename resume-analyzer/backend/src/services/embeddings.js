import { pipeline } from '@xenova/transformers';

class EmbeddingService {
  constructor() {
    this.extractor = null;
    this.modelName = 'Xenova/all-MiniLM-L6-v2';
    this.isLoading = false;
  }

  async getExtractor() {
    if (this.extractor) return this.extractor;
    if (this.isLoading) {
      // Wait if another request is currently initializing
      while (this.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      if (this.extractor) return this.extractor;
    }

    this.isLoading = true;
    try {
      console.log(`[Embeddings] Loading model ${this.modelName} (quantized)...`);
      this.extractor = await pipeline('feature-extraction', this.modelName, {
        quantized: true,
      });
      console.log(`[Embeddings] Model ${this.modelName} loaded successfully!`);
    } catch (err) {
      console.error('[Embeddings] Failed to load embedding model:', err);
      throw err;
    } finally {
      this.isLoading = false;
    }

    return this.extractor;
  }

  /**
   * Generates a normalized 384-dimensional embedding vector for a given text string.
   */
  async generateEmbedding(text) {
    if (!text || typeof text !== 'string' || !text.trim()) {
      return new Array(384).fill(0);
    }

    const extractor = await this.getExtractor();
    const cleanText = text.slice(0, 2000).replace(/\s+/g, ' ').trim();

    const output = await extractor(cleanText, {
      pooling: 'mean',
      normalize: true,
    });

    return Array.from(output.data);
  }

  /**
   * Computes the cosine similarity between two vector arrays.
   * Returns a score between 0.0 and 1.0 (or -1.0 to 1.0).
   */
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    if (magnitude === 0) return 0;

    const similarity = dotProduct / magnitude;
    // Bound between 0 and 1 for positive score percentage representation
    return Math.max(0, Math.min(1, similarity));
  }
}

export const embeddingService = new EmbeddingService();
