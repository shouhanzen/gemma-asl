// Mock getUserMedia for testing
export const mockGetUserMedia = (shouldSucceed = true) => {
  const mockStream = {
    getTracks: () => [{ stop: jest.fn() }],
    getVideoTracks: () => [{ stop: jest.fn() }],
  };

  if (shouldSucceed) {
    return Promise.resolve(mockStream as unknown as MediaStream);
  } else {
    return Promise.reject(new Error('Camera access denied'));
  }
};

// Mock localStorage for testing
export const mockLocalStorage = () => {
  const storage: { [key: string]: string } = {};
  
  return {
    getItem: (key: string) => storage[key] || null,
    setItem: (key: string, value: string) => {
      storage[key] = value;
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      Object.keys(storage).forEach(key => delete storage[key]);
    },
  };
};

// Mock canvas context for frame capture testing
export const mockCanvasContext = () => ({
  drawImage: jest.fn(),
  getImageData: jest.fn(() => ({
    data: new Uint8ClampedArray(4),
    width: 256,
    height: 256,
  })),
  putImageData: jest.fn(),
});

// Helper to create mock video element
export const createMockVideo = (width = 640, height = 480) => ({
  videoWidth: width,
  videoHeight: height,
  play: jest.fn(),
  pause: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
});

// Helper to generate mock base64 frame
export const generateMockFrame = () => 
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AlXGgEWBEhGzFiQBaZqgdNzB/QfbZ7KX+F9D/AB2f/9k=';