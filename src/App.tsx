import { useRef, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import MovieHeader from './components/MovieHeader'
import MovieContainer from './components/MovieContainer'
import { movieApi } from './services/api'
import type { Movie, MovieSearchCriteria } from './types/movie'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { googleLogin } from './redux/slices/authSlice'

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const latestQueryRef = useRef('')

  const searchMovies = async ({ query, year, type }: MovieSearchCriteria) => {
    const trimmed = query.trim()
    const yearValue = year?.trim() ?? ''
    const typeValue = type ?? ''
    const requestKey = [trimmed, yearValue, typeValue].join('|')
    latestQueryRef.current = requestKey
    if (!trimmed) {
      setIsSearching(false)
      setHasSearched(false)
      setMovies([])
      setError(null)
      return
    }
    setIsSearching(true)
    setHasSearched(true)
    setError(null)
    try {
      const params: MovieSearchCriteria = { query: trimmed }
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
      if (response.Response === 'True' && Array.isArray(response.Search)) {
        setMovies(
          response.Search.map((item) => ({
            ...item,
            isFavorite: item.isFavorite ?? item.isFavourite ?? false,
            isFavourite: item.isFavorite ?? item.isFavourite ?? false,
          }))
        )
      } else {
        setMovies([])
      }
    } catch {
      if (latestQueryRef.current === requestKey) {
        setError('Unable to fetch movies right now.')
        setMovies([])
      }
    } finally {
      if (latestQueryRef.current === requestKey) {
        setIsSearching(false)
      }
    }
  }

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await dispatch(googleLogin(response.access_token)).unwrap()
      } catch (error) {
        console.error('Login failed:', error)
      }
    },
  })

  const handleFavorite = async (movie: Movie) => {
    if (!user) {
      googleLoginHandler()
      return
    }
    try {
      const updated = await movieApi.toggleFavorite(movie.imdbID)
      setMovies((prev) =>
        prev.map((item) =>
          item.imdbID === updated.imdbID
            ? { ...item, isFavorite: updated.isFavorite, isFavourite: updated.isFavorite }
            : item
        )
      )
    } catch (error) {
      console.error('Unable to update favourite:', error)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-gradient-to-b from-black to-zinc-900 px-4 py-10">
      <MovieHeader onSearch={searchMovies} isSearching={isSearching} />
      <MovieContainer
        movies={movies}
        isLoading={isSearching}
        hasSearched={hasSearched}
        error={error}
        onFavorite={handleFavorite}
      />
    </div>
  )
}

export default App