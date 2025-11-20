import MovieCard from './MovieCard'
import Pagination from './Pagination'
import type { Movie, PaginationInfo } from '../types/movie'

interface MovieContainerProps {
  movies: Movie[]
  isLoading: boolean
  hasSearched: boolean
  error: string | null
  onFavorite: (movie: Movie) => void
  pagination?: PaginationInfo | null
  onPageChange?: (page: number) => void
}

const MovieContainer = ({
  movies,
  isLoading,
  hasSearched,
  error,
  onFavorite,
  pagination,
  onPageChange,
}: MovieContainerProps) => {
  if (!hasSearched) {
    return (
      <section className="mt-12 flex w-full flex-col items-center gap-4 px-4 text-center text-white/70">
        <p className="text-2xl font-semibold text-white">Search your movies and make them favourite</p>
        <p className="max-w-xl text-base text-white/60">
          Find your favourite titles, save them to watch later, and keep your collection in sync.
        </p>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="mt-12 flex w-full items-center justify-center px-4 text-white">
        <p className="text-lg">Searching movies...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mt-12 flex w-full items-center justify-center px-4 text-red-400">
        <p>{error}</p>
      </section>
    )
  }

  if (!movies.length) {
    return (
      <section className="mt-12 flex w-full items-center justify-center px-4 text-white/70">
        <p>No movies found. Try another search.</p>
      </section>
    )
  }

  return (
    <section className="mt-12 w-full px-4">
      <div className="mx-auto grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} onFavorite={onFavorite} />
        ))}
      </div>
      {pagination && onPageChange && (
        <Pagination pagination={pagination} onPageChange={onPageChange} isLoading={isLoading} />
      )}
    </section>
  )
}

export default MovieContainer

