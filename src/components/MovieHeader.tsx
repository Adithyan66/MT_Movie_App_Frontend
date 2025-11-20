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
  onShowFavorites: () => void
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
    <header className="relative w-full px-4 text-white">
      <div className="absolute inset-0 -z-10 mx-auto h-64 w-[90%] max-w-4xl rounded-[36px]  border-white/10 bg-gradient-to-b from-black to-zinc-900 opacity-80 blur-3xl" />
      <div className="mx-auto flex w-full flex-col items-center gap-6 rounded-[32px]  border-white/10 bg-gradient-to-b from-black/80 via-zinc-950/70 to-black/80 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Immersive Black & White Cinema</p>
          <h1 className="bg-gradient-to-r from-white via-zinc-200 to-white bg-clip-text text-4xl font-semibold uppercase tracking-[0.3em] text-transparent drop-shadow-[0_4px_25px_rgba(255,255,255,0.25)] transition-all duration-500 hover:tracking-[0.5em]">
            Movie Mania
          </h1>
        </div>

        <div className="flex w-full max-w-2xl items-center justify-center gap-3" role="search">
          <div className="relative flex-1">
            <input
              type="search"
              placeholder="Search for a movie"
              value={searchQuery}
              onChange={(event) => handleChange(event.target.value)}
              aria-busy={isSearching}
              className="w-full rounded-xl border border-white/10 bg-gradient-to-r from-black/60 to-zinc-900/60 px-5 py-3.5 pr-14 text-base text-white placeholder:text-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button
              type="button"
              aria-label="Toggle filters"
              aria-pressed={showFilters}
              onClick={() => setShowFilters((prev) => !prev)}
              className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-white/40 hover:bg-white/20"
            >
              <FiFilter className="text-lg" />
            </button>
          </div>

          <button
            type="button"
            aria-label="Favourites"
            onClick={onShowFavorites}
              className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-gradient-to-b from-black to-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition hover:border-white/60 hover:shadow-[0_20px_40px_rgba(0,0,0,0.65)]"
          >
              <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition group-hover:opacity-100" />
              <FaHeart className="text-2xl text-white transition group-hover:scale-110" />
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                aria-label="User Profile"
                onClick={() => setShowModal(true)}
                className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition hover:border-white/60 hover:bg-white/10"
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
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-gradient-to-b from-black to-zinc-900 text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition hover:border-white/60 hover:bg-white/10"
            >
              <FaUser className="text-2xl text-white" />
            </button>
          )}
        </div>
        {showFilters && (
          <div className="flex w-full max-w-2xl flex-col gap-3 text-left">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Year (e.g., 2015)"
                value={yearFilter}
                onChange={(event) => handleYearChange(event.target.value)}
                className="w-full rounded-xl border border-white/15 bg-gradient-to-r from-black/70 to-zinc-900/70 px-4 py-3 text-white placeholder:text-white/50 shadow-[0_6px_20px_rgba(0,0,0,0.4)] transition focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 md:max-w-[200px]"
              />
              <div className="flex flex-1 flex-wrap gap-3">
                {TYPE_OPTIONS.map((option) => {
                  const isActive = typeFilter === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleTypeSelect(option.value)}
                      className={`min-w-[90px] rounded-xl border px-4 py-2 text-sm font-medium uppercase tracking-wide transition ${
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
          </div>
        )}
      </div>
    </header>
  )
}

export default MovieHeader

