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
      <section className="mt-16 flex w-full flex-col items-center gap-5 px-4 text-center text-white/80">
        <div className="rounded-[32px]  border-white/10 bg-gradient-to-b from-black/70 via-zinc-900/60 to-black/70 px-10 py-12 shadow-[0_25px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl">
          <p className="text-3xl font-semibold tracking-[0.2em] uppercase text-white">
            Begin Your Black & White Journey
          </p>
        </div>
        <p className="max-w-xl text-base text-white/60">
          Find your favourite titles, save them to watch later, and keep your collection in sync.
        </p>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="mt-16 flex w-full items-center justify-center px-4 text-white">
        <div className="rounded-3xl  border-white/10 px-8 py-6 text-lg text-white shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-lg">
          <LoadingSpinner fullscreen={false} />
          Searching movies...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mt-16 flex w-full items-center justify-center px-4 text-red-400">
        <div className="rounded-3xl  border-red-400/40 bg-red-500/10 px-8 py-6 text-base shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          {error}
        </div>
      </section>
    )
  }

  if (!movies.length) {
    return (
      <section className="mt-16 flex w-full items-center justify-center px-4 text-white/80">
        <div className="rounded-3xl  border-white/10 bg-gradient-to-r from-black/70 to-zinc-900/70 px-8 py-6 text-base shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          No movies found. Try another search.
        </div>
      </section>
    )
  }

  return (
    <section className="mt-16 w-full px-4">
      <div className="mx-auto grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} onFavorite={onFavorite} />
        ))}
      </div>
      {pagination && onPageChange && (
        <div className="mx-auto mt-10 flex w-full max-w-4xl items-center justify-center rounded-[28px]   bg-gradient-to-r from-black/70 to-zinc-900/70 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <Pagination pagination={pagination} onPageChange={onPageChange} isLoading={isLoading} />
        </div>
      )}
    </section>
  )
}

export default MovieContainer

