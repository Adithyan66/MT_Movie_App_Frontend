const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
	AUTH: {
		GOOGLE_CALLBACK: `${API_URL}/google/callback`,
	},
	MOVIES: {
		SEARCH: `${API_URL}/movies/search`,
		FAVORITES: `${API_URL}/movies/favorites`,
	},
} as const;

