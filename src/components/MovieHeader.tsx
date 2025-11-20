import { useState } from 'react'
import { FaHeart, FaUser } from 'react-icons/fa'
import { FiFilter } from 'react-icons/fi'
import { useGoogleLogin } from '@react-oauth/google'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { googleLogin } from '../redux/slices/authSlice'
import LogoutModal from './LogoutModal'
import type { MovieCategory, MovieSearchCriteria } from '../types/movie'
import useDebouncedCallback from '../hooks/useDebouncedCallback'

interface MovieHeaderProps {
  onSearch: (criteria: MovieSearchCriteria) => Promise<void>
  isSearching: boolean
  onShowFavorites: (page?: number) => void
}

const TYPE_OPTIONS: { value: MovieCategory; label: string }[] = [
  { value: 'movie', label: 'Movie' },
  { value: 'series', label: 'Series' },
  { value: 'episode', label: 'Episode' },
]

const MovieHeader = ({ onSearch, isSearching, onShowFavorites }: MovieHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [yearFilter, setYearFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<MovieCategory | null>(null)
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()

  const triggerSearch = (queryValue: string, yearValue: string, typeValue: MovieCategory | null) => {
    void onSearch({
      query: queryValue,
      year: yearValue,
      type: typeValue ?? undefined,
    })
  }

  const debouncedTriggerSearch = useDebouncedCallback(
    (queryValue: string, yearValue: string, typeValue: MovieCategory | null) => {
      triggerSearch(queryValue, yearValue, typeValue)
    },
    500
  )

  const handleChange = (value: string) => {
    setSearchQuery(value)
    if (!value.trim()) {
      triggerSearch(value, yearFilter, typeFilter)
      return
    }
    debouncedTriggerSearch(value, yearFilter, typeFilter)
  }

  const handleYearChange = (value: string) => {
    const trimmedValue = value.trim()
    setYearFilter(trimmedValue)
    if (!trimmedValue) {
      triggerSearch(searchQuery, '', typeFilter)
      return
    }
    debouncedTriggerSearch(searchQuery, trimmedValue, typeFilter)
  }

  const handleTypeSelect = (value: MovieCategory) => {
    const nextValue = typeFilter === value ? null : value
    setTypeFilter(nextValue)
    triggerSearch(searchQuery, yearFilter, nextValue)
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

  const handleGoogleLogin = () => {
    googleLoginHandler()
  }


  return (
    <header className="relative w-full px-3 pb-6 pt-4 text-white sm:px-4 md:pb-8">
      <div className="absolute inset-0 -z-10 mx-auto h-60 w-[94%] max-w-4xl rounded-[32px] border-white/10 bg-gradient-to-b from-black to-zinc-900 opacity-70 blur-3xl sm:h-64 sm:rounded-[36px]" />
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-5 rounded-[28px] border-white/10 bg-gradient-to-b from-black/85 via-zinc-950/70 to-black/80 p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:gap-6 sm:rounded-[32px] sm:p-8">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 sm:text-xs sm:tracking-[0.35em]">
            Immersive Black & White Cinema
          </p>
          <h1 className="bg-gradient-to-r from-white via-zinc-200 to-white bg-clip-text text-[clamp(1.75rem,6vw,2.5rem)] font-semibold uppercase tracking-[0.18em] text-transparent drop-shadow-[0_4px_25px_rgba(255,255,255,0.25)] sm:text-4xl sm:tracking-[0.25em] md:tracking-[0.3em]">
            Movie Mania
          </h1>
        </div>

        <div className="flex w-full max-w-2xl flex-wrap items-center justify-center gap-2 sm:flex-nowrap sm:gap-3" role="search">
          <div className="relative min-w-0 flex-1">
            <input
              type="search"
              placeholder="Search for a movie"
              value={searchQuery}
              onChange={(event) => handleChange(event.target.value)}
              aria-busy={isSearching}
              className="w-full rounded-xl border border-white/10 bg-gradient-to-r from-black/60 to-zinc-900/60 px-4 py-2.5 pr-12 text-sm text-white placeholder:text-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 sm:px-5 sm:py-3.5 sm:pr-14 sm:text-base"
            />
            <button
              type="button"
              aria-label="Toggle filters"
              aria-pressed={showFilters}
              onClick={() => setShowFilters((prev) => !prev)}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-white/40 hover:bg-white/20 sm:right-4 sm:h-9 sm:w-9"
            >
              <FiFilter className="text-base sm:text-lg" />
            </button>
          </div>

          <button
            type="button"
            aria-label="Favourites"
            onClick={() => onShowFavorites()}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-gradient-to-b from-black to-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition hover:border-white/60 hover:shadow-[0_20px_40px_rgba(0,0,0,0.65)] sm:h-12 sm:w-12"
          >
              <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition group-hover:opacity-100" />
              <FaHeart className="text-xl text-white transition group-hover:scale-110 sm:text-2xl" />
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                aria-label="User Profile"
                onClick={() => setShowModal(true)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition hover:border-white/60 hover:bg-white/10 sm:h-12 sm:w-12"
              >
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              </button>
              <LogoutModal
                user={user}
                isOpen={showModal}
                onClose={() => setShowModal(false)}
              />
            </div>
          ) : (
            <button
              type="button"
              aria-label="Login"
              onClick={handleGoogleLogin}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-gradient-to-b from-black to-zinc-900 text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition hover:border-white/60 hover:bg-white/10 sm:h-12 sm:w-12"
            >
              <FaUser className="text-xl text-white sm:text-2xl" />
            </button>
          )}
        </div>
        {showFilters && (
          <div className="flex w-full max-w-2xl flex-wrap items-center gap-1.5 text-left sm:gap-3">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Year (e.g., 2015)"
              value={yearFilter}
              onChange={(event) => handleYearChange(event.target.value)}
              className="h-9 min-w-[95px] flex-none rounded-xl border border-white/15 bg-gradient-to-r from-black/70 to-zinc-900/70 px-2.5 text-[11px] text-white placeholder:text-white/50 shadow-[0_6px_20px_rgba(0,0,0,0.4)] transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 sm:h-auto sm:px-4 sm:py-2.5 sm:text-sm md:max-w-[180px]"
            />
            <div className="flex flex-1 flex-nowrap items-stretch gap-1 sm:flex-wrap sm:gap-3">
              {TYPE_OPTIONS.map((option) => {
                const isActive = typeFilter === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleTypeSelect(option.value)}
                    className={`flex-1 min-w-0 rounded-xl border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide transition sm:flex-none sm:min-w-[90px] sm:px-4 sm:py-2 sm:text-sm ${
                      isActive
                        ? 'border-white bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.2)]'
                        : 'border-white/20 bg-white/5 text-white hover:border-white/60 hover:bg-white/20'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default MovieHeader

