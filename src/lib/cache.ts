// Simple in-memory cache with TTL support
class Cache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  invalidate(keyPattern: string) {
    const keysToDelete: string[] = [];
    for (const [key] of this.cache) {
      if (key.includes(keyPattern)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

export const apiCache = new Cache();

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Request deduplication to prevent multiple identical requests
class RequestManager {
  private pending = new Map<string, Promise<any>>();

  async request<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // If request is already pending, return the existing promise
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }

    // Create new request
    const promise = requestFn()
      .finally(() => {
        // Clean up after request completes
        this.pending.delete(key);
      });

    this.pending.set(key, promise);
    return promise;
  }

  cancelAll() {
    this.pending.clear();
  }
}

export const requestManager = new RequestManager();

// Cache-aware API wrapper
export async function cachedRequest<T>(
  cacheKey: string,
  requestFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Try cache first
  const cached = apiCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Use request manager to deduplicate
  const result = await requestManager.request(cacheKey, requestFn);
  
  // Cache the result
  apiCache.set(cacheKey, result, ttl);
  
  return result;
}
