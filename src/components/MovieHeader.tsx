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
    setYearFilter(value)
    triggerSearch(searchQuery, value, typeFilter)
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
    <header className="w-full px-4 text-white">
      <div className="mx-auto flex w-full flex-col items-center gap-6  p-8 text-center ">
        <h1 className="text-4xl font-semibold tracking-tight">Movie Mania</h1>

        <div className="flex w-full max-w-2xl items-center justify-center gap-3" role="search">
          <div className="relative flex-1">
            <input
              type="search"
              placeholder="Search for a movie"
              value={searchQuery}
              onChange={(event) => handleChange(event.target.value)}
              aria-busy={isSearching}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 pr-12 text-base text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button
              type="button"
              aria-label="Toggle filters"
              aria-pressed={showFilters}
              onClick={() => setShowFilters((prev) => !prev)}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <FiFilter className="text-lg" />
            </button>
          </div>

          <button
            type="button"
            aria-label="Favourites"
            onClick={onShowFavorites}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 transition hover:border-white/60 hover:bg-white/20"
          >
            <FaHeart className="text-2xl text-pink-400" />
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                aria-label="User Profile"
                onClick={() => setShowModal(true)}
                className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/10 transition hover:border-white/60 hover:bg-white/20"
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
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 transition hover:border-white/60 hover:bg-white/20"
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
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 md:max-w-[200px]"
              />
              <div className="flex flex-1 flex-wrap gap-3">
                {TYPE_OPTIONS.map((option) => {
                  const isActive = typeFilter === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleTypeSelect(option.value)}
                      className={`min-w-[90px] rounded-lg border px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? 'border-white bg-white/80 text-black'
                          : 'border-white/30 bg-white/10 text-white hover:border-white/60 hover:bg-white/20'
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

