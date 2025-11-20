import MovieCard from './MovieCard'
import Pagination from './Pagination'
import type { Movie, PaginationInfo } from '../types/movie'
import LoadingSpinner from './LoadingSpinner'

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
      <section className="mt-12 flex w-full flex-col items-center gap-5 px-3 text-center text-white/80 sm:mt-16 sm:px-4">
        <div className="rounded-[28px] border-white/10 bg-gradient-to-b from-black/70 via-zinc-900/60 to-black/70 px-6 py-10 shadow-[0_25px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:rounded-[32px] sm:px-10">
          <p className="text-2xl font-semibold tracking-[0.15em] uppercase text-white sm:text-3xl sm:tracking-[0.2em]">
            Begin Your Black & White Journey
          </p>
        </div>
        <p className="max-w-xl text-sm text-white/60 sm:text-base">
          Find your favourite titles, save them to watch later, and keep your collection in sync.
        </p>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="mt-12 flex w-full items-center justify-center px-3 text-white sm:mt-16 sm:px-4">
        <div className="rounded-3xl border-white/10 px-6 py-5 text-base text-white shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-lg sm:px-8 sm:py-6 sm:text-lg">
          <LoadingSpinner fullscreen={false} />
          Searching movies...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mt-12 flex w-full items-center justify-center px-3 text-red-400 sm:mt-16 sm:px-4">
        <div className="rounded-3xl border-red-400/40 bg-red-500/10 px-6 py-5 text-sm shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:px-8 sm:py-6 sm:text-base">
          {error}
        </div>
      </section>
    )
  }

  if (!movies.length) {
    return (
      <section className="mt-12 flex w-full items-center justify-center px-3 text-white/80 sm:mt-16 sm:px-4">
        <div className="rounded-3xl border-white/10 bg-gradient-to-r from-black/70 to-zinc-900/70 px-6 py-5 text-sm shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:px-8 sm:py-6 sm:text-base">
          No movies found. Try another search.
        </div>
      </section>
    )
  }

  return (
    <section className="mt-10 w-full px-2 sm:mt-16 sm:px-4">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} onFavorite={onFavorite} />
        ))}
      </div>
      {pagination && onPageChange && (
        <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col items-center justify-center rounded-[24px] bg-gradient-to-r from-black/70 to-zinc-900/70 p-3 text-center shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:mt-10 sm:rounded-[28px] sm:p-4">
          <Pagination pagination={pagination} onPageChange={onPageChange} isLoading={isLoading} />
        </div>
      )}
    </section>
  )
}

export default MovieContainer

