export const captureFrameFromVideo = (
  video: HTMLVideoElement,
  targetSize: number = 256
): string => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Set canvas size to target dimensions
  canvas.width = targetSize;
  canvas.height = targetSize;

  // Get video dimensions
  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  if (videoWidth === 0 || videoHeight === 0) {
    throw new Error('Video has no dimensions');
  }

  // Calculate scaling to maintain aspect ratio and center the image
  const scale = Math.min(targetSize / videoWidth, targetSize / videoHeight);
  const scaledWidth = videoWidth * scale;
  const scaledHeight = videoHeight * scale;

  // Calculate centering offsets
  const offsetX = (targetSize - scaledWidth) / 2;
  const offsetY = (targetSize - scaledHeight) / 2;

  // Fill background with black
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, targetSize, targetSize);

  // Draw the video frame onto the canvas
  ctx.drawImage(
    video,
    offsetX,
    offsetY,
    scaledWidth,
    scaledHeight
  );

  // Convert to base64 data URL
  return canvas.toDataURL('image/jpeg', 0.8);
};

export const resizeImageToSquare = (
  canvas: HTMLCanvasElement,
  size: number
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Get current image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const originalWidth = canvas.width;
  const originalHeight = canvas.height;

  // Resize canvas
  canvas.width = size;
  canvas.height = size;

  // Calculate scaling to maintain aspect ratio
  const scale = Math.min(size / originalWidth, size / originalHeight);
  const scaledWidth = originalWidth * scale;
  const scaledHeight = originalHeight * scale;

  // Calculate centering offsets
  const offsetX = (size - scaledWidth) / 2;
  const offsetY = (size - scaledHeight) / 2;

  // Create a temporary canvas to hold the original image
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) {
    throw new Error('Failed to get temporary canvas context');
  }

  tempCanvas.width = originalWidth;
  tempCanvas.height = originalHeight;
  tempCtx.putImageData(imageData, 0, 0);

  // Clear the main canvas with black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, size, size);

  // Draw the resized image
  ctx.drawImage(
    tempCanvas,
    offsetX,
    offsetY,
    scaledWidth,
    scaledHeight
  );
};

export const createCanvasFromDataURL = (dataURL: string): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      resolve(canvas);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image from data URL'));
    };

    img.src = dataURL;
  });
};

export const validateVideoElement = (video: HTMLVideoElement | null): boolean => {
  if (!video) return false;
  if (video.videoWidth === 0 || video.videoHeight === 0) return false;
  if (video.readyState < 2) return false; // HAVE_CURRENT_DATA or higher
  return true;
};