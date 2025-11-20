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
		movies: MovieSearchResult;
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
}


