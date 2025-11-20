import { useEffect, useRef, useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import type { Movie } from '../types/movie'
import defaultPoster from '../assets/default_poster.jpg'

interface MovieCardProps {
  movie: Movie
  onFavorite: (movie: Movie) => void
}

const MovieCard = ({ movie, onFavorite }: MovieCardProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldScroll, setShouldScroll] = useState(false)
  const [posterError, setPosterError] = useState(false)

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

  useEffect(() => {
    setPosterError(false)
  }, [movie.Poster])

  const poster =
    movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : null

  const isFavorite = movie.isFavorite ?? movie.isFavourite ?? false

  const handleImageError = () => {
    setPosterError(true)
  }

  return (
    <div className="group relative flex flex-col rounded-[24px] border border-white/10 bg-gradient-to-b from-black/70 via-zinc-900/60 to-black/80 p-3 text-white shadow-[0_20px_70px_rgba(0,0,0,0.65)] transition hover:border-white/30 hover:shadow-[0_30px_90px_rgba(0,0,0,0.75)] sm:rounded-[28px] sm:p-4">
      <div className="relative h-56 overflow-hidden rounded-2xl border border-white/5 sm:h-72">
        <img
          src={defaultPoster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        {poster && !posterError && (
          <img
            src={poster}
            alt={movie.Title}
            className="relative h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-110"
            loading="lazy"
            onError={handleImageError}
          />
        )}
      </div>

      <div className="relative mt-4 flex flex-col gap-1 pr-14 sm:mt-5">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">{movie.Type}</p>
        <div ref={containerRef} className="overflow-hidden">
          <h3
            ref={titleRef}
            className="text-xl font-semibold leading-tight whitespace-nowrap text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
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
        className="absolute right-4 bottom-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.6)] transition hover:border-white/40 hover:bg-white/15 sm:h-11 sm:w-11"
      >
        <FaHeart
          className={
            isFavorite
              ? 'text-red-500 text-xl drop-shadow-[0_0_18px_rgba(239,68,68,0.8)]'
              : 'text-white text-xl'
          }
        />
      </button>
    </div>
  )
}

export default MovieCard

