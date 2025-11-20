export interface Movie {
	Title: string;
	Year: string;
	imdbID: string;
	Type: string;
	Poster: string;
	isFavorite?: boolean;
	isFavourite?: boolean;
}

export interface MovieSearchResult {
	Search: Movie[];
	totalResults: string;
	Response: string;
}

export interface MovieSearchResponse {
	success: boolean;
	message: string;
	data: {
		movies: Movie[] | MovieSearchResult;
		pagination?: PaginationInfo;
	};
}

export interface FavoriteResponse {
	imdbID?: string;
	movieId?: string;
	isFavorite?: boolean;
	isFavourite?: boolean;
}

export type MovieCategory = 'movie' | 'series' | 'episode';

export interface MovieSearchCriteria {
	query: string;
	year?: string;
	type?: MovieCategory;
	page?: number;
}

export interface PaginationInfo {
	page: number;
	perPage: number;
	totalResults: number;
	totalPages: number;
}

export interface PaginatedMovieResponse {
	movies: Movie[];
	pagination: PaginationInfo;
}


