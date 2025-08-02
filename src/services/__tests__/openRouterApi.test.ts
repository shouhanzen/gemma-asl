import axios from 'axios';
import { translateASLFrames } from '../openRouterApi';
import { generateMockFrame } from '../../utils/testUtils';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('openRouterApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('translateASLFrames', () => {
    const mockFrames = [generateMockFrame(), generateMockFrame()];
    const mockApiKey = 'test-api-key';

    it('should successfully translate frames', async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'Hello, how are you?',
              },
            },
          ],
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await translateASLFrames({
        frames: mockFrames,
        apiKey: mockApiKey,
      });

      expect(result.success).toBe(true);
      expect(result.translation).toBe('Hello, how are you?');
      expect(result.error).toBeUndefined();

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://openrouter.ai/api/v1/chat/completions',
        expect.objectContaining({
          model: 'google/gemini-2.5-flash',
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'system',
            }),
            expect.objectContaining({
              role: 'user',
              content: expect.arrayContaining([
                expect.objectContaining({
                  type: 'text',
                }),
                ...mockFrames.map(() =>
                  expect.objectContaining({
                    type: 'image_url',
                  })
                ),
              ]),
            }),
          ]),
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockApiKey}`,
          }),
        })
      );
    });

    it('should handle empty frames array', async () => {
      const result = await translateASLFrames({
        frames: [],
        apiKey: mockApiKey,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('No frames provided for translation');
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('should handle missing API key', async () => {
      const result = await translateASLFrames({
        frames: mockFrames,
        apiKey: '',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('API key is required');
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('should handle 401 unauthorized error', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { error: { message: 'Unauthorized' } },
        },
      });

      const result = await translateASLFrames({
        frames: mockFrames,
        apiKey: 'invalid-key',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid API key. Please check your OpenRouter API key.');
    });

    it('should handle 429 rate limit error', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 429,
          data: { error: { message: 'Rate limit exceeded' } },
        },
      });

      const result = await translateASLFrames({
        frames: mockFrames,
        apiKey: mockApiKey,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Rate limit exceeded. Please try again later.');
    });

    it('should handle network timeout', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        code: 'ECONNABORTED',
        message: 'timeout of 30000ms exceeded',
      });

      const result = await translateASLFrames({
        frames: mockFrames,
        apiKey: mockApiKey,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Request timeout. Please try again.');
    });

    it('should handle unexpected response format', async () => {
      const mockResponse = {
        data: {
          choices: [],
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await translateASLFrames({
        frames: mockFrames,
        apiKey: mockApiKey,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unexpected response format from API');
    });

    it('should trim whitespace from translation', async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: '  Hello, how are you?  ',
              },
            },
          ],
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await translateASLFrames({
        frames: mockFrames,
        apiKey: mockApiKey,
      });

      expect(result.success).toBe(true);
      expect(result.translation).toBe('Hello, how are you?');
    });
  });
});