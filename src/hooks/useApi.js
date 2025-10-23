import { useState, useEffect, useCallback } from 'react';
import { API_CONFIG } from '../constants/config';
import { getAuthHeaders, handleApiError } from '../utils/helpers';
import { 
  MOCK_CHARACTERS, 
  MOCK_CHAT_RESPONSES, 
  MOCK_VIDEO_URLS, 
  MOCK_USER, 
  MOCK_LOGIN_RESPONSE 
} from '../data/mockData';

// Force use mock data for development
const USE_MOCK_DATA = true;

/**
 * Simple hook that immediately returns mock characters
 * @returns {Object} Characters data
 */
export const useMockCharacters = () => {
  const [characters] = useState(MOCK_CHARACTERS);
  const [loading] = useState(false);
  const [error] = useState(null);

  return {
    characters,
    loading,
    error,
    refetch: () => Promise.resolve(MOCK_CHARACTERS),
  };
};

/**
 * Custom hook for making API calls
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Object} API state and methods
 */
export const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (requestOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const url = endpoint.startsWith('http') 
        ? endpoint 
        : `${API_CONFIG.SERVER_URL}${endpoint}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
        ...options,
        ...requestOptions,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      console.warn(`API call failed, using mock data: ${err.message}`);
      
      // Use mock data based on endpoint
      let mockData = null;
      if (endpoint === API_CONFIG.ENDPOINTS.CHARACTERS) {
        mockData = MOCK_CHARACTERS;
      } else if (endpoint && endpoint.includes('/api/characters/')) {
        const characterId = endpoint.split('/').pop();
        mockData = MOCK_CHARACTERS.find(char => char.id.toString() === characterId);
      }
      
      if (mockData) {
        setData(mockData);
        return mockData;
      }
      
      const errorInfo = handleApiError(err, `API call to ${endpoint}`);
      setError(errorInfo);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  return {
    data,
    loading,
    error,
    makeRequest,
    setData,
    setError,
  };
};

/**
 * Custom hook for fetching characters
 * @returns {Object} Characters data and methods
 */
export const useCharacters = () => {
  const [characters, setCharacters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (USE_MOCK_DATA) {
      // Use mock data immediately for development
      console.log('Using mock data for characters');
      setTimeout(() => {
        setCharacters(MOCK_CHARACTERS);
        setLoading(false);
      }, 500); // Small delay to show loading state
      return MOCK_CHARACTERS;
    }

    try {
      // Try to fetch from API first
      const response = await fetch(`${API_CONFIG.SERVER_URL}${API_CONFIG.ENDPOINTS.CHARACTERS}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setCharacters(data);
        return data;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.warn(`API call failed, using mock data: ${err.message}`);
      
      // Use mock data immediately
      setCharacters(MOCK_CHARACTERS);
      return MOCK_CHARACTERS;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  return {
    characters,
    loading,
    error,
    refetch: fetchCharacters,
  };
};

/**
 * Custom hook for fetching a single character
 * @param {string|number} characterId - Character ID
 * @returns {Object} Character data and methods
 */
export const useCharacter = (characterId) => {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCharacter = useCallback(async () => {
    if (!characterId) {
      setLoading(false);
      return null;
    }

    setLoading(true);
    setError(null);

    if (USE_MOCK_DATA) {
      console.log('Using mock data for character:', characterId);
      const mockCharacter = MOCK_CHARACTERS.find(char => char.id.toString() === characterId.toString());
      console.log("mockCharacter ", mockCharacter)
      setTimeout(() => {
        setCharacter(mockCharacter);
        setLoading(false);
      }, 300);
      return mockCharacter;
    }

    try {
      // Try to fetch from API first
      const response = await fetch(`${API_CONFIG.SERVER_URL}${API_CONFIG.ENDPOINTS.CHARACTER_BY_ID(characterId)}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setCharacter(data);
        return data;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.warn(`API call failed, using mock data: ${err.message}`);
      
      // Use mock data immediately
      const mockCharacter = MOCK_CHARACTERS.find(char => char.id.toString() === characterId.toString());
      setCharacter(mockCharacter);
      return mockCharacter;
    } finally {
      setLoading(false);
    }
  }, [characterId]);

  useEffect(() => {
    if (characterId) {
      fetchCharacter();
    }
  }, [characterId, fetchCharacter]);

  return {
    character,
    loading,
    error,
    refetch: fetchCharacter,
  };
};

/**
 * Custom hook for authentication
 * @returns {Object} Auth methods and state
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.SERVER_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (data.message === "Auth successful") {
        localStorage.setItem('token', data.token);
        setUser(data.user || { username: credentials.username });
        return { success: true, data };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.warn(`Login API failed, using mock data: ${error.message}`);
      
      // Use mock login data
      localStorage.setItem('token', MOCK_LOGIN_RESPONSE.token);
      setUser(MOCK_LOGIN_RESPONSE.user);
      return { success: true, data: MOCK_LOGIN_RESPONSE };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('token');
  }, []);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };
};
