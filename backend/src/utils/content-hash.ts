import { createHash } from 'crypto';

/**
 * Generates a content hash for deduplication purposes
 * @param content The text content to hash
 * @returns MD5 hash of the content
 */
export function generateContentHash(content: string): string {
  return createHash('md5')
    .update(content)
    .digest('hex');
}

/**
 * Compares two text contents to determine similarity percentage
 * @param textA First text
 * @param textB Second text
 * @returns Similarity score between 0 and 1
 */
export function calculateSimilarity(textA: string, textB: string): number {
  if (!textA || !textB) return 0;
  
  // Simple Jaccard similarity implementation
  const tokensA = new Set(textA.toLowerCase().split(/\s+/));
  const tokensB = new Set(textB.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
  const union = new Set([...tokensA, ...tokensB]);
  
  return intersection.size / union.size;
}
