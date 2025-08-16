import { useEffect, useRef, useCallback } from 'react';

// Hook for managing AbortController for API calls
export function useAbortController() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const createController = useCallback(() => {
    // Abort previous controller if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);

  const getSignal = useCallback(() => {
    if (!abortControllerRef.current) {
      createController();
    }
    return abortControllerRef.current!.signal;
  }, [createController]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { createController, getSignal };
}

// Hook for managing timeout cleanup
export function useTimeout() {
  const timeoutRefs = useRef<Set<NodeJS.Timeout>>(new Set());

  const setTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = globalThis.setTimeout(() => {
      timeoutRefs.current.delete(timeoutId);
      callback();
    }, delay);
    
    timeoutRefs.current.add(timeoutId);
    return timeoutId;
  }, []);

  const clearTimeout = useCallback((timeoutId: NodeJS.Timeout) => {
    globalThis.clearTimeout(timeoutId);
    timeoutRefs.current.delete(timeoutId);
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(id => globalThis.clearTimeout(id));
    timeoutRefs.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  return { setTimeout, clearTimeout, clearAllTimeouts };
}

// Hook for managing interval cleanup
export function useInterval() {
  const intervalRefs = useRef<Set<NodeJS.Timeout>>(new Set());

  const setInterval = useCallback((callback: () => void, delay: number) => {
    const intervalId = globalThis.setInterval(callback, delay);
    intervalRefs.current.add(intervalId);
    return intervalId;
  }, []);

  const clearInterval = useCallback((intervalId: NodeJS.Timeout) => {
    globalThis.clearInterval(intervalId);
    intervalRefs.current.delete(intervalId);
  }, []);

  const clearAllIntervals = useCallback(() => {
    intervalRefs.current.forEach(id => globalThis.clearInterval(id));
    intervalRefs.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllIntervals();
    };
  }, [clearAllIntervals]);

  return { setInterval, clearInterval, clearAllIntervals };
}

// Hook for managing object URLs cleanup
export function useObjectUrls() {
  const urlsRef = useRef<Set<string>>(new Set());

  const createObjectURL = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    urlsRef.current.add(url);
    return url;
  }, []);

  const revokeObjectURL = useCallback((url: string) => {
    URL.revokeObjectURL(url);
    urlsRef.current.delete(url);
  }, []);

  const revokeAllObjectURLs = useCallback(() => {
    urlsRef.current.forEach(url => URL.revokeObjectURL(url));
    urlsRef.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      revokeAllObjectURLs();
    };
  }, [revokeAllObjectURLs]);

  return { createObjectURL, revokeObjectURL, revokeAllObjectURLs };
}

// Hook for managing event listeners
export function useEventListener<T extends keyof WindowEventMap>(
  eventName: T,
  handler: (event: WindowEventMap[T]) => void,
  element: Window | HTMLElement = window,
  options?: boolean | AddEventListenerOptions
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const eventListener = (event: Event) => handlerRef.current(event as WindowEventMap[T]);
    
    element.addEventListener(eventName, eventListener, options);
    
    return () => {
      element.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}

// Hook for managing resource cleanup
export function useResourceCleanup() {
  const cleanupFunctions = useRef<Set<() => void>>(new Set());

  const addCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctions.current.add(cleanup);
    
    // Return a function to remove this specific cleanup
    return () => {
      cleanupFunctions.current.delete(cleanup);
    };
  }, []);

  const runCleanup = useCallback(() => {
    cleanupFunctions.current.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.warn('Cleanup function failed:', error);
      }
    });
    cleanupFunctions.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      runCleanup();
    };
  }, [runCleanup]);

  return { addCleanup, runCleanup };
}
