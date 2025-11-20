import { useRef, useState } from 'react'
import { movieApi } from '../services/api'
import type { Movie, MovieSearchCriteria, PaginationInfo } from '../types/movie'

export const useApp = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isFavoritesView, setIsFavoritesView] = useState(false)
  const [currentSearchCriteria, setCurrentSearchCriteria] = useState<MovieSearchCriteria | null>(null)
  const latestQueryRef = useRef('')

  const searchMovies = async ({ query, year, type, page = 1 }: MovieSearchCriteria) => {
    const trimmed = query.trim()
    const yearValue = year?.trim() ?? ''
    const typeValue = type ?? ''
    const requestKey = [trimmed, yearValue, typeValue, page.toString()].join('|')
    latestQueryRef.current = requestKey

    if (!trimmed) {
      setIsSearching(false)
      setHasSearched(false)
      setMovies([])
      setPagination(null)
      setError(null)
      setIsFavoritesView(false)
      setCurrentSearchCriteria(null)
      return
    }

    setIsSearching(true)
    setHasSearched(true)
    setError(null)
    setIsFavoritesView(false)
    setCurrentSearchCriteria({ query: trimmed, year: yearValue || undefined, type: typeValue || undefined })

    try {
      const params: MovieSearchCriteria = { query: trimmed, page }
      if (yearValue) {
        params.year = yearValue
      }
      if (typeValue) {
        params.type = typeValue
      }
      const response = await movieApi.search(params)
      if (latestQueryRef.current !== requestKey) {
        return
      }
      setMovies(response.movies)
      setPagination(response.pagination)
    } catch {
      if (latestQueryRef.current === requestKey) {
        setError('Unable to fetch movies right now.')
        setMovies([])
        setPagination(null)
      }
    } finally {
      if (latestQueryRef.current === requestKey) {
        setIsSearching(false)
      }
    }
  }

  const handleFavorite = async (movie: Movie) => {
    const currentlyFavorite = movie.isFavorite ?? movie.isFavourite ?? false
    try {
      const updated = currentlyFavorite
        ? await movieApi.removeFavorite(movie.imdbID)
        : await movieApi.addFavorite(movie.imdbID)
      const nextState = updated.isFavorite ?? updated.isFavourite ?? !currentlyFavorite
      const updatedId = updated.imdbID ?? updated.movieId ?? movie.imdbID
      setMovies((prev) =>
        prev.map((item) =>
          item.imdbID === updatedId ? { ...item, isFavorite: nextState, isFavourite: nextState } : item
        )
      )
    } catch (error) {
      console.error('Unable to update favourite:', error)
    }
  }

  const fetchFavorites = async (page: number = 1) => {
    setIsSearching(true)
    setHasSearched(true)
    setError(null)
    setIsFavoritesView(true)
    try {
      const response = await movieApi.getFavorites(page)
      setMovies(
        response.movies.map((item) => ({
          ...item,
          isFavorite: true,
          isFavourite: true,
        }))
      )
      setPagination(response.pagination)
    } catch {
      setMovies([])
      setPagination(null)
      setError('Unable to fetch favourites right now.')
    } finally {
      setIsSearching(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (isFavoritesView) {
      fetchFavorites(page)
    } else if (currentSearchCriteria) {
      searchMovies({
        ...currentSearchCriteria,
        page,
      })
    }
  }

  return {
    movies,
    pagination,
    isSearching,
    hasSearched,
    error,
    searchMovies,
    fetchFavorites,
    handleFavorite,
    handlePageChange,
  }
}
