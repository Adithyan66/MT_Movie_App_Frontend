export interface Movie {
	Title: string;
	Year: string;
	imdbID: string;
	Type: string;
	Poster: string;
	isFavorite?: boolean;
}

export interface MovieSearchResponse {
	Search: Movie[];
	totalResults: string;
	Response: string;
}

export interface FavoriteResponse {
	imdbID: string;
	isFavorite: boolean;
}

export type MovieCategory = 'movie' | 'series' | 'episode';

export interface MovieSearchCriteria {
	query: string;
	year?: string;
	type?: MovieCategory;
}


