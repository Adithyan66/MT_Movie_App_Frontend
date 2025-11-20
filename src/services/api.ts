import httpClient from './httpClient';
import { API_ENDPOINTS } from '../constants/api';
import type {
	FavoriteResponse,
	Movie,
	MovieSearchResponse,
	MovieSearchResult,
	MovieSearchCriteria,
	PaginatedMovieResponse,
	PaginationInfo,
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

const parseFavoriteMovies = (payload: unknown): PaginatedMovieResponse => {
	let movies: Movie[] = [];
	let pagination: PaginationInfo | undefined;
	
	if (Array.isArray(payload)) {
		movies = payload as Movie[];
	} else if (payload && typeof payload === 'object') {
		const withMovies = payload as { movies?: Movie[] };
		if (Array.isArray(withMovies.movies)) {
			movies = withMovies.movies;
		} else {
			const withData = payload as { 
				data?: { 
					favorites?: Movie[]; 
					movies?: Movie[]; 
					pagination?: PaginationInfo;
				} 
			};
			if (withData.data) {
				if (Array.isArray(withData.data.favorites)) {
					movies = withData.data.favorites;
				} else if (Array.isArray(withData.data.movies)) {
					movies = withData.data.movies;
				}
				pagination = withData.data.pagination;
			}
		}
	}
	
	const normalizedMovies = movies.map((movie) => ({
		...movie,
		Type: movie.Type || 'movie',
	}));

	return {
		movies: normalizedMovies,
		pagination: pagination || {
			page: 1,
			perPage: normalizedMovies.length,
			totalResults: normalizedMovies.length,
			totalPages: 1,
		},
	};
};

const parseSearchMovies = (payload: unknown): PaginatedMovieResponse => {
	let movies: Movie[] = [];
	let pagination: PaginationInfo | undefined;

	if (payload && typeof payload === 'object') {
		const searchResult = payload as MovieSearchResult;
		if (searchResult.Search && Array.isArray(searchResult.Search)) {
			movies = searchResult.Search;
		} else {
			const wrapped = payload as MovieSearchResponse;
			if (wrapped.data) {
				if (wrapped.data.movies && Array.isArray(wrapped.data.movies)) {
					movies = wrapped.data.movies;
				} else if (wrapped.data.movies && typeof wrapped.data.movies === 'object') {
					const movieResult = wrapped.data.movies as MovieSearchResult;
					if (movieResult.Search && Array.isArray(movieResult.Search)) {
						movies = movieResult.Search;
					}
				}
				pagination = wrapped.data.pagination;
			}
		}
	}

	const normalizedMovies = movies.map((movie) => ({
		...movie,
		isFavorite: movie.isFavorite ?? movie.isFavourite ?? false,
		isFavourite: movie.isFavorite ?? movie.isFavourite ?? false,
	}));

	return {
		movies: normalizedMovies,
		pagination: pagination || {
			page: 1,
			perPage: normalizedMovies.length,
			totalResults: normalizedMovies.length,
			totalPages: 1,
		},
	};
};

export const movieApi = {
	search: async (params: MovieSearchCriteria): Promise<PaginatedMovieResponse> => {
		const response = await httpClient.get(API_ENDPOINTS.MOVIES.SEARCH, {
			params,
		});
		return parseSearchMovies(response.data);
	},
	addFavorite: async (movieId: string): Promise<FavoriteResponse> => {
		const response = await httpClient.post(API_ENDPOINTS.MOVIES.FAVORITES, undefined, {
			params: { movieId },
		});
		return response.data;
	},
	removeFavorite: async (movieId: string): Promise<FavoriteResponse> => {
		const response = await httpClient.delete(API_ENDPOINTS.MOVIES.FAVORITES, {
			params: { movieId },
		});
		return response.data;
	},
	getFavorites: async (page: number = 1): Promise<PaginatedMovieResponse> => {
		const pageNumber = typeof page === 'number' ? page : Number(page) || 1
		const response = await httpClient.get(API_ENDPOINTS.MOVIES.FAVORITES, {
			params: { page: pageNumber },
		});
		return parseFavoriteMovies(response.data);
	},
};

