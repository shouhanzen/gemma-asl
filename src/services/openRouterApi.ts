import axios from 'axios';
import { TranslationRequest, TranslationResponse } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'google/gemini-2.5-flash';

const SYSTEM_PROMPT = `You are an expert ASL interpreter. The user has provided a sequence of video frames showing them signing in American Sign Language (ASL). Describe in English what the user is communicating, using the full sequence to interpret meaning.`;

const USER_PROMPT = `These are frames from a recorded ASL gesture. Please translate the motion as a whole into natural English.`;

export const translateASLFrames = async ({
  frames,
  apiKey,
}: TranslationRequest): Promise<TranslationResponse> => {
  try {
    if (!frames || frames.length === 0) {
      return {
        success: false,
        translation: '',
        error: 'No frames provided for translation',
      };
    }

    if (!apiKey || apiKey.trim().length === 0) {
      return {
        success: false,
        translation: '',
        error: 'API key is required',
      };
    }

    // Build the content array with text prompt and images
    const content = [
      {
        type: 'text',
        text: USER_PROMPT,
      },
      ...frames.map((frame) => ({
        type: 'image_url',
        image_url: {
          url: frame,
        },
      })),
    ];

    const requestBody = {
      model: MODEL_NAME,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    };

    const response = await axios.post(OPENROUTER_API_URL, requestBody, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ASL Translator',
      },
      timeout: 30000, // 30 second timeout
    });

    if (response.data?.choices?.[0]?.message?.content) {
      return {
        success: true,
        translation: response.data.choices[0].message.content.trim(),
      };
    } else {
      return {
        success: false,
        translation: '',
        error: 'Unexpected response format from API',
      };
    }
  } catch (error: any) {
    let errorMessage = 'Failed to translate ASL frames';

    if (error.response) {
      // API responded with error status
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        errorMessage = 'Invalid API key. Please check your OpenRouter API key.';
      } else if (status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (status === 400) {
        errorMessage = data?.error?.message || 'Invalid request format';
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = data?.error?.message || `API error (${status})`;
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection.';
    } else {
      errorMessage = error.message || 'Unknown error occurred';
    }

    return {
      success: false,
      translation: '',
      error: errorMessage,
    };
  }
};