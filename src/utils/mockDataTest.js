import { MOCK_CHARACTERS, MOCK_CHAT_RESPONSES, MOCK_VIDEO_URLS } from '../data/mockData';

/**
 * Test function to verify mock data is working correctly
 */
export const testMockData = () => {
  console.log('=== Testing Mock Data ===');
  
  // Test characters data
  console.log('Characters count:', MOCK_CHARACTERS.length);
  console.log('First character:', MOCK_CHARACTERS[0]);
  
  // Test chat responses
  const characterNames = Object.keys(MOCK_CHAT_RESPONSES);
  console.log('Available characters for chat:', characterNames);
  console.log('Sample response for Trần Hưng Đạo:', MOCK_CHAT_RESPONSES['Trần Hưng Đạo'][0]);
  
  // Test video URLs
  console.log('Mock video URLs count:', MOCK_VIDEO_URLS.length);
  console.log('Sample video URL:', MOCK_VIDEO_URLS[0]);
  
  console.log('=== Mock Data Test Complete ===');
};

/**
 * Get a random character for testing
 */
export const getRandomCharacter = () => {
  return MOCK_CHARACTERS[Math.floor(Math.random() * MOCK_CHARACTERS.length)];
};

/**
 * Get a random chat response for a character
 */
export const getRandomChatResponse = (characterName) => {
  const responses = MOCK_CHAT_RESPONSES[characterName] || MOCK_CHAT_RESPONSES['Trần Hưng Đạo'];
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Get a random video URL
 */
export const getRandomVideoUrl = () => {
  return MOCK_VIDEO_URLS[Math.floor(Math.random() * MOCK_VIDEO_URLS.length)];
};

// Auto-run test when this module is imported (for development)
if (process.env.NODE_ENV === 'development') {
  testMockData();
}
