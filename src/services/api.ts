import httpClient from './httpClient';
import { API_ENDPOINTS } from '../constants/api';
import type { FavoriteResponse, MovieSearchResponse, MovieSearchCriteria } from '../types/movie';

export interface GoogleLoginResponse {
	success: boolean;
	message: string;
	data: {
		user: {
			id: string;
			userName: string;
			email: string;
			profilePicUrl: string;
			accessToken: string;
			refreshToken: string;
		};
	};
}

export const authApi = {
	googleLogin: async (token: string): Promise<GoogleLoginResponse> => {
		const response = await httpClient.post(API_ENDPOINTS.AUTH.GOOGLE_CALLBACK, {
			token,
		});
		return response.data;
	},
};

export const movieApi = {
	search: async (params: MovieSearchCriteria): Promise<MovieSearchResponse> => {
		const response = await httpClient.get(API_ENDPOINTS.MOVIES.SEARCH, {
			params,
		});
		return response.data;
	},
	toggleFavorite: async (imdbID: string): Promise<FavoriteResponse> => {
		const response = await httpClient.post(API_ENDPOINTS.MOVIES.FAVORITE, {
			imdbID,
		});
		return response.data;
	},
};

