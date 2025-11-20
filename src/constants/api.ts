const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
	AUTH: {
		GOOGLE_CALLBACK: `${API_URL}/google/callback`,
	},
	MOVIES: {
		SEARCH: `${API_URL}/movie/search`,
		FAVORITE: `${API_URL}/movie/favoriate`,
	},
} as const;

