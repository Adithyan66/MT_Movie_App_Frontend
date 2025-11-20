import { useEffect, useRef, useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import type { Movie } from '../types/movie'

interface MovieCardProps {
  movie: Movie
  onFavorite: (movie: Movie) => void
}

const MovieCard = ({ movie, onFavorite }: MovieCardProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldScroll, setShouldScroll] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (titleRef.current && containerRef.current) {
        const titleWidth = titleRef.current.scrollWidth
        const containerWidth = containerRef.current.clientWidth
        if (titleWidth > containerWidth) {
          setShouldScroll(true)
          const scrollDistance = -(titleWidth - containerWidth)
          titleRef.current.style.setProperty('--scroll-distance', `${scrollDistance}px`)
        } else {
          setShouldScroll(false)
        }
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [movie.Title])

  const poster =
    movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : 'https://via.placeholder.com/300x450?text=No+Image'

  const isFavorite = movie.isFavorite ?? movie.isFavourite ?? false

  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-3 text-white transition hover:border-white/30 hover:bg-white/10">
      <div className="overflow-hidden rounded-xl">
        <img
          src={poster}
          alt={movie.Title}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="relative mt-4 flex flex-col gap-1 pr-12">
        <p className="text-sm uppercase text-white/70">{movie.Type}</p>
        <div ref={containerRef} className="overflow-hidden">
          <h3
            ref={titleRef}
            className="text-lg font-semibold leading-tight whitespace-nowrap"
            style={
              shouldScroll
                ? {
                    animation: 'marquee 8s linear infinite',
                  }
                : {}
            }
          >
            {movie.Title}
          </h3>
        </div>
        <p className="text-sm text-white/60">{movie.Year}</p>
      </div>

      <button
        type="button"
        aria-label={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
        onClick={() => onFavorite(movie)}
        className="absolute right-4 bottom-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 transition group-hover:bg-black/70"
      >
        <FaHeart className={isFavorite ? 'text-pink-500 text-xl' : 'text-white text-xl'} />
      </button>
    </div>
  )
}

export default MovieCard

