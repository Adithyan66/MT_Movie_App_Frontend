import httpClient from './httpClient';
import { API_ENDPOINTS } from '../constants/api';
import type {
	FavoriteResponse,
	MovieSearchResponse,
	MovieSearchResult,
	MovieSearchCriteria,
} from '../types/movie';

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

const isWrappedMovieResponse = (
	value: MovieSearchResponse | MovieSearchResult,
): value is MovieSearchResponse => {
	return (
		typeof value === 'object' &&
		value !== null &&
		'data' in value &&
		value.data !== undefined &&
		'movies' in value.data
	);
};

export const movieApi = {
	search: async (params: MovieSearchCriteria): Promise<MovieSearchResult> => {
		const response = await httpClient.get(API_ENDPOINTS.MOVIES.SEARCH, {
			params,
		});
		const payload = response.data as MovieSearchResponse | MovieSearchResult;
		if (isWrappedMovieResponse(payload)) {
			return payload.data.movies;
		}
		return payload;
	},
	toggleFavorite: async (imdbID: string): Promise<FavoriteResponse> => {
		const response = await httpClient.post(API_ENDPOINTS.MOVIES.FAVORITE, {
			imdbID,
		});
		return response.data;
	},
};

